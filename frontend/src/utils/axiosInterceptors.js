/**
 * Axios Interceptors
 * Handles request and response interceptors for authentication
 * @author Thang Truong
 * @date 2025-01-28
 */

import axios from 'axios'
import { isProtectedRoute } from './errorSuppression.js'
import { handleTokenExpiration, hasRefreshToken } from './authUtils.js'
import { fetchUser } from './authApi.js'

/**
 * Setup request interceptor to mark refresh token calls as silent
 * This prevents browser console from logging 401 errors from refresh endpoint
 * @returns {Function} Cleanup function
 * @author Thang Truong
 * @date 2025-01-28
 */
export const setupRequestInterceptor = () => {
  const requestInterceptor = axios.interceptors.request.use(
    (config) => {
      // Mark ALL refresh token calls as silent to prevent console errors
      // These are expected during normal token refresh operations
      if (config.url?.includes('/api/auth/refresh')) {
        config._silent = true
      }
      return config
    },
    (error) => Promise.reject(error)
  )
  return () => axios.interceptors.request.eject(requestInterceptor)
}

/**
 * Setup response interceptor to handle expected 401 errors silently
 * Marks all refresh endpoint 401 errors as silent to prevent console logging
 * @returns {Function} Cleanup function
 * @author Thang Truong
 * @date 2025-01-28
 */
export const setupResponseInterceptor = () => {
  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const isRefreshEndpoint = error.config?.url?.includes('/api/auth/refresh')
      const path = window.location.pathname
      const isProtected = isProtectedRoute()
      const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
      const isPublicPage = !isProtected && !isAuthPage
      const isAuthEndpoint = error.config?.url?.includes('/api/auth/')
      
      // Mark ALL refresh endpoint 401 errors as silent (expected during token refresh)
      // Also mark auth endpoint 401 errors on public pages as silent
      if (isRefreshEndpoint || (isPublicPage && isAuthEndpoint) || error.config?._silent) {
        if (error.response?.status === 401) {
          error._silent = true
          if (error.config) {
            error.config._silent = true
          }
        }
      }
      return Promise.reject(error)
    }
  )
  return () => axios.interceptors.response.eject(responseInterceptor)
}

/**
 * Setup axios interceptor for automatic token refresh and auto-logout
 * @param {Object} refs - Refs object containing isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @param {Object} isRedirectingRef - Ref to track if redirecting
 * @returns {Function} Cleanup function
 * @author Thang Truong
 * @date 2025-01-28
 */
export const setupTokenRefreshInterceptor = (refs, setUser, setError, isRedirectingRef) => {
  const { isRefreshingTokenRef, lastRefreshTimeRef, refreshFailureCountRef, isFetchingUserRef, userFetchedTimeRef, userRef } = refs
  
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
          // Mark all refresh endpoint 401 errors as silent (they're expected during token refresh)
          error._silent = true
          if (error.config) {
            error.config._silent = true
          }
          // Only clear user and redirect if on protected route
          if (isProtected) {
            await handleTokenExpiration(setUser, setError, isRedirectingRef)
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
            _silent: true, // Mark as silent to suppress console errors
            withCredentials: true
          })
          isRefreshingTokenRef.current = false
          if (refreshResponse.status === 200) {
            // Token refreshed successfully - reset failure count
            refreshFailureCountRef.current = 0
            // If user state is null, restore it after successful token refresh
            // This handles cases where user state was lost due to inactivity
            if (userRef && !userRef.current && hasRefreshToken()) {
              // Restore user state after successful token refresh
              const tempFetchingRef = { current: false }
              fetchUser(setUser, setError, () => {}, tempFetchingRef, userFetchedTimeRef, hasRefreshToken)
            }
            // Retry original request
            return axios(originalRequest)
          } else {
            // Refresh token expired - only logout if on protected route
            if (isProtected) {
              await handleTokenExpiration(setUser, setError, isRedirectingRef)
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
            // Mark 401 from refresh endpoint as silent (expected during token refresh)
            refreshError._silent = true
            if (refreshError.config) {
              refreshError.config._silent = true
            }
            // Refresh token expired - only logout if on protected route
            if (isProtected) {
              await handleTokenExpiration(setUser, setError, isRedirectingRef)
            }
          }
          return Promise.reject(refreshError)
        }
      }
      return Promise.reject(error)
    }
  )
  return () => axios.interceptors.response.eject(interceptor)
}

