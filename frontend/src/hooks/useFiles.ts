import { useReducer, useEffect, useCallback } from 'react'
import { filesApi } from '../api/files'
import type { SpreadsheetFile } from '../types/spreadsheet'

interface State {
  files: SpreadsheetFile[]
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'FETCHING' }
  | { type: 'SUCCESS'; files: SpreadsheetFile[] }
  | { type: 'ERROR'; error: string }
  | { type: 'REMOVE'; id: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCHING':
      return { ...state, loading: true, error: null }
    case 'SUCCESS':
      return { files: action.files, loading: false, error: null }
    case 'ERROR':
      return { ...state, loading: false, error: action.error }
    case 'REMOVE':
      return { ...state, files: state.files.filter((f) => f.id !== action.id) }
  }
}

interface UseFilesResult {
  files: SpreadsheetFile[]
  loading: boolean
  error: string | null
  refresh: () => void
  remove: (id: string) => Promise<void>
}

export function useFiles(): UseFilesResult {
  const [state, dispatch] = useReducer(reducer, { files: [], loading: true, error: null })
  const [tick, refreshTick] = useReducer((n: number) => n + 1, 0)

  const fetchFiles = useCallback(
    (signal: AbortSignal) =>
      filesApi
        .list()
        .then((files) => {
          if (!signal.aborted) dispatch({ type: 'SUCCESS', files })
        })
        .catch((e: unknown) => {
          if (!signal.aborted)
            dispatch({ type: 'ERROR', error: e instanceof Error ? e.message : 'Unknown error' })
        }),
    [],
  )

  useEffect(() => {
    const controller = new AbortController()
    dispatch({ type: 'FETCHING' })
    fetchFiles(controller.signal)
    return () => controller.abort()
  }, [fetchFiles, tick])

  async function remove(id: string) {
    await filesApi.remove(id)
    dispatch({ type: 'REMOVE', id })
  }

  return { ...state, refresh: refreshTick, remove }
}
