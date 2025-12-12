/**
 * Invoice List Page Component
 * Displays list of user's invoices
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import SkeletonLoader from '../components/SkeletonLoader'

/**
 * InvoiceList component
 * @returns {JSX.Element} Invoice list page
 */
const InvoiceList = () => {
  const { isAuthenticated } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch user invoices
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!isAuthenticated) return

      try {
        setLoading(true)
        const response = await axios.get('/api/invoices')
        setInvoices(response.data.invoices || [])
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load invoices')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [isAuthenticated])

  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!isAuthenticated) {
    return <ProtectedRoute><div></div></ProtectedRoute>
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading skeleton */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Invoices</h1>
        <SkeletonLoader type="list" count={5} />
      </div>
    )
  }

  /* Invoice list page layout */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Invoices</h1>

      {invoices.length === 0 ? (
        /* Empty invoices message */
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You don't have any invoices yet</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        /* Invoices list */
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Link
              key={invoice.id}
              to={`/invoices/${invoice.id}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                {/* Invoice info */}
                <div>
                  <h3 className="text-lg font-semibold">Invoice {invoice.invoice_number}</h3>
                  <p className="text-gray-600 text-sm">
                    Order #{invoice.order_id} • {formatDate(invoice.created_at)}
                  </p>
                </div>

                {/* Invoice total */}
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">
                    ${parseFloat(invoice.total_amount).toFixed(2)}
                  </p>
                  {invoice.email_sent && (
                    <p className="text-sm text-green-600">Email sent</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default InvoiceList

