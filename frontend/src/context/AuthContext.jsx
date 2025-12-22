/**
 * Authentication Context - Manages auth state, token refresh, and auto-logout
 * @author Thang Truong
 * @date 2025-12-12
 */

import { createContext, useState, useContext, useEffect, useRef } from 'react'
import axios from 'axios'
import { setupErrorSuppression } from '../utils/errorSuppression.js'
import { setupRequestInterceptor, setupResponseInterceptor, setupTokenRefreshInterceptor } from '../utils/axiosInterceptors.js'
import { useTokenRefresh } from '../hooks/useTokenRefresh.js'
import { fetchUser, login as loginApi, register as registerApi, logout as logoutApi, updateProfile as updateProfileApi } from '../utils/authApi.js'
import { hasRefreshToken } from '../utils/authUtils.js'

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
  const refreshFailureCountRef = useRef(0)
  const lastLocationRef = useRef(window.location.pathname)

  // Configure axios to send cookies
  axios.defaults.withCredentials = true

  // Refs object for token refresh
  const refs = {
    isRefreshingTokenRef,
    lastRefreshTimeRef,
    refreshFailureCountRef,
    userFetchedTimeRef
  }

  // Suppress console errors for silent 401 errors
  useEffect(() => {
    return setupErrorSuppression()
  }, [])

  // Suppress 401 errors for auth endpoints on public pages
  useEffect(() => {
    return setupResponseInterceptor()
  }, [])

  // Setup request interceptor
  useEffect(() => {
    return setupRequestInterceptor()
  }, [])

  // Setup token refresh interceptor
  useEffect(() => {
    return setupTokenRefreshInterceptor(refs, setUser, setError, isRedirectingRef)
  }, [])

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
    fetchUser(setUser, setError, setLoading, isFetchingUserRef, userFetchedTimeRef, hasRefreshToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Re-fetch user when route changes if user is missing but refresh token exists
  useEffect(() => {
    // Detect route changes using window.location and restore user state if needed
    const checkRouteChange = () => {
      const currentPath = window.location.pathname
      if (currentPath !== lastLocationRef.current) {
        lastLocationRef.current = currentPath
        
        // If user is null but refresh token exists, try to restore user state
        // This handles cases where navigation causes user state to be lost
        if (!user && hasRefreshToken() && !isFetchingUserRef.current && !loading) {
          // Small delay to let navigation complete
          setTimeout(() => {
            if (!user && hasRefreshToken() && !isFetchingUserRef.current) {
              fetchUser(setUser, setError, setLoading, isFetchingUserRef, userFetchedTimeRef, hasRefreshToken)
            }
          }, 100)
        }
      }
    }
    
    // Check route changes periodically (every 500ms)
    const interval = setInterval(checkRouteChange, 500)
    
    // Also check on popstate (browser back/forward)
    window.addEventListener('popstate', checkRouteChange)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('popstate', checkRouteChange)
    }
  }, [user, loading])

  // Use token refresh hook
  useTokenRefresh(user, refs, setUser, setError, isRedirectingRef)

  /**
   * Login user - silently handles 401 errors without console logging
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Result object with success status
   * @author Thang Truong
   * @date 2025-12-12
   */
  const login = async (email, password) => {
    return loginApi(email, password, setUser, setError)
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
    return registerApi(name, email, password, setUser, setError)
  }

  /**
   * Logout user
   * @author Thang Truong
   * @date 2025-12-12
   */
  const logout = async () => {
    return logoutApi(setUser, setError)
  }

  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Result object with success status
   * @author Thang Truong
   * @date 2025-12-12
   */
  const updateProfile = async (userData) => {
    return updateProfileApi(userData, setUser, setError)
  }

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
      fetchUser(setUser, setError, setLoading, isFetchingUserRef, userFetchedTimeRef, hasRefreshToken)
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

  /* Auth context provider */
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
