/**
 * Reset Password Page Component
 * Allows users to request a password reset email
 * 
 * @author Thang Truong
 * @date 2025-01-09
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'
import Button from '../components/Button'
import { FaEnvelope, FaArrowLeft, FaShieldAlt } from 'react-icons/fa'

/**
 * Reset Password component
 * @returns {JSX.Element} Reset password form page
 */
const ResetPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  /**
   * Handle form submission
   * @param {Object} data - Form data (email)
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/auth/forgot-password', { email: data.email })
      setEmailSent(true)
      toast.success(response.data?.message || 'If that email exists, a password reset link has been sent.')
    } catch (error) {
      // Handle validation errors
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
        const errorMessage = validationErrors.map(err => err.msg).join(', ') || 'Invalid email address'
        toast.error(errorMessage)
      } else {
        // Handle other errors
        toast.error(error.response?.data?.message || 'Failed to send reset email. Please check your email configuration.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center">
      {/* Page shell */}
      <div className="max-w-5xl w-full mx-auto px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Info panel */}
          <div className="hidden lg:block bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg border border-gray-100">
            <p className="text-sm font-semibold text-blue-600 mb-2">Password recovery</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Reset your password securely
            </h1>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a secure link to reset your password. The link will expire in 1 hour.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="mt-1 text-blue-600"><FaShieldAlt /></span>
                <div>
                  <p className="font-semibold text-gray-900">Secure process</p>
                  <p className="text-sm text-gray-600">Your reset link is encrypted and expires after 1 hour for security.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="mt-1 text-blue-600"><FaEnvelope /></span>
                <div>
                  <p className="font-semibold text-gray-900">Check your inbox</p>
                  <p className="text-sm text-gray-600">We'll send the reset link to your registered email address.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reset form card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header section */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Reset Password</h2>
              <p className="mt-2 text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
            
            {emailSent ? (
              /* Success message */
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    We've sent a password reset link to your email address. Please check your inbox and click the link to reset your password.
                  </p>
                </div>
                <div className="pt-4">
                  <Button
                    onClick={() => navigate('/login')}
                    icon="login"
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </div>
            ) : (
              /* Reset form */
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@company.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    loading={loading}
                    icon="check"
                    className="w-full"
                  >
                    Send Reset Link
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword

