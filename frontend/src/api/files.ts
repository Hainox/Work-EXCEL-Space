import { api } from './client'
import type { SpreadsheetFile, Sheet } from '../types/spreadsheet'

export const filesApi = {
  list(): Promise<SpreadsheetFile[]> {
    return api.request<SpreadsheetFile[]>('/api/files')
  },

  upload(file: File): Promise<SpreadsheetFile> {
    const form = new FormData()
    form.append('file', file)
    return api.request<SpreadsheetFile>('/api/files', {
      method: 'POST',
      headers: {},
      body: form,
    })
  },

  getSheet(fileId: string, sheetName: string): Promise<Sheet> {
    return api.request<Sheet>(`/api/files/${fileId}/sheets/${encodeURIComponent(sheetName)}`)
  },

  remove(fileId: string): Promise<void> {
    return api.request<void>(`/api/files/${fileId}`, { method: 'DELETE' })
  },
}
