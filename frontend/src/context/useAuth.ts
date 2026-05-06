import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthState } from './AuthContext'

export type { AuthState }

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
