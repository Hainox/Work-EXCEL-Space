import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SpreadsheetFile } from '../types/spreadsheet'
import { formatFileSize } from '../utils/table'
import { Button } from './Button'
import { Badge } from './Badge'

interface FileCardProps {
  file: SpreadsheetFile
  onDelete: (id: string) => Promise<void>
}

export function FileCard({ file, onDelete }: FileCardProps) {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm(`Удалить файл «${file.name}»?`)) return
    setDeleting(true)
    try {
      await onDelete(file.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
      onClick={() => navigate(`/files/${file.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/files/${file.id}`)}
    >
      {/* Icon + name */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-green-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M3 6h18M3 14h18M3 18h18"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate text-sm">{file.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(file.size)}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <Badge variant="gray">{file.sheetCount} лист{file.sheetCount > 1 ? 'ов' : ''}</Badge>
        <Button
          variant="danger"
          className="!px-2 !py-1 text-xs"
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? '...' : 'Удалить'}
        </Button>
      </div>
    </div>
  )
}
