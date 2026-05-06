import { useState, useCallback } from 'react'
import { authApi } from '../api/auth'
import { tokenStore } from '../api/client'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(tokenStore.get()))

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await authApi.login(email, password)
    tokenStore.set(token)
    setIsAuthenticated(true)
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const { token } = await authApi.register(email, password)
    tokenStore.set(token)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
