import type { Row, SortConfig, FilterConfig } from '../types/spreadsheet'

export function sortRows(rows: Row[], sort: SortConfig | null): Row[] {
  if (!sort) return rows
  return [...rows].sort((a, b) => {
    const av = a[sort.key]
    const bv = b[sort.key]
    if (av === bv) return 0
    const cmp = av == null ? -1 : bv == null ? 1 : av < bv ? -1 : 1
    return sort.direction === 'asc' ? cmp : -cmp
  })
}

export function filterRows(rows: Row[], filters: FilterConfig[]): Row[] {
  if (!filters.length) return rows
  return rows.filter((row) =>
    filters.every((f) => {
      const val = row[f.key]
      return val != null && String(val).toLowerCase().includes(f.value.toLowerCase())
    }),
  )
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
