/**
 * Reset Password Confirm Page Component
 * Allows users to reset their password using a token from email
 * 
 * @author Thang Truong
 * @date 2025-01-09
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'
import Button from '../components/Button'
import { FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa'

/**
 * Reset Password Confirm component
 * @returns {JSX.Element} Reset password confirmation form page
 */
const ResetPasswordConfirm = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  /**
   * Handle form submission
   * @param {Object} data - Form data (password)
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await axios.post('/api/auth/reset-password', {
        token,
        password: data.password,
      })
      setSuccess(true)
      toast.success('Password has been reset successfully')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Toggle password visibility
   */
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  /**
   * Toggle confirm password visibility
   */
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FaCheckCircle className="text-green-600 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful</h2>
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. Redirecting to login page...
            </p>
            <Button onClick={() => navigate('/login')} icon="login" className="w-full">
              Go to Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center">
      {/* Page shell */}
      <div className="max-w-md w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Header section */}
          <div className="mb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaLock className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Set New Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>
          
          {/* Reset form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Password input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute inset-y-0 right-2 px-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>
              
              {/* Confirm password input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={handleToggleConfirmPassword}
                    className="absolute inset-y-0 right-2 px-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Submit button */}
            <div className="space-y-3">
              <Button
                type="submit"
                loading={loading}
                icon="check"
                className="w-full"
              >
                Reset Password
              </Button>
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordConfirm

