/**
 * Authentication Context - Manages auth state, token refresh, and auto-logout
 * @author Thang Truong
 * @date 2025-12-12
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
  const isFetchingUserRef = useRef(false)

  // Configure axios to send cookies
  axios.defaults.withCredentials = true

  // Suppress 401 errors in browser console for auth endpoints on public pages
  useEffect(() => {
    const originalError = console.error
    
    // Axios response interceptor to silence expected 401 errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const path = window.location.pathname
        const isProtected = isProtectedRoute()
        const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
        const isPublicPage = !isProtected && !isAuthPage
        const isAuthEndpoint = error.config?.url?.includes('/api/auth/') || error.config?.url?.includes('/api/auth/refresh')
        
        // Silence 401 errors for auth endpoints on public pages
        if (isPublicPage && isAuthEndpoint && error.response?.status === 401) {
          error._silent = true
        }
        return Promise.reject(error)
      }
    )
    
    // Console.error override to suppress silent 401 errors
    console.error = (...args) => {
      const error = args[0]
      if (error?._silent) {
        return // Suppress silent errors
      }
      originalError(...args)
    }

    return () => {
      axios.interceptors.response.eject(responseInterceptor)
      console.error = originalError
    }
  }, [])

  /**
   * Check if current route is protected (requires authentication)
   * @returns {boolean} True if route is protected
   * @author Thang Truong
   * @date 2025-12-12
   */
  const isProtectedRoute = () => {
    const path = window.location.pathname
    const protectedPaths = [
      '/profile',
      '/checkout',
      '/orders',
      '/invoices',
      '/admin'
    ]
    return protectedPaths.some(protectedPath => path.startsWith(protectedPath))
  }

  /**
   * Handle automatic logout when refresh token expires
   * Only redirects and clears user if on a protected route
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleTokenExpiration = async () => {
    if (isRedirectingRef.current) return
    isRedirectingRef.current = true
    const path = window.location.pathname
    const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
    
    // Only clear user and redirect if on a protected route and not already on auth page
    if (!isAuthPage && isProtectedRoute()) {
      setUser(null)
      setError(null)
      toast.info('Your session has expired. Please login again.')
      setTimeout(() => { window.location.href = '/login' }, 100)
    } else {
      // Public route - don't clear user state, just reset redirect flag
      isRedirectingRef.current = false
    }
  }

  /**
   * Check if refresh token cookie exists
   * @returns {boolean} True if refresh token cookie exists
   * @author Thang Truong
   * @date 2025-12-12
   */
  const hasRefreshToken = () => {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith('refreshToken='))
  }

  /**
   * Fetch current user - silent auth check
   * Uses /api/auth/me which never returns 401, always returns user or null
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchUser = async () => {
    // Prevent duplicate calls (React StrictMode in development)
    if (isFetchingUserRef.current) return
    isFetchingUserRef.current = true

    try {
      // Use silent auth check endpoint that never returns 401
      const response = await axios.get('/api/auth/me')
      if (response.data.user) {
        setUser(response.data.user)
        setError(null)
      } else {
        setUser(null)
        setError(null)
      }
    } catch (error) {
      // Silent fail - /api/auth/me should never error, but handle gracefully
      setUser(null)
      setError(null)
    } finally {
      setLoading(false)
      isFetchingUserRef.current = false
    }
  }

  /**
   * Check refresh token expiration periodically when user is authenticated
   * @author Thang Truong
   * @date 2025-12-12
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
   * Initialize auth state on mount - always check auth to restore user state
   * This ensures authenticated users stay logged in on refresh for all pages
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    // Always fetch user on mount to restore authentication state
    // This ensures authenticated users stay logged in after page refresh on all pages
    // 401 errors on public pages for unauthenticated users are suppressed
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Login user - silently handles 401 errors without console logging
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Result object with success status
   * @author Thang Truong
   * @date 2025-12-12
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
          // Check if response has error message (backend returns 200 with message for wrong creds)
          if (data.message && !data._id) {
            const message = data.message || 'Invalid email or password'
            setError(message)
            resolve({ success: false, error: message })
          } else if (xhr.status === 200 && data._id) {
            // Success: response has user data
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
   * @author Thang Truong
   * @date 2025-12-12
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
   * @author Thang Truong
   * @date 2025-12-12
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
   * @author Thang Truong
   * @date 2025-12-12
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
   * @author Thang Truong
   * @date 2025-12-12
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
      (response) => {
        // Success responses - don't interfere, just return
        return response
      },
      async (error) => {
        const originalRequest = error.config
        // Handle 429 errors (rate limit) - don't retry, just reject silently
        if (error.response?.status === 429) {
          // Don't show toast for rate limit errors - they're expected during rapid refreshes
          return Promise.reject(error)
        }
        // Only handle 401 errors
        if (!error.response || error.response.status !== 401) {
          return Promise.reject(error)
        }
        // Don't intercept 401 errors from auth endpoints
        if (originalRequest.url?.includes('/api/auth/login') || 
            originalRequest.url?.includes('/api/auth/profile') ||
            originalRequest.url?.includes('/api/auth/register')) {
          return Promise.reject(error)
        }
        // Handle 401 errors on protected endpoints
        if (!originalRequest._retry) {
          originalRequest._retry = true
          // If refresh endpoint returns 401, refresh token expired
          if (originalRequest.url?.includes('/api/auth/refresh')) {
            // Only clear user and redirect if on protected route
            if (isProtectedRoute()) {
              await handleTokenExpiration()
            }
            return Promise.reject(error)
          }
          // Try to refresh token
          try {
            const refreshResponse = await axios.post('/api/auth/refresh', {}, {
              validateStatus: (status) => status === 200 || status === 401
            })
            if (refreshResponse.status === 200) {
              // Token refreshed successfully - retry original request
              return axios(originalRequest)
            } else {
              // Refresh token expired - only logout if on protected route
              if (isProtectedRoute()) {
                await handleTokenExpiration()
              }
              return Promise.reject(error)
            }
          } catch (refreshError) {
            // Refresh failed - check if it's 401 (expired) or other error
            if (refreshError.response?.status === 401) {
              // Refresh token expired - only logout if on protected route
              if (isProtectedRoute()) {
                await handleTokenExpiration()
              }
            }
            return Promise.reject(error)
          }
        }
        return Promise.reject(error)
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  /**
   * Check authentication - can be called manually when needed
   * @author Thang Truong
   * @date 2025-12-12
   */
  const checkAuth = () => {
    if (isProtectedRoute() && !isFetchingUserRef.current) {
      fetchUser()
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }

  return (
    /* Auth context provider */
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
