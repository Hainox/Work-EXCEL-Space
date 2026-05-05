import path from 'path'
import fs from 'fs'
import ExcelJS from 'exceljs'
import { prisma } from '../utils/prisma'

interface SaveInput {
  userId: string
  originalName: string
  size: number
  path: string
}

interface RemoveInput {
  fileId: string
  userId: string
}

interface ReadSheetInput {
  fileId: string
  userId: string
  sheetName: string
}

export const filesService = {
  async save({ userId, originalName, size, path: filePath }: SaveInput) {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(filePath)
    const sheetCount = workbook.worksheets.length

    const record = await prisma.file.create({
      data: {
        userId,
        name: originalName,
        size,
        path: filePath,
        sheetCount,
      },
    })
    return record
  },

  async remove({ fileId, userId }: RemoveInput) {
    const record = await prisma.file.findFirst({ where: { id: fileId, userId } })
    if (!record) throw new Error('File not found')
    if (fs.existsSync(record.path)) fs.unlinkSync(record.path)
    await prisma.file.delete({ where: { id: fileId } })
  },

  async readSheet({ fileId, userId, sheetName }: ReadSheetInput) {
    const record = await prisma.file.findFirst({ where: { id: fileId, userId } })
    if (!record) throw new Error('File not found')

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(record.path)

    const worksheet = workbook.getWorksheet(sheetName)
    if (!worksheet) throw new Error(`Sheet "${sheetName}" not found`)

    const columns: { key: string; label: string }[] = []
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      columns.push({ key: String(colNumber), label: cell.text || `Column ${colNumber}` })
    })

    const rows: Record<string, string | number | boolean | null>[] = []
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return
      const obj: Record<string, string | number | boolean | null> = {}
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const v = cell.value
        if (v === null || v === undefined) {
          obj[String(colNumber)] = null
        } else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          obj[String(colNumber)] = v
        } else {
          obj[String(colNumber)] = String(v)
        }
      })
      rows.push(obj)
    })

    return { name: sheetName, columns, rows }
  },

  buildExportPath(name: string): string {
    return path.join('uploads', name)
  },
}
