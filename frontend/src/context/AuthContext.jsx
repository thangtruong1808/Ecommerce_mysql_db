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
  const userRef = useRef(null)
  const loadingRef = useRef(true)
  
  // Keep refs in sync with state
  useEffect(() => {
    userRef.current = user
  }, [user])
  
  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  // Configure axios to send cookies
  axios.defaults.withCredentials = true

  // Refs object for token refresh and user restoration
  const refs = {
    isRefreshingTokenRef,
    lastRefreshTimeRef,
    refreshFailureCountRef,
    userFetchedTimeRef,
    isFetchingUserRef,
    userRef
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
  
  /**
   * Re-fetch user when route changes to ensure authentication is maintained
   * Detects navigation and proactively verifies/restores user state on every navigation
   * Intercepts History API to catch React Router navigation immediately
   * @author Thang Truong
   * @date 2025-01-28
   */
  useEffect(() => {
    // Function to verify and restore user state on navigation
    // Uses refs to avoid stale closure issues
    const verifyAuthOnNavigation = () => {
      const currentPath = window.location.pathname
      if (currentPath !== lastLocationRef.current) {
        lastLocationRef.current = currentPath
        
        // On every navigation, if refresh token exists, immediately verify/restore user state
        // This ensures authentication is maintained across all navigations
        // Check even during loading to handle cases where access token expired during inactivity
        if (hasRefreshToken() && !isFetchingUserRef.current) {
          // Always try to restore/verify user state on navigation if refresh token exists
          // This prevents authentication loss during navigation and after inactivity
          // Don't check loadingRef - we want to restore even if loading
          fetchUser(setUser, setError, setLoading, isFetchingUserRef, userFetchedTimeRef, hasRefreshToken)
        }
      }
    }
    
    // Intercept History API pushState and replaceState to catch React Router navigation
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      setTimeout(verifyAuthOnNavigation, 50)
    }
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      setTimeout(verifyAuthOnNavigation, 50)
    }
    
    // Check route changes periodically (every 500ms) as fallback
    const interval = setInterval(verifyAuthOnNavigation, 500)
    
    // Also check on popstate (browser back/forward)
    window.addEventListener('popstate', verifyAuthOnNavigation)
    
    return () => {
      // Restore original History API methods
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      clearInterval(interval)
      window.removeEventListener('popstate', verifyAuthOnNavigation)
    }
  }, [setUser, setError, setLoading])

  // Use token refresh hook - pass user state but hook will work even if null (if refresh token exists)
  useTokenRefresh(user, refs, setUser, setError, isRedirectingRef)

  /**
   * Restore user state when page becomes visible after inactivity
   * This handles cases where access token expired during inactivity
   * @author Thang Truong
   * @date 2025-01-28
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When page becomes visible, check if user state needs restoration
      if (document.visibilityState === 'visible' && hasRefreshToken() && !userRef.current && !isFetchingUserRef.current) {
        // Restore user state if refresh token exists but user is null
        fetchUser(setUser, setError, setLoading, isFetchingUserRef, userFetchedTimeRef, hasRefreshToken)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [setUser, setError, setLoading])

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
