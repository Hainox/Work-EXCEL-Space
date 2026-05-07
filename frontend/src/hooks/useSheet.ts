import { useReducer, useEffect, useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { filesApi } from '../api/files'
import type { Sheet, Row } from '../types/spreadsheet'

interface State {
  sheet: Sheet | null
  loading: boolean
  error: string | null
  rows: Row[]
}

type Action =
  | { type: 'FETCHING' }
  | { type: 'SUCCESS'; sheet: Sheet }
  | { type: 'ERROR'; error: string }
  | { type: 'SET_ROWS'; value: SetStateAction<Row[]> }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCHING':
      return { sheet: null, loading: true, error: null, rows: [] }
    case 'SUCCESS':
      return { sheet: action.sheet, loading: false, error: null, rows: action.sheet.rows }
    case 'ERROR':
      return { sheet: null, loading: false, error: action.error, rows: [] }
    case 'SET_ROWS':
      return {
        ...state,
        rows: typeof action.value === 'function' ? action.value(state.rows) : action.value,
      }
  }
}

interface UseSheetResult {
  sheet: Sheet | null
  loading: boolean
  error: string | null
  rows: Row[]
  setRows: Dispatch<SetStateAction<Row[]>>
}

export function useSheet(fileId: string, sheetName: string): UseSheetResult {
  const [state, dispatch] = useReducer(reducer, {
    sheet: null,
    loading: true,
    error: null,
    rows: [],
  })

  const fetchSheet = useCallback(
    (signal: AbortSignal) =>
      filesApi
        .getSheet(fileId, sheetName)
        .then((sheet) => {
          if (!signal.aborted) {
            dispatch({ type: 'SUCCESS', sheet })
          }
        })
        .catch((e: unknown) => {
          if (!signal.aborted)
            dispatch({ type: 'ERROR', error: e instanceof Error ? e.message : 'Failed to load sheet' })
        }),
    [fileId, sheetName],
  )

  useEffect(() => {
    const controller = new AbortController()
    dispatch({ type: 'FETCHING' })
    fetchSheet(controller.signal)
    return () => controller.abort()
  }, [fetchSheet])

  const setRows = useCallback((value: SetStateAction<Row[]>) => {
    dispatch({ type: 'SET_ROWS', value })
  }, [])

  return { ...state, rows: state.rows, setRows }
}
