import { useState } from 'react'
import type { Column, Row, SortConfig } from '../types/spreadsheet'
import { sortRows } from '../utils/table'

interface TableViewProps {
  columns: Column[]
  rows: Row[]
}

export function TableView({ columns, rows }: TableViewProps) {
  const [sort, setSort] = useState<SortConfig | null>(null)
  const [search, setSearch] = useState('')

  const activeFilter = search.trim()

  const displayed = sortRows(
    activeFilter
      ? rows.filter((row) =>
          columns.some((col) => {
            const val = row[col.key]
            return val != null && String(val).toLowerCase().includes(activeFilter.toLowerCase())
          }),
        )
      : rows,
    sort,
  )

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar */}
      <input
        type="search"
        placeholder="Поиск по всем столбцам..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Stats */}
      <p className="text-xs text-gray-500">
        Показано {displayed.length} из {rows.length} строк
      </p>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap cursor-pointer select-none hover:bg-gray-100 transition-colors border-b border-gray-200"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sort?.key === col.key ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                  Нет данных
                </td>
              </tr>
            ) : (
              displayed.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/40 transition-colors`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {row[col.key] != null ? String(row[col.key]) : '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
