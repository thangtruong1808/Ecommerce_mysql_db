/**
 * Address Form Component
 * Reusable shipping address form
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

/**
 * AddressForm component
 * @param {Object} props - Component props
 * @param {Function} props.register - React Hook Form register function
 * @param {Object} props.errors - Form errors object
 * @returns {JSX.Element} Address form component
 */
const AddressForm = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      {/* Address form container */}
      {/* Address field */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          {...register('address', { required: 'Address is required' })}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Street address"
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
      </div>

      {/* City field */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          {...register('city', { required: 'City is required' })}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="City"
        />
        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
      </div>

      {/* Postal code field */}
      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
          Postal Code
        </label>
        <input
          {...register('postalCode', { required: 'Postal code is required' })}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Postal code"
        />
        {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
      </div>

      {/* Country field */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <input
          {...register('country', { required: 'Country is required' })}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Country"
        />
        {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
      </div>
    </div>
  )
}

export default AddressForm

