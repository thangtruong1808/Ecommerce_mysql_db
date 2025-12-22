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
  const isRefreshingTokenRef = useRef(false)
  const lastRefreshTimeRef = useRef(0)
  const userFetchedTimeRef = useRef(0)

  // Configure axios to send cookies
  axios.defaults.withCredentials = true

  // Suppress 401 errors for auth endpoints on public pages
  useEffect(() => {
    // Axios response interceptor to handle expected 401 errors silently
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const path = window.location.pathname
        const isProtected = isProtectedRoute()
        const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
        const isPublicPage = !isProtected && !isAuthPage
        const isAuthEndpoint = error.config?.url?.includes('/api/auth/') || error.config?.url?.includes('/api/auth/refresh')
        
        // Mark 401 errors as silent for auth endpoints on public pages or for refresh token checks
        if ((isPublicPage && isAuthEndpoint) || error.config?._silent) {
          if (error.response?.status === 401) {
            error._silent = true
          }
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(responseInterceptor)
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
      // Handle 429 errors gracefully - don't clear user on rate limit
      if (error.response?.status === 429) {
        error._silent = true
        if (error.config) {
          error.config._silent = true
        }
        // Don't clear user on rate limit - just set loading to false
        setLoading(false)
        isFetchingUserRef.current = false
        userFetchedTimeRef.current = Date.now()
        return
      }
      // Silent fail - /api/auth/me should never error, but handle gracefully
      setUser(null)
      setError(null)
    } finally {
      setLoading(false)
      isFetchingUserRef.current = false
      userFetchedTimeRef.current = Date.now()
    }
  }

  /**
   * Check refresh token expiration periodically when user is authenticated
   * @author Thang Truong
   * @date 2025-12-12
   */
  /**
   * Check refresh token expiration periodically when user is authenticated
   * Silently handles 401 errors to avoid console noise
   * Prevents duplicate refresh calls to avoid 429 rate limit errors
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    if (!user) return
    
    const checkTokenExpiration = async () => {
      const path = window.location.pathname
      const isProtected = isProtectedRoute()
      const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
      const isPublicPage = !isProtected && !isAuthPage
      
      // Don't check token expiration on public pages to avoid console errors
      if (isPublicPage) return
      
      // Prevent duplicate refresh calls - only allow one refresh per 5 seconds
      const now = Date.now()
      if (isRefreshingTokenRef.current || (now - lastRefreshTimeRef.current < 5000)) {
        return
      }
      
      // Don't check immediately after fetching user - wait at least 3 seconds
      // This prevents simultaneous calls on page refresh
      if (userFetchedTimeRef.current > 0 && (now - userFetchedTimeRef.current < 3000)) {
        return
      }
      
      isRefreshingTokenRef.current = true
      lastRefreshTimeRef.current = now
      
      try {
        const response = await axios.post('/api/auth/refresh', {}, {
          validateStatus: (status) => status === 200 || status === 401
        })
        if (response.status === 401) {
          await handleTokenExpiration()
        }
      } catch (error) {
        // Handle 429 errors gracefully - don't logout user
        if (error.response?.status === 429) {
          error._silent = true
          if (error.config) {
            error.config._silent = true
          }
          // Don't logout on rate limit - just wait and retry later
          isRefreshingTokenRef.current = false
          return
        }
        // Mark as silent to avoid console errors
        if (error.config) {
          error.config._silent = true
        }
        error._silent = true
        if (error.response?.status === 401) {
          await handleTokenExpiration()
        }
      } finally {
        // Reset flag after a delay to allow periodic checks
        setTimeout(() => {
          isRefreshingTokenRef.current = false
        }, 5000)
      }
    }
    
    // Wait 3 seconds after user is set before first check to avoid simultaneous calls with fetchUser
    // This prevents 429 rate limit errors on page refresh
    const initialDelay = setTimeout(() => {
      checkTokenExpiration()
      // Periodic checks every 60 seconds
      const interval = setInterval(checkTokenExpiration, 60 * 1000)
      return () => clearInterval(interval)
    }, 3000)
    
    return () => clearTimeout(initialDelay)
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
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/auth/login', true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.withCredentials = true
      xhr.onload = () => {
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
   * Prevents duplicate calls to avoid 429 rate limit errors
   * @returns {Promise<boolean>} Success status
   * @author Thang Truong
   * @date 2025-12-17
   */
  const refreshToken = async () => {
    // Prevent duplicate refresh calls - only allow one refresh per 5 seconds
    const now = Date.now()
    if (isRefreshingTokenRef.current || (now - lastRefreshTimeRef.current < 5000)) {
      return false
    }
    
    isRefreshingTokenRef.current = true
    lastRefreshTimeRef.current = now
    
    try {
      const response = await axios.post('/api/auth/refresh', {}, {
        validateStatus: (status) => status === 200 || status === 401
      })
      isRefreshingTokenRef.current = false
      if (response.status === 200) return true
      await handleTokenExpiration()
      return false
    } catch (error) {
      isRefreshingTokenRef.current = false
      // Handle 429 errors gracefully - don't logout user
      if (error.response?.status === 429) {
        error._silent = true
        if (error.config) {
          error.config._silent = true
        }
        return false
      }
      if (error.response?.status === 401) {
        await handleTokenExpiration()
      } else {
        setUser(null)
      }
      return false
    }
  }

  // Request interceptor to mark refresh token calls as silent on public pages
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const path = window.location.pathname
        const isProtected = isProtectedRoute()
        const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
        const isPublicPage = !isProtected && !isAuthPage
        
        // Mark refresh token calls as silent on public pages
        if (config.url?.includes('/api/auth/refresh') && isPublicPage) {
          config._silent = true
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    return () => axios.interceptors.request.eject(requestInterceptor)
  }, [])

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
        // Handle 401 errors on protected endpoints only
        // Don't try to refresh token on public pages for unauthenticated users
        const path = window.location.pathname
        const isProtected = isProtectedRoute()
        const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
        const isPublicPage = !isProtected && !isAuthPage
        
        if (!originalRequest._retry) {
          originalRequest._retry = true
          // If refresh endpoint returns 401, refresh token expired
          if (originalRequest.url?.includes('/api/auth/refresh')) {
            // Mark as silent for public pages
            if (isPublicPage) {
              error._silent = true
              if (error.config) {
                error.config._silent = true
              }
            }
            // Only clear user and redirect if on protected route
            if (isProtected) {
              await handleTokenExpiration()
            }
            return Promise.reject(error)
          }
          // Only try to refresh token on protected pages
          // On public pages, just reject the error silently
          if (isPublicPage) {
            error._silent = true
            if (error.config) {
              error.config._silent = true
            }
            return Promise.reject(error)
          }
          // Try to refresh token (only on protected pages)
          // Prevent duplicate refresh calls to avoid 429 rate limit errors
          const now = Date.now()
          if (isRefreshingTokenRef.current || (now - lastRefreshTimeRef.current < 5000)) {
            // If refresh is in progress or was recent, reject to avoid 429
            error._silent = true
            if (error.config) {
              error.config._silent = true
            }
            return Promise.reject(error)
          }
          
          isRefreshingTokenRef.current = true
          lastRefreshTimeRef.current = now
          
          // Mark refresh call as silent to suppress console errors
          try {
            const refreshResponse = await axios.post('/api/auth/refresh', {}, {
              validateStatus: (status) => status === 200 || status === 401,
              _silent: true // Mark as silent to suppress console errors
            })
            isRefreshingTokenRef.current = false
            if (refreshResponse.status === 200) {
              // Token refreshed successfully - retry original request
              return axios(originalRequest)
            } else {
              // Refresh token expired - only logout if on protected route
              if (isProtected) {
                await handleTokenExpiration()
              }
              return Promise.reject(error)
            }
          } catch (refreshError) {
            isRefreshingTokenRef.current = false
            // Handle 429 errors gracefully - don't logout user
            if (refreshError.response?.status === 429) {
              refreshError._silent = true
              if (refreshError.config) {
                refreshError.config._silent = true
              }
              // Don't logout on rate limit - just reject the original error
              return Promise.reject(error)
            }
            // Mark refresh error as silent to suppress console errors
            if (refreshError.config) {
              refreshError.config._silent = true
            }
            refreshError._silent = true
            // Refresh failed - check if it's 401 (expired) or other error
            if (refreshError.response?.status === 401) {
              // Refresh token expired - only logout if on protected route
              if (isProtected) {
                await handleTokenExpiration()
              }
            }
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  /**
   * Check authentication - can be called manually when needed
   * Always fetches user to ensure auth state is current, especially on page refresh
   * Prevents duplicate calls to avoid 429 rate limit errors
   * @author Thang Truong
   * @date 2025-12-17
   */
  const checkAuth = () => {
    // Prevent duplicate calls - only fetch if not already fetching
    // This prevents 429 rate limit errors from multiple simultaneous requests
    if (!isFetchingUserRef.current) {
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
