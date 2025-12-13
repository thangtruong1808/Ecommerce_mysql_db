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

  // Suppress console errors for expected 401 responses from auth endpoints
  useEffect(() => {
    const originalError = console.error
    const originalWarn = console.warn
    
    const suppressAuth401Errors = (args) => {
      const message = args[0]?.toString() || ''
      const stack = args.join(' ') || ''
      return (
        (message.includes('401') || stack.includes('401')) &&
        (message.includes('/api/auth/profile') || 
         message.includes('/api/auth/refresh') ||
         stack.includes('/api/auth/profile') ||
         stack.includes('/api/auth/refresh') ||
         message.includes('Unauthorized'))
      )
    }

    console.error = (...args) => {
      if (!suppressAuth401Errors(args)) {
        originalError(...args)
      }
    }

    console.warn = (...args) => {
      if (!suppressAuth401Errors(args)) {
        originalWarn(...args)
      }
    }

    return () => {
      console.error = originalError
      console.warn = originalWarn
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
   * Only redirects if on a protected route
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleTokenExpiration = async () => {
    if (isRedirectingRef.current) return
    isRedirectingRef.current = true
    setUser(null)
    setError(null)
    const path = window.location.pathname
    const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
    
    // Only redirect if on a protected route and not already on auth page
    if (!isAuthPage && isProtectedRoute()) {
      toast.info('Your session has expired. Please login again.')
      setTimeout(() => { window.location.href = '/login' }, 100)
    } else {
      isRedirectingRef.current = false
    }
  }

  /**
   * Fetch current user profile - silently handles 401 errors
   * Only redirects to login if on protected route and refresh token expired
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchUser = async () => {
    // Prevent duplicate calls (React StrictMode in development)
    if (isFetchingUserRef.current) return
    isFetchingUserRef.current = true

    try {
      // Suppress console errors for expected 401 responses
      const originalError = console.error
      console.error = (...args) => {
        // Only suppress 401 errors from auth endpoints
        const errorMessage = args[0]?.toString() || ''
        if (errorMessage.includes('401') && (errorMessage.includes('/api/auth/profile') || errorMessage.includes('/api/auth/refresh'))) {
          return
        }
        originalError(...args)
      }

      const response = await axios.get('/api/auth/profile', {
        validateStatus: (status) => status === 200 || status === 401
      }).finally(() => {
        // Restore console.error
        console.error = originalError
      })
      if (response.status === 200) {
        setUser(response.data)
        setError(null)
      } else {
        const path = window.location.pathname
        const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
        
        if (!isAuthPage) {
          // Suppress console errors for expected 401 responses
          const originalError = console.error
          console.error = (...args) => {
            const errorMessage = args[0]?.toString() || ''
            if (errorMessage.includes('401') && errorMessage.includes('/api/auth/refresh')) {
              return
            }
            originalError(...args)
          }

          // Try to refresh the access token
          const refreshResponse = await axios.post('/api/auth/refresh', {}, {
            validateStatus: (status) => status === 200 || status === 401
          }).catch(() => ({ status: 401 })).finally(() => {
            // Restore console.error
            console.error = originalError
          })
          
          if (refreshResponse.status === 401) {
            // Refresh token expired or doesn't exist
            // Only redirect if on protected route, otherwise just set user to null
            if (isProtectedRoute()) {
              await handleTokenExpiration()
            } else {
              // Public route - just set user to null, don't redirect
              setUser(null)
              setError(null)
            }
          } else {
            // Refresh token valid - retry fetching user profile with new access token
            try {
              // Suppress console errors for expected 401 responses
              const originalError = console.error
              console.error = (...args) => {
                const errorMessage = args[0]?.toString() || ''
                if (errorMessage.includes('401') && errorMessage.includes('/api/auth/profile')) {
                  return
                }
                originalError(...args)
              }

              const retryResponse = await axios.get('/api/auth/profile', {
                validateStatus: (status) => status === 200 || status === 401
              }).finally(() => {
                // Restore console.error
                console.error = originalError
              })
              if (retryResponse.status === 200) {
                setUser(retryResponse.data)
                setError(null)
              } else {
                // Still 401 after refresh - only redirect if on protected route
                if (isProtectedRoute()) {
                  await handleTokenExpiration()
                } else {
                  setUser(null)
                  setError(null)
                }
              }
            } catch (retryError) {
              // If retry fails, check if it's 401 (expired) or other error
              if (retryError.response?.status === 401) {
                if (isProtectedRoute()) {
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
          }
        } else {
          // On auth pages, just set user to null
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
   * Initialize auth state on mount - only check auth on protected routes
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const path = window.location.pathname
    const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
    
    // Only fetch user if on protected route, otherwise skip authentication check
    if (isProtectedRoute()) {
      fetchUser()
    } else if (isAuthPage) {
      setLoading(false)
    } else {
      // Public page - no auth check needed, just set loading to false
      setLoading(false)
      // Don't clear user on public pages - keep it if user was logged in
    }
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
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && 
            (originalRequest.url?.includes('/api/auth/login') || 
             originalRequest.url?.includes('/api/auth/profile'))) {
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
