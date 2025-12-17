/**
 * Protected Route Component
 * Wrapper component that protects routes requiring authentication
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

  /**
   * Trigger auth check when ProtectedRoute mounts
   * Ensures auth state is checked on page refresh
   * Only calls if still loading to avoid duplicate calls with AuthContext fetchUser
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    // Only check auth if still loading (initial load)
    // This prevents duplicate calls with AuthContext fetchUser on page refresh
    // AuthContext.fetchUser() already runs on mount, so we don't need to call checkAuth
    // unless the initial fetch hasn't completed yet
    if (checkAuth && loading) {
      // Small delay to let AuthContext.fetchUser() complete first
      const timer = setTimeout(() => {
        if (loading) {
          checkAuth()
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [checkAuth, loading])

  // Show loading spinner while checking authentication
  // This prevents redirects during initial auth check on page refresh
  if (loading) {
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

  // Redirect to login if not authenticated (only after loading completes)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
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
