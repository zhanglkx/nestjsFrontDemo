'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { User, LoginRequest, LoginResponse } from '@/types/admin'
import {
  login as authLogin,
  getCurrentUser,
  saveAuthToCookie,
  clearAuth,
  isAuthenticated
} from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<LoginResponse>
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 检查认证状态
  const checkAuth = useCallback(() => {
    setIsLoading(true)
    try {
      // 确保在客户端环境中运行
      if (typeof window !== 'undefined') {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser()
          setUser(currentUser)
        } else {
          setUser(null)
        }
      } else {
        // 服务器端渲染时，设置为未认证状态
        setUser(null)
      }
    } catch (error) {
      console.error('检查认证状态失败:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 登录函数
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setIsLoading(true)
    try {
      const response = await authLogin(credentials)

      if (response.success && response.token && response.user) {
        saveAuthToCookie(response.token, response.user)
        setUser(response.user)
      }

      return response
    } catch (error) {
      console.error('登录失败:', error)
      return {
        success: false,
        message: '登录过程中发生错误'
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 登出函数
  const logout = () => {
    clearAuth()
    setUser(null)
  }

  // 组件挂载时检查认证状态
  useEffect(() => {
    // 延迟执行，确保组件完全挂载
    const timeoutId = setTimeout(() => {
      checkAuth()
    }, 0)
    
    return () => clearTimeout(timeoutId)
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 使用认证Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用')
  }
  return context
}

// 认证守卫组件
interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || null
  }

  return <>{children}</>
}
