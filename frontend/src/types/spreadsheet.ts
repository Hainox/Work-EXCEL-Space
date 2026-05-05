export interface SpreadsheetFile {
  id: string
  name: string
  size: number
  uploadedAt: string
  sheetCount: number
}

export interface Sheet {
  name: string
  rows: Row[]
  columns: Column[]
}

export interface Column {
  key: string
  label: string
}

export type CellValue = string | number | boolean | null

export type Row = Record<string, CellValue>

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export interface FilterConfig {
  key: string
  value: string
}
