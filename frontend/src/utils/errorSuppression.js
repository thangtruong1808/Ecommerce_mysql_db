/**
 * Error Suppression Utilities
 * Suppresses console errors for silent 401 errors and expected authentication errors
 * @author Thang Truong
 * @date 2025-01-28
 */

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
 * Check if error should be suppressed
 * @param {Object} error - Error object
 * @returns {boolean} True if error should be suppressed
 * @author Thang Truong
 * @date 2025-01-28
 */
const shouldSuppressError = (error) => {
  // Suppress silent errors
  if (error?._silent || error?.config?._silent) {
    return true
  }
  
  // Suppress 401 errors from auth endpoints that should be silent
  if (error?.response?.status === 401) {
    const path = window.location.pathname
    const isProtected = isProtectedRoute()
    const isAuthPage = path === '/login' || path === '/register' || path.startsWith('/forgot-password') || path.startsWith('/reset-password')
    const isPublicPage = !isProtected && !isAuthPage
    const isAuthEndpoint = error.config?.url?.includes('/api/auth/') || error.config?.url?.includes('/api/auth/refresh')
    const isRefreshEndpoint = error.config?.url?.includes('/api/auth/refresh')
    
    // Suppress 401 errors from refresh endpoints (expected during token refresh)
    // or from auth endpoints on public pages
    if (isRefreshEndpoint || (isPublicPage && isAuthEndpoint) || error.config?._silent) {
      return true
    }
  }
  
  return false
}

/**
 * Setup console error suppression for silent authentication errors
 * Suppresses both JavaScript errors and network request errors from refresh endpoint
 * @returns {Function} Cleanup function
 * @author Thang Truong
 * @date 2025-01-28
 */
export const setupErrorSuppression = () => {
  // Override console.error to suppress silent errors
  const originalConsoleError = console.error
  console.error = (...args) => {
    const error = args[0]
    
    // Check if it's a string error message about refresh endpoint
    if (typeof args[0] === 'string' && args[0].includes('/api/auth/refresh') && args[0].includes('401')) {
      return // Suppress refresh endpoint 401 errors
    }
    
    if (shouldSuppressError(error)) {
      return // Suppress silent errors
    }
    // Log all other errors normally
    originalConsoleError.apply(console, args)
  }

  // Override console.warn to suppress refresh endpoint warnings
  const originalConsoleWarn = console.warn
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('/api/auth/refresh')) {
      return // Suppress refresh endpoint warnings
    }
    originalConsoleWarn.apply(console, args)
  }

  // Handle unhandled promise rejections (axios errors)
  const handleUnhandledRejection = (event) => {
    const error = event.reason
    if (shouldSuppressError(error)) {
      event.preventDefault()
      return
    }
    // Also suppress if it's a refresh endpoint error
    if (error?.config?.url?.includes('/api/auth/refresh')) {
      event.preventDefault()
      return
    }
  }

  window.addEventListener('unhandledrejection', handleUnhandledRejection)

  return () => {
    console.error = originalConsoleError
    console.warn = originalConsoleWarn
    window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }
}

export { isProtectedRoute }

