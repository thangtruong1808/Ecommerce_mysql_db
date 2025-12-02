/**
 * Protected Route Component
 * Wrapper component that protects routes requiring authentication
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.adminOnly - If true, only admin users can access
 * @returns {JSX.Element} Protected route or redirect
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  // Show loading spinner while checking authentication
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect to home if admin-only route and user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  // Render protected content
  return children
}

export default ProtectedRoute
