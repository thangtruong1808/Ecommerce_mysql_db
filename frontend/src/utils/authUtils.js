/**
 * Authentication Utilities
 * Helper functions for authentication logic
 * @author Thang Truong
 * @date 2025-12-23
 */

import { toast } from 'react-toastify'
import { isProtectedRoute } from './errorSuppression.js'

/**
 * Handle automatic logout when refresh token expires
 * Only redirects and clears user if on a protected route
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @param {Object} isRedirectingRef - Ref to track if redirecting
 * @author Thang Truong
 * @date 2025-12-12
 */
export const handleTokenExpiration = async (setUser, setError, isRedirectingRef) => {
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
export const hasRefreshToken = () => {
  return document.cookie.split(';').some(cookie => cookie.trim().startsWith('refreshToken='))
}

/**
 * Check if 401 error toast should be suppressed
 * Suppresses toast when refresh token exists and error will be handled by token refresh interceptor
 * @param {Object} error - Error object from axios
 * @returns {boolean} True if toast should be suppressed
 * @author Thang Truong
 * @date 2025-12-23
 */
export const shouldSuppress401Toast = (error) => {
  // Only suppress 401 errors
  if (error?.response?.status !== 401) {
    return false
  }
  
  // Check if refresh token exists
  if (!hasRefreshToken()) {
    return false
  }
  
  // Check if we're on a protected route (where token refresh interceptor will handle it)
  if (!isProtectedRoute()) {
    return false
  }
  
  // Don't suppress errors from auth endpoints (login, register, etc.)
  const url = error?.config?.url || ''
  if (url.includes('/api/auth/login') || 
      url.includes('/api/auth/register') || 
      url.includes('/api/auth/profile') ||
      url.includes('/api/auth/refresh')) {
    return false
  }
  
  // Suppress 401 toast - token refresh interceptor will handle it
  return true
}

