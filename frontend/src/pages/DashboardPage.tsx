import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useFiles } from '../hooks/useFiles'
import { filesApi } from '../api/files'
import { FileCard } from '../components/FileCard'
import { UploadZone } from '../components/UploadZone'
import { Spinner } from '../components/Spinner'
import { Button } from '../components/Button'

export function DashboardPage() {
  const { logout } = useAuth()
  const { files, loading, error, refresh, remove } = useFiles()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setUploadError(null)
    try {
      await filesApi.upload(file)
      refresh()
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900">Work EXCEL Space</span>
        </div>
        <Button variant="secondary" onClick={logout}>
          Выйти
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Upload section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Загрузить файл</h2>
          <UploadZone onFile={handleFile} uploading={uploading} />
          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
        </section>

        {/* Files section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Мои файлы</h2>
            <button
              onClick={refresh}
              className="text-sm text-blue-600 hover:underline"
            >
              Обновить
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <Spinner className="w-6 h-6 text-blue-600" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {!loading && !error && files.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              Нет загруженных файлов. Загрузите первый .xlsx файл выше.
            </div>
          )}

          {!loading && files.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((file) => (
                <FileCard key={file.id} file={file} onDelete={remove} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
