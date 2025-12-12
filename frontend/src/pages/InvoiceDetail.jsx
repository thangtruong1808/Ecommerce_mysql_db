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
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import SkeletonLoader from '../components/SkeletonLoader'

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
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Invoice header */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <p className="text-gray-600 mt-2">Invoice Number: {invoice.invoice_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Date: {formatDate(invoice.created_at)}</p>
            <p className="text-sm text-gray-600">Order #{invoice.order_id}</p>
          </div>
        </div>

        {/* Billing and shipping addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Billing address */}
          <div>
            <h3 className="font-semibold mb-2">Billing Address</h3>
            <p className="text-gray-600 text-sm">
              {typeof invoice.billing_address === 'object' ? (
                <>
                  {invoice.billing_address.address}<br />
                  {invoice.billing_address.city}, {invoice.billing_address.postal_code}<br />
                  {invoice.billing_address.country}
                </>
              ) : (
                invoice.billing_address
              )}
            </p>
          </div>

          {/* Shipping address */}
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-600 text-sm">
              {typeof invoice.shipping_address === 'object' ? (
                <>
                  {invoice.shipping_address.address}<br />
                  {invoice.shipping_address.city}, {invoice.shipping_address.postal_code}<br />
                  {invoice.shipping_address.country}
                </>
              ) : (
                invoice.shipping_address
              )}
            </p>
          </div>
        </div>

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
          <p className="text-sm text-gray-600">
            <strong>Payment Method:</strong> {invoice.payment_method}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Payment Status:</strong> {invoice.payment_status}
          </p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail

