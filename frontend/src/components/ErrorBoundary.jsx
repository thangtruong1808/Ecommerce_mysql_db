/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { Component } from 'react'
import Button from './Button'

/**
 * ErrorBoundary class component
 * @extends Component
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  /**
   * Update state when error is caught
   * @param {Error} error - Caught error
   * @returns {Object} Updated state
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  /**
   * Handle caught error
   * @param {Error} error - Caught error
   * @param {Object} errorInfo - Error information
   * @author Thang Truong
   * @date 2025-01-XX
   */
  componentDidCatch(error, errorInfo) {
    // Error handled by ErrorBoundary state
  }

  /**
   * Navigate to home page
   */
  handleGoHome = () => {
    window.location.href = '/'
  }

  /**
   * Render error UI or children
   * @returns {JSX.Element} Error UI or children
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          {/* Error display container */}
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                icon="check"
              >
                Reload Page
              </Button>
              <Button 
                variant="secondary" 
                icon="home"
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

