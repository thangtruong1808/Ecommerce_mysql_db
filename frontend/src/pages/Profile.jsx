/**
 * Profile Page Component
 * Displays and allows editing of user profile information and addresses
 * @author Thang Truong
 * @date 2025-12-12
 */
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FaUser, FaEnvelope, FaShieldAlt, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaLock, FaMapMarkerAlt, FaPlus, FaTrash } from 'react-icons/fa'
import LoadingSpinner from '../components/LoadingSpinner'
import AddressForm from '../components/AddressForm'

/**
 * Profile component
 * @returns {JSX.Element} Profile page
 * @author Thang Truong
 * @date 2025-12-12
 */
const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [editingAddress, setEditingAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
  const addressForm = useForm()

  /**
   * Fetch full user profile to ensure created_at is available
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await axios.get('/api/auth/profile')
          setUserProfile(response.data)
        } catch {
          setUserProfile(user)
        }
      }
    }
    fetchProfile()
  }, [user])

  /**
   * Initialize form and fetch addresses when user changes
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const profileUser = userProfile || user
    if (profileUser) reset({ name: profileUser.name || '', email: profileUser.email || '', newPassword: '', confirmPassword: '' })
    fetchAddresses()
  }, [userProfile, user, reset])

  /** Fetch user addresses @author Thang Truong @date 2025-12-12 */
  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/auth/addresses')
      setAddresses(response.data || [])
    } catch {
      setAddresses([])
    }
  }

  /**
   * Format date to dd-MMM-yyyy format (e.g., 13-Dec-2025)
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date string
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  /** Handle profile form submission @param {Object} data - Form data @author Thang Truong @date 2025-12-12 */
  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await updateProfile({ name: data.name, email: data.email })
      if (result.success) { toast.success('Profile updated successfully!'); setIsEditing(false) } else { toast.error(result.error || 'Update failed') }
    } catch { toast.error('Failed to update profile') } finally { setIsLoading(false) }
  }

  /** Handle password change @param {Object} data - Form data @author Thang Truong @date 2025-12-12 */
  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) { toast.error('New passwords do not match'); return }
    setIsLoading(true)
    try {
      const result = await updateProfile({ password: data.newPassword })
      if (result.success) { toast.success('Password changed successfully!'); setIsChangingPassword(false); reset({ ...watch(), newPassword: '', confirmPassword: '' }) } else { toast.error(result.error || 'Password change failed') }
    } catch { toast.error('Failed to change password') } finally { setIsLoading(false) }
  }

  /** Handle address form submission @param {Object} data - Address form data @author Thang Truong @date 2025-12-12 */
  const onAddressSubmit = async (data) => {
    setIsLoading(true)
    try {
      const addressData = { address: data.address, city: data.city, postal_code: data.postalCode, country: data.country, is_default: data.isDefault || false }
      if (editingAddress) { await axios.put(`/api/auth/addresses/${editingAddress.id}`, addressData); toast.success('Address updated successfully!') } else { await axios.post('/api/auth/addresses', addressData); toast.success('Address added successfully!') }
      setShowAddressForm(false); setEditingAddress(null); addressForm.reset(); fetchAddresses()
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to save address') } finally { setIsLoading(false) }
  }

  /** Handle delete address @param {number} addressId - Address ID @author Thang Truong @date 2025-12-12 */
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return
    setIsLoading(true)
    try { await axios.delete(`/api/auth/addresses/${addressId}`); toast.success('Address deleted successfully!'); fetchAddresses() } catch { toast.error('Failed to delete address') } finally { setIsLoading(false) }
  }

  const newPassword = watch('newPassword')
  return (
    /* Profile page layout */
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and settings</p>
        </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center"><FaUser className="mr-2 text-blue-600" /> Profile Information</h2>
            {!isEditing && <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 transition" disabled={isLoading}><FaEdit /> <span>Edit Profile</span></button>}
        </div>
        {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2"><FaUser className="inline mr-1" /> Full Name</label><input {...register('name', { required: 'Name is required' })} type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}</div>
                <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2"><FaEnvelope className="inline mr-1" /> Email Address</label><input {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}</div>
            </div>
              <div className="flex space-x-4 pt-4 border-t">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 transition disabled:opacity-50" disabled={isLoading}>{isLoading ? <LoadingSpinner /> : <FaSave />} <span>Save Changes</span></button>
                <button type="button" onClick={() => { setIsEditing(false); const p = userProfile || user; reset({ name: p?.name || '', email: p?.email || '' }) }} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center space-x-2 transition" disabled={isLoading}><FaTimes /> <span>Cancel</span></button>
            </div>
          </form>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => { const p = userProfile || user; return (<><div className="space-y-1"><label className="block text-sm font-medium text-gray-500">Full Name</label><p className="text-lg text-gray-900">{p?.name || 'N/A'}</p></div>
              <div className="space-y-1"><label className="block text-sm font-medium text-gray-500">Email Address</label><p className="text-lg text-gray-900">{p?.email || 'N/A'}</p></div>
              <div className="space-y-1"><label className="block text-sm font-medium text-gray-500">Account Role</label><span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize"><FaShieldAlt className="mr-1" /> {p?.role || 'user'}</span></div>
              <div className="space-y-1"><label className="block text-sm font-medium text-gray-500">Member Since</label><p className="text-lg text-gray-900 flex items-center"><FaCalendarAlt className="mr-2 text-gray-400" /> {formatDate(p?.created_at)}</p></div></>) })()}
            </div>
          )}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center"><FaMapMarkerAlt className="mr-2 text-blue-600" /> Shipping Addresses</h2>
            {!showAddressForm && <button onClick={() => { setShowAddressForm(true); setEditingAddress(null); addressForm.reset() }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 transition" disabled={isLoading}><FaPlus /> <span>Add Address</span></button>}
          </div>
          {showAddressForm ? (
            <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
              <AddressForm register={addressForm.register} errors={addressForm.formState.errors} />
              <div className="flex items-center"><input {...addressForm.register('isDefault')} type="checkbox" id="isDefault" className="mr-2" /><label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label></div>
              <div className="flex space-x-4 pt-4 border-t">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 transition disabled:opacity-50" disabled={isLoading}>{isLoading ? <LoadingSpinner /> : <FaSave />} <span>{editingAddress ? 'Update' : 'Add'} Address</span></button>
                <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); addressForm.reset() }} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center space-x-2 transition" disabled={isLoading}><FaTimes /> <span>Cancel</span></button>
              </div>
            </form>
          ) : addresses.length > 0 ? (
          <div className="space-y-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="border rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    {addr.is_default && <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold bg-blue-100 text-blue-800 rounded">Default</span>}
                    <p className="text-gray-900 font-medium">{addr.address}</p>
                    <p className="text-gray-600">{addr.city}, {addr.postal_code}</p>
                    <p className="text-gray-600">{addr.country}</p>
            </div>
                  <div className="flex space-x-2">
                    <button onClick={() => { setEditingAddress(addr); setShowAddressForm(true); addressForm.reset({ address: addr.address, city: addr.city, postalCode: addr.postal_code, country: addr.country, isDefault: addr.is_default }) }} className="p-2 text-blue-600 hover:bg-blue-50 rounded" disabled={isLoading}><FaEdit /></button>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" disabled={isLoading}><FaTrash /></button>
            </div>
          </div>
              ))}
            </div>
          ) : <p className="text-gray-600">No addresses saved yet. Add your first address above.</p>}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center"><FaLock className="mr-2 text-blue-600" /> Change Password</h2>
            {!isChangingPassword && <button onClick={() => setIsChangingPassword(true)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center space-x-2 transition" disabled={isLoading}><FaEdit /> <span>Change Password</span></button>}
          </div>
          {isChangingPassword ? (
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</label><input {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} type="password" id="newPassword" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />{errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}</div>
                <div><label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label><input {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === newPassword || 'Passwords do not match' })} type="password" id="confirmPassword" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isLoading} />{errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}</div>
              </div>
              <div className="flex space-x-4 pt-4 border-t">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 transition disabled:opacity-50" disabled={isLoading}>{isLoading ? <LoadingSpinner /> : <FaSave />} <span>Update Password</span></button>
                <button type="button" onClick={() => { setIsChangingPassword(false); reset({ ...watch(), newPassword: '', confirmPassword: '' }) }} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center space-x-2 transition" disabled={isLoading}><FaTimes /> <span>Cancel</span></button>
              </div>
            </form>
          ) : <div className="text-gray-600"><p>Your password was last updated when you created your account.</p><p className="text-sm mt-2">For security reasons, we don't display your password.</p></div>}
        </div>
      </div>
    </div>
  )
}

export default Profile
