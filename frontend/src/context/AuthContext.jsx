/**
 * Authentication Context
 * Manages global authentication state and provides auth functions
 * Handles token refresh automatically via HTTP-only cookies
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

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
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Configure axios to send cookies
  axios.defaults.withCredentials = true

  /**
   * Fetch current user profile
   */
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/profile')
      setUser(response.data)
      setError(null)
    } catch (error) {
      setUser(null)
      // Don't set error for 401 (not logged in) - this is expected for unauthenticated users
      // Suppress console errors for 401 to avoid noise in console
      if (error.response?.status !== 401) {
        setError(error.response?.data?.message || 'Failed to fetch user')
        console.error('Auth error:', error.response?.data?.message || 'Failed to fetch user')
      }
      // Silently handle 401 - user is just not logged in
    } finally {
      setLoading(false)
    }
  }

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    fetchUser()
  }, [])

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Result object with success status
   */
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      setUser(response.data)
      setError(null)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      setError(message)
      return { success: false, error: message }
    }
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
      const message = error.response?.data?.message || 
                     error.response?.data?.errors?.[0]?.msg || 
                     'Registration failed'
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
    } catch (error) {
      console.error('Logout error:', error)
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
   * Refresh access token
   * Called automatically when access token expires
   * @returns {Promise<boolean>} Success status
   */
  const refreshToken = async () => {
    try {
      await axios.post('/api/auth/refresh')
      return true
    } catch (error) {
      // If refresh fails, user needs to login again
      setUser(null)
      return false
    }
  }

  // Axios interceptor for automatic token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          // Don't try to refresh for /api/auth/profile endpoint (user just not logged in)
          if (originalRequest.url?.includes('/api/auth/profile')) {
            return Promise.reject(error)
          }

          const refreshed = await refreshToken()
          if (refreshed) {
            // Retry original request with new token
            return axios(originalRequest)
          }
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
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
