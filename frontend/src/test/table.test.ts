import { describe, it, expect } from 'vitest'
import { sortRows, filterRows, formatFileSize } from '../utils/table'
import type { Row } from '../types/spreadsheet'

const rows: Row[] = [
  { name: 'Alice', score: 90 },
  { name: 'Bob', score: 75 },
  { name: 'Charlie', score: 85 },
]

describe('sortRows', () => {
  it('sorts ascending', () => {
    const sorted = sortRows(rows, { key: 'score', direction: 'asc' })
    expect(sorted.map((r) => r.score)).toEqual([75, 85, 90])
  })

  it('sorts descending', () => {
    const sorted = sortRows(rows, { key: 'score', direction: 'desc' })
    expect(sorted.map((r) => r.score)).toEqual([90, 85, 75])
  })

  it('returns original order when sort is null', () => {
    expect(sortRows(rows, null)).toEqual(rows)
  })
})

describe('filterRows', () => {
  it('filters by substring (case-insensitive)', () => {
    const result = filterRows(rows, [{ key: 'name', value: 'ali' }])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alice')
  })

  it('returns all rows when filters array is empty', () => {
    expect(filterRows(rows, [])).toEqual(rows)
  })
})

describe('formatFileSize', () => {
  it('formats bytes', () => expect(formatFileSize(512)).toBe('512 B'))
  it('formats kilobytes', () => expect(formatFileSize(2048)).toBe('2.0 KB'))
  it('formats megabytes', () => expect(formatFileSize(1_572_864)).toBe('1.5 MB'))
})
