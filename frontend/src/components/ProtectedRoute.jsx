/**
 * Protected Route Component
 * Wrapper component that protects routes requiring authentication
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasRefreshToken } from '../utils/authUtils'

/**
 * ProtectedRoute component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.adminOnly - If true, only admin users can access
 * @returns {JSX.Element} Protected route or redirect
 * @author Thang Truong
 * @date 2025-12-12
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading, checkAuth } = useAuth()
  const [checkingAuth, setCheckingAuth] = useState(false)

  /**
   * Trigger auth check when ProtectedRoute mounts or when user becomes unauthenticated
   * Ensures auth state is checked on page refresh and navigation
   * If user is not authenticated but refresh token exists, try to restore auth
   * @author Thang Truong
   * @date 2025-01-28
   */
  useEffect(() => {
    // If not authenticated but refresh token exists, try to restore auth
    if (!isAuthenticated && !loading && !checkingAuth && hasRefreshToken() && checkAuth) {
      setCheckingAuth(true)
      // Immediately try to restore auth - don't wait
      checkAuth()
      // Give checkAuth time to complete before allowing redirect (5 seconds max)
      // This ensures we have enough time to restore authentication from refresh token
      // Especially important after inactivity when access token may have expired
      const timer = setTimeout(() => {
        setCheckingAuth(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
    // Reset checkingAuth if authenticated
    if (isAuthenticated && checkingAuth) {
      setCheckingAuth(false)
    }
  }, [isAuthenticated, loading, checkAuth, checkingAuth])
  
  /**
   * Also check auth on mount if refresh token exists
   * This ensures authentication is verified immediately when component mounts
   * @author Thang Truong
   * @date 2025-01-28
   */
  useEffect(() => {
    // On mount, if refresh token exists but not authenticated, check auth immediately
    // This handles cases where user state was lost due to inactivity
    // Don't wait for loading to complete - check immediately
    if (hasRefreshToken() && !isAuthenticated && checkAuth) {
      checkAuth()
    }
  }, []) // Only run on mount

  // Show loading spinner while checking authentication
  // This prevents redirects during initial auth check on page refresh
  if (loading || checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Loading container */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated (only after loading completes and no refresh token)
  if (!isAuthenticated && !hasRefreshToken()) {
    return <Navigate to="/login" replace />
  }
  
  // If not authenticated but refresh token exists, show loading while trying to restore
  // Wait up to 5 seconds to allow authentication restoration
  if (!isAuthenticated && hasRefreshToken()) {
    // Keep showing loading state - don't redirect while restoration is in progress
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Loading container */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Restoring session...</p>
        </div>
      </div>
    )
  }

  // Redirect to home if admin-only route and user is not admin (only after loading completes)
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  // Render protected content
  return (
    /* Protected route content */
    children
  )
}

export default ProtectedRoute

