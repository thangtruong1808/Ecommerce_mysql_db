/**
 * Authentication Utilities
 * Helper functions for authentication logic
 * @author Thang Truong
 * @date 2025-01-28
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

