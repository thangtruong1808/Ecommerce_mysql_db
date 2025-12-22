/**
 * Token Refresh Hook
 * Handles periodic token expiration checks and token refresh logic
 * @author Thang Truong
 * @date 2025-01-28
 */

import { useEffect, useRef } from 'react'
import axios from 'axios'
import { isProtectedRoute } from '../utils/errorSuppression.js'
import { handleTokenExpiration, hasRefreshToken } from '../utils/authUtils.js'

/**
 * Hook to check refresh token expiration periodically
 * @param {Object} user - Current user object
 * @param {Object} refs - Refs object containing isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef, userFetchedTimeRef
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @param {Object} isRedirectingRef - Ref to track if redirecting
 * @author Thang Truong
 * @date 2025-01-28
 */
export const useTokenRefresh = (user, refs, setUser, setError, isRedirectingRef) => {
  const { isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef, userFetchedTimeRef } = refs

  useEffect(() => {
    if (!user) return
    
    const checkTokenExpiration = async () => {
      const path = window.location.pathname
      const isProtected = isProtectedRoute()
      const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
      const isPublicPage = !isProtected && !isAuthPage
      
      // Don't check token expiration on public pages to avoid console errors
      if (isPublicPage) return
      
      // Only check if we haven't refreshed recently (within last 2 minutes)
      // This prevents interference with normal token refresh flow
      const now = Date.now()
      if (isRefreshingTokenRef.current || (now - lastRefreshTimeRef.current < 120000)) {
        return
      }
      
      // Don't check immediately after fetching user - wait at least 10 seconds
      // This prevents simultaneous calls on page refresh
      if (userFetchedTimeRef.current > 0 && (now - userFetchedTimeRef.current < 10000)) {
        return
      }
      
      // Check if refresh token cookie exists before making the call
      // This prevents unnecessary 401 errors in console
      if (!hasRefreshToken()) {
        // If no refresh token cookie, don't make the call to avoid 401 errors
        return
      }
      
      // If we've had recent failures, don't check again immediately
      // This prevents repeated 401 errors in console
      if (refreshFailureCountRef.current > 0 && refreshFailureCountRef.current < 3) {
        // Wait longer before retrying after a failure
        if (now - lastRefreshTimeRef.current < 300000) { // 5 minutes
          return
        }
      }
      
      isRefreshingTokenRef.current = true
      lastRefreshTimeRef.current = now
      
      try {
        // Only verify refresh token is still valid, don't proactively refresh access token
        // The axios interceptor will handle access token refresh when needed
        // Mark request as silent to prevent console errors
        const response = await axios.post('/api/auth/refresh', {}, {
          validateStatus: (status) => status === 200 || status === 401,
          _silent: true,
          withCredentials: true
        })
        if (response.status === 200) {
          // Reset failure count on successful verification
          refreshFailureCountRef.current = 0
        } else if (response.status === 401) {
          // Increment failure count
          refreshFailureCountRef.current += 1
          // Only logout after 3 consecutive failures to avoid false positives
          if (refreshFailureCountRef.current >= 3) {
            await handleTokenExpiration(setUser, setError, isRedirectingRef)
          }
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
          // Increment failure count
          refreshFailureCountRef.current += 1
          // Only logout after 3 consecutive failures to avoid false positives
          if (refreshFailureCountRef.current >= 3) {
            await handleTokenExpiration(setUser, setError, isRedirectingRef)
          }
        } else {
          // Reset failure count on non-401 errors (network issues, etc.)
          refreshFailureCountRef.current = 0
        }
      } finally {
        // Reset flag after a delay to allow periodic checks
        setTimeout(() => {
          isRefreshingTokenRef.current = false
        }, 10000)
      }
    }
    
    // Wait 10 seconds after user is set before first check to avoid simultaneous calls with fetchUser
    // This prevents 429 rate limit errors on page refresh
    // Check every 5 minutes instead of 60 seconds to avoid interfering with normal operations
    const initialDelay = setTimeout(() => {
      checkTokenExpiration()
      // Periodic checks every 5 minutes (300000ms) instead of 60 seconds
      // This is less aggressive and won't interfere with normal token refresh flow
      const interval = setInterval(checkTokenExpiration, 300000)
      return () => clearInterval(interval)
    }, 10000)
    
    return () => clearTimeout(initialDelay)
  }, [user, refs, setUser, setError, isRedirectingRef])
}

/**
 * Refresh access token - called automatically when access token expires
 * Prevents duplicate calls to avoid 429 rate limit errors
 * @param {Object} refs - Refs object containing isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @param {Object} isRedirectingRef - Ref to track if redirecting
 * @returns {Promise<boolean>} Success status
 * @author Thang Truong
 * @date 2025-12-17
 */
export const refreshToken = async (refs, setUser, setError, isRedirectingRef) => {
  const { isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef } = refs
  
  // Prevent duplicate refresh calls - only allow one refresh per 5 seconds
  const now = Date.now()
  if (isRefreshingTokenRef.current || (now - lastRefreshTimeRef.current < 5000)) {
    return false
  }
  
  isRefreshingTokenRef.current = true
  lastRefreshTimeRef.current = now
  
  // Check if refresh token cookie exists before making the call
  if (!hasRefreshToken()) {
    return false
  }
  
  try {
    // Mark request as silent to prevent console errors
    const response = await axios.post('/api/auth/refresh', {}, {
      validateStatus: (status) => status === 200 || status === 401,
      _silent: true,
      withCredentials: true
    })
    isRefreshingTokenRef.current = false
    if (response.status === 200) {
      // Reset failure count on successful refresh
      refreshFailureCountRef.current = 0
      return true
    }
    await handleTokenExpiration(setUser, setError, isRedirectingRef)
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
      await handleTokenExpiration(setUser, setError, isRedirectingRef)
    } else {
      setUser(null)
    }
    return false
  }
}

