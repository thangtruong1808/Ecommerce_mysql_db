/**
 * Register Page Component
 * Handles new user registration
 * 
 * @author Thang Truong
 * @date 2025-12-09
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Button from '../components/Button'
import { FaIdBadge, FaUsers, FaHeadset } from 'react-icons/fa'

/**
 * Register component
 * @returns {JSX.Element} Registration form page
 */
const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  /**
   * Redirect to home if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const password = watch('password')

  /**
   * Handle form submission
   * @param {Object} data - Form data (name, email, password, confirmPassword)
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const result = await registerUser(data.name, data.email, data.password)
      if (result.success) {
        toast.success('Registration successful!')
        navigate('/')
      } else {
        toast.error(result.error || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Toggle password visibility
   * @param {boolean} isConfirm - whether toggling confirm field
   */
  const handleTogglePassword = (isConfirm = false) => {
    if (isConfirm) {
      setShowConfirm((prev) => !prev)
    } else {
      setShowPassword((prev) => !prev)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center">
      {/* Page shell */}
      <div className="max-w-5xl w-full mx-auto px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Story panel */}
          <div className="hidden lg:block bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg border border-gray-100">
            <p className="text-sm font-semibold text-blue-600 mb-2">Create your workspace access</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Join a platform built for real retail teams
            </h1>
            <p className="text-gray-600 mb-6">
              Register to manage carts, vouchers, and fulfillment with the same secure experience your customers trust.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="mt-1 text-blue-600"><FaIdBadge /></span>
                <div>
                  <p className="font-semibold text-gray-900">Verified identity</p>
                  <p className="text-sm text-gray-600">Keep team accounts safe with strong credential policies.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="mt-1 text-blue-600"><FaUsers /></span>
                <div>
                  <p className="font-semibold text-gray-900">Built for collaboration</p>
                  <p className="text-sm text-gray-600">Add teammates later and manage roles without friction.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="mt-1 text-blue-600"><FaHeadset /></span>
                <div>
                  <p className="font-semibold text-gray-900">Support that responds</p>
                  <p className="text-sm text-gray-600">Get quick help for onboarding and order operations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration form card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header section */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  sign in to your existing account
                </Link>
              </p>
            </div>
            
            {/* Registration form */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* Name input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                    type="text"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Alex Johnson"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                
                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Work email
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
                
                {/* Password input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => handleTogglePassword(false)}
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
                    Confirm password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match',
                      })}
                      type={showConfirm ? 'text' : 'password'}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() => handleTogglePassword(true)}
                      className="absolute inset-y-0 right-2 px-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {showConfirm ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {/* Submit + helper */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  loading={loading}
                  icon="register"
                  className="w-full"
                >
                  Register
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  By creating an account you agree to our terms and understand this workspace uses secure cookies.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
