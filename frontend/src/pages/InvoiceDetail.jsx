/**
 * Invoice Detail Page Component
 * Displays detailed invoice information
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaDownload, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import SkeletonLoader from '../components/SkeletonLoader'
import logoImage from '../assets/images/Logo.png'

/**
 * InvoiceDetail component
 * @returns {JSX.Element} Invoice detail page
 */
const InvoiceDetail = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  /**
   * Fetch invoice details
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!isAuthenticated) return

      try {
        setLoading(true)
        const response = await axios.get(`/api/invoices/${id}`)
        setInvoice(response.data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load invoice')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [id, isAuthenticated])

  /**
   * Format date to dd-MMM-yyyy, hh:mm AM/PM format (e.g., 13-Dec-2025, 2:30 PM)
   * @param {string} dateString - Date string
   * @returns {string} Formatted date with time in 12-hour format
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
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`
  }

  /**
   * Format order number for display
   * @param {Object} invoice - Invoice object
   * @returns {string} Formatted order number
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatOrderNumber = (invoice) => {
    if (invoice.order_number) {
      return invoice.order_number
    }
    // Fallback for existing orders without order_number
    const date = new Date(invoice.created_at)
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, '')
    return `ORD-${datePart}-${String(invoice.order_id).padStart(5, '0')}`
  }

  /**
   * Handle PDF download
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(`/api/invoices/${id}/download`, {
        responseType: 'blob',
        withCredentials: true
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${invoice.invoice_number}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Invoice downloaded successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download invoice')
    }
  }

  if (!isAuthenticated) {
    return <ProtectedRoute><div></div></ProtectedRoute>
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading skeleton */}
        <SkeletonLoader type="card" count={1} />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Invoice not found */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice not found</h1>
          <Link
            to="/invoices"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Invoices
          </Link>
        </div>
      </div>
    )
  }

  /* Invoice detail page layout */
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to invoices link */}
      <Link to="/invoices" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <FaArrowLeft className="mr-2" /> Back to Invoices
      </Link>
      {/* Invoice header */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Brand section with logo and description */}
        <div className="mb-8 pb-8 border-b">
          <div className="flex items-center gap-4 mb-4">
            <img src={logoImage} alt="Company Logo" className="h-16 w-auto object-contain" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ecommerce Store</h2>
              <p className="text-gray-600 text-sm mt-1">Your trusted online shopping destination. Quality products, exceptional service, and fast delivery.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <p className="text-gray-600 mt-2">Invoice Number: {invoice.invoice_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Date: {formatDate(invoice.created_at)}</p>
            <p className="text-sm text-gray-600">Order {formatOrderNumber(invoice)}</p>
            <button onClick={handleDownloadPDF} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 transition">
              <FaDownload /> <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Billing and shipping addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Billing Address</h3>
            <p className="text-gray-600 text-sm">
              {typeof invoice.billing_address === 'object' ? <>{invoice.billing_address.address}<br />{invoice.billing_address.city}, {invoice.billing_address.postal_code}<br />{invoice.billing_address.country}</> : invoice.billing_address}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-600 text-sm">
              {typeof invoice.shipping_address === 'object' ? <>{invoice.shipping_address.address}<br />{invoice.shipping_address.city}, {invoice.shipping_address.postal_code}<br />{invoice.shipping_address.country}</> : invoice.shipping_address}
            </p>
          </div>
        </div>

        {/* Order items */}
        {invoice.items && invoice.items.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {invoice.items.map((item) => (
                <div key={item.id} className="flex items-center border-b pb-4 last:border-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">${(Number(item.price) || 0).toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${((Number(item.price) || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoice totals */}
        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span>${parseFloat(invoice.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tax</span>
            <span>${parseFloat(invoice.tax_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping</span>
            <span>${parseFloat(invoice.shipping_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total</span>
            <span>${parseFloat(invoice.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment info */}
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-600"><strong>Payment Method:</strong> {invoice.payment_method}</p>
          <p className="text-sm text-gray-600"><strong>Payment Status:</strong> {invoice.payment_status}</p>
        </div>

        {/* Delivery information */}
        <div className="mt-8 pt-8 border-t">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Estimated Delivery</h3>
            <p className="text-sm text-blue-800">
              Your order will be delivered within <strong>3-5 business days</strong> from the date of shipment. We will integrate shipping tracking with our provider soon, and you'll receive tracking information via email once your order ships.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail

