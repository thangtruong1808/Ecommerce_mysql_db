/**
 * Authentication Context - Manages auth state, token refresh, and auto-logout
 * @author Thang Truong
 * @date 2025-01-09
 */

import { createContext, useState, useContext, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AuthContext = createContext()

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Auth Provider Component
 * @param {Object} props - Component props with children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isRedirectingRef = useRef(false)

  // Configure axios to send cookies
  axios.defaults.withCredentials = true

  /**
   * Handle automatic logout when refresh token expires
   */
  const handleTokenExpiration = async () => {
    if (isRedirectingRef.current) return
    isRedirectingRef.current = true
    setUser(null)
    setError(null)
    const path = window.location.pathname
    if (path !== '/login' && path !== '/register') {
      toast.info('Your session has expired. Please login again.')
      setTimeout(() => { window.location.href = '/login' }, 100)
    } else {
      isRedirectingRef.current = false
    }
  }

  /**
   * Fetch current user profile - silently handles 401 errors
   */
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/profile', {
        validateStatus: (status) => status === 200 || status === 401
      })
      if (response.status === 200) {
        setUser(response.data)
        setError(null)
      } else {
        const path = window.location.pathname
        const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
        if (!isAuthPage) {
          const refreshResponse = await axios.post('/api/auth/refresh', {}, {
            validateStatus: (status) => status === 200 || status === 401
          }).catch(() => ({ status: 401 }))
          if (refreshResponse.status === 401) {
            await handleTokenExpiration()
          } else {
            setUser(null)
            setError(null)
          }
        } else {
          setUser(null)
          setError(null)
        }
      }
    } catch (error) {
      setUser(null)
      if (error.response?.status !== 401) {
        setError(error.response?.data?.message || 'Failed to fetch user')
      } else {
        setError(null)
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Check refresh token expiration periodically when user is authenticated
   */
  useEffect(() => {
    if (!user) return
    const checkTokenExpiration = async () => {
      try {
        const response = await axios.post('/api/auth/refresh', {}, {
          validateStatus: (status) => status === 200 || status === 401
        })
        if (response.status === 401) {
          await handleTokenExpiration()
        }
      } catch (error) {
        if (error.response?.status === 401) {
          await handleTokenExpiration()
        }
      }
    }
    checkTokenExpiration()
    const interval = setInterval(checkTokenExpiration, 60 * 1000)
    return () => clearInterval(interval)
  }, [user])

  /**
   * Initialize auth state on mount - skip on auth pages
   */
  useEffect(() => {
    const path = window.location.pathname
    const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
    if (!isAuthPage) fetchUser()
    else setLoading(false)
  }, [])

  /**
   * Login user - silently handles 401 errors without console logging
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Result object with success status
   */
  const login = async (email, password) => {
    const originalError = console.error
    const originalWarn = console.warn
    console.error = console.warn = () => {}
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/auth/login', true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.withCredentials = true
      xhr.onload = () => {
        console.error = originalError
        console.warn = originalWarn
        try {
          const data = JSON.parse(xhr.responseText || '{}')
          if (xhr.status === 200) {
            setUser(data)
            setError(null)
            resolve({ success: true })
          } else {
            const message = data?.message || 'Invalid email or password'
            setError(message)
            resolve({ success: false, error: message })
          }
        } catch {
          setError('Invalid email or password')
          resolve({ success: false, error: 'Invalid email or password' })
        }
      }
      xhr.onerror = () => {
        console.error = originalError
        console.warn = originalWarn
        setError('Login failed. Please try again.')
        resolve({ success: false, error: 'Login failed. Please try again.' })
      }
      xhr.send(JSON.stringify({ email, password }))
    })
  }

  /**
   * Register new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Result object with success status
   */
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password })
      setUser(response.data)
      setError(null)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed'
      setError(message)
      return { success: false, error: message }
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch {
      // Silent fail
    } finally {
      setUser(null)
      setError(null)
    }
  }

  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Result object with success status
   */
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/api/auth/profile', userData)
      setUser(response.data)
      setError(null)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      setError(message)
      return { success: false, error: message }
    }
  }

  /**
   * Refresh access token - called automatically when access token expires
   * @returns {Promise<boolean>} Success status
   */
  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh', {}, {
        validateStatus: (status) => status === 200 || status === 401
      })
      if (response.status === 200) return true
      await handleTokenExpiration()
      return false
    } catch (error) {
      if (error.response?.status === 401) {
        await handleTokenExpiration()
      } else {
        setUser(null)
      }
      return false
    }
  }

  // Axios interceptor for automatic token refresh and auto-logout
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && (originalRequest.url?.includes('/api/auth/login') || originalRequest.url?.includes('/api/auth/profile'))) {
          return Promise.reject(error)
        }
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          if (originalRequest.url?.includes('/api/auth/refresh')) {
            await handleTokenExpiration()
            return Promise.reject(error)
          }
          const refreshed = await refreshToken()
          if (refreshed) {
            return axios(originalRequest)
          } else {
            await handleTokenExpiration()
          }
        }
        return Promise.reject(error)
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
