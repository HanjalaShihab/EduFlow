import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { authApi } from '../services/api'
import type { User, LoginCredentials, RegisterData } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const response = await authApi.user()
      setUser(response.data.data)
    } catch {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('institution_id')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.login(credentials)
      const { user: userData, token } = response.data.data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      if (userData.institution_id) {
        localStorage.setItem('institution_id', String(userData.institution_id))
      }
      setUser(userData)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.register(data)
      const { user: userData, token } = response.data.data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      if (userData.institution_id) {
        localStorage.setItem('institution_id', String(userData.institution_id))
      }
      setUser(userData)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Clear local state even if API call fails
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('institution_id')
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

