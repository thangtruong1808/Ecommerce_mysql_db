/**
 * Invoice Management Page
 * Full CRUD operations for invoices with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import InvoiceEditModal from '../../components/admin/InvoiceEditModal'
import InvoiceTableRow from '../../components/admin/InvoiceTableRow'
import { useSelection } from '../../utils/useSelection'

/**
 * InvoiceManagement component
 * @returns {JSX.Element} Invoice management page
 * @author Thang Truong
 * @date 2025-12-12
 */
const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, invoice: null })
  const [editModal, setEditModal] = useState({ isOpen: false, invoice: null })
  const { selected: selectedInvoices, toggle, selectAll, clear, selectedCount } = useSelection(invoices)

  /**
   * Fetch invoices
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('paymentStatus', statusFilter)
      const response = await axios.get(`/api/admin/invoices?${params}`)
      setInvoices(response.data.invoices || [])
      setTotalPages(response.data.pagination?.pages || 1)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [page, searchTerm, statusFilter])

  /**
   * Handle update invoice
   * @param {Object} data - Invoice data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleUpdate = async (data) => {
    try {
      await axios.put(`/api/admin/invoices/${editModal.invoice.id}`, data)
      toast.success('Invoice updated successfully')
      setEditModal({ isOpen: false, invoice: null })
      fetchInvoices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update invoice')
    }
  }

  /**
   * Handle resend email
   * @param {number} invoiceId - Invoice ID
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleResendEmail = async (invoiceId) => {
    try {
      await axios.post(`/api/admin/invoices/${invoiceId}/resend-email`)
      toast.success('Invoice email sent successfully')
      fetchInvoices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send invoice email')
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/invoices/${deleteModal.invoice.id}`)
      toast.success('Invoice deleted successfully')
      setDeleteModal({ isOpen: false, invoice: null })
      fetchInvoices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete invoice')
    }
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedInvoices)
      await axios.post('/api/admin/invoices/bulk-delete', { invoiceIds: ids })
      toast.success(`${ids.length} invoice(s) deleted successfully`)
      clear()
      fetchInvoices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete invoices')
    }
  }


  if (loading && invoices.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Invoice Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Invoice management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Invoice Management</h1>

        {/* Filters and search */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setPage(1)
          }}
          filterValue={statusFilter}
          onFilterChange={(value) => {
            setStatusFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Statuses' },
            { value: 'paid', label: 'Paid' },
            { value: 'pending', label: 'Pending' }
          ]}
          searchPlaceholder="Search by invoice number, order number, user name, or email..."
        />

        {/* Invoices table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={invoices.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email Sent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <InvoiceTableRow
                  key={invoice.id}
                  invoice={invoice}
                  isSelected={selectedInvoices.has(invoice.id)}
                  onToggle={toggle}
                  onResendEmail={() => handleResendEmail(invoice.id)}
                  onEdit={() => setEditModal({ isOpen: true, invoice })}
                  onDelete={() => setDeleteModal({ isOpen: true, invoice })}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {/* Edit modal */}
        <InvoiceEditModal
          invoice={editModal.invoice}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, invoice: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={deleteModal.invoice}
          entityType="invoice"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, invoice: null })}
        />

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            actions={[{ type: 'delete', label: 'Delete Selected' }]}
            onAction={(actionType) => actionType === 'delete' && handleBulkDelete()}
            onCancel={clear}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default InvoiceManagement
