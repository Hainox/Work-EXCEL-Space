import { api } from './client'

export interface AuthTokens {
  token: string
}

export const authApi = {
  register(email: string, password: string): Promise<AuthTokens> {
    return api.request<AuthTokens>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  login(email: string, password: string): Promise<AuthTokens> {
    return api.request<AuthTokens>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
}
