/**
 * Voucher Management Page Component
 * Admin page for managing vouchers with full CRUD operations
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPlus, FaTag } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import VoucherCreateModal from '../../components/admin/VoucherCreateModal'
import VoucherEditModal from '../../components/admin/VoucherEditModal'
import VoucherTableRow from '../../components/admin/VoucherTableRow'
import Button from '../../components/Button'
import { useSelection } from '../../utils/useSelection'
import { useCrudOperations } from '../../utils/useCrudOperations'

/**
 * VoucherManagement component
 * @returns {JSX.Element} Voucher management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const { selected: selectedVouchers, toggle, selectAll, clear, selectedCount } = useSelection(vouchers)

  /**
   * Fetch vouchers with search and filter
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchVouchers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page,
        limit: entriesPerPage
      })
      if (searchTerm) params.append('search', String(searchTerm))
      const response = await axios.get(`/api/vouchers/admin/all?${params}`, {
        withCredentials: true
      })
      let filteredVouchers = response.data?.vouchers || []
      
      // Client-side status filtering
      if (statusFilter) {
        const now = new Date()
        filteredVouchers = filteredVouchers.filter(v => {
          const start = new Date(v.start_date)
          const end = new Date(v.end_date)
          if (statusFilter === 'active') {
            return v.is_active && now >= start && now <= end
          }
          if (statusFilter === 'inactive') {
            return !v.is_active || now < start
          }
          if (statusFilter === 'expired') {
            return now > end
          }
          return true
        })
      }
      
      const pagination = response.data?.pagination || { 
        page: 1, 
        limit: entriesPerPage, 
        total: 0, 
        pages: 1 
      }
      setVouchers(filteredVouchers)
      setTotalPages(pagination.pages || 1)
      setTotalItems(filteredVouchers.length)
      setInitialLoad(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load vouchers')
      setVouchers([])
      setTotalPages(1)
      setTotalItems(0)
      setInitialLoad(false)
    } finally {
      setLoading(false)
    }
  }

  const crud = useCrudOperations('/api/vouchers', fetchVouchers)

  /**
   * Handle sort change
   * @param {string} field - Sort field
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  /**
   * Handle update voucher
   * @param {Object} data - Voucher data
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleUpdate = async (data) => {
    await crud.handleUpdate(crud.editModal.entity.id, data)
  }

  /**
   * Handle bulk activate/deactivate
   * @param {boolean} isActive - Active status
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleBulkStatus = async (isActive) => {
    try {
      const ids = Array.from(selectedVouchers)
      await axios.post('/api/admin/vouchers/bulk-update', {
        voucherIds: ids,
        isActive
      }, { withCredentials: true })
      toast.success(`${ids.length} voucher(s) ${isActive ? 'activated' : 'deactivated'}`)
      clear()
      fetchVouchers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update vouchers')
    }
  }

  /**
   * Fetch vouchers when filters change
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    fetchVouchers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, entriesPerPage, searchTerm, statusFilter])

  if (loading && initialLoad && vouchers.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto ">
          {/* Loading skeleton */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Voucher Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Voucher management page with search and filters */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaTag className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Voucher Management</h1>
          </div>
          {/* Button */}
          <div className="flex items-center justify-center sm:mt-4 md:mt-0">
            <Button
              onClick={() => crud.setCreateModal({ isOpen: true })}
              icon={<FaPlus />}
            >
              Create Voucher
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-2 mb-4"><hr /></div>

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
            { value: '', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'expired', label: 'Expired' }
          ]}
          searchPlaceholder="Search vouchers by code..."
        />

        {/* Pagination top */}
        <Pagination
          position="top"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          entriesPerPage={entriesPerPage}
          onPageChange={setPage}
          onEntriesChange={(value) => {
            setEntriesPerPage(value)
            setPage(1)
          }}
        />

        {/* Vouchers table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <BulkSelectCheckbox
                      isSelectAll
                      totalItems={vouchers.length}
                      selectedCount={selectedCount}
                      onSelectAll={selectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <SortableTableHeader
                    label="Code"
                    field="code"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Type"
                    field="discount_type"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Value"
                    field="discount_value"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vouchers.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm ? `No vouchers found matching "${searchTerm}"` : 'No vouchers found'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  vouchers.map((voucher, index) => (
                    <VoucherTableRow
                      key={voucher.id}
                      voucher={voucher}
                      index={(page - 1) * entriesPerPage + index + 1}
                      isSelected={selectedVouchers.has(voucher.id)}
                      onToggle={toggle}
                      onEdit={() => crud.setEditModal({ isOpen: true, entity: voucher })}
                      onDelete={() => crud.setDeleteModal({ isOpen: true, entity: voucher })}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination bottom */}
        <Pagination
          position="bottom"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          entriesPerPage={entriesPerPage}
          onPageChange={setPage}
          onEntriesChange={(value) => {
            setEntriesPerPage(value)
            setPage(1)
          }}
        />

        {/* Create modal */}
        <VoucherCreateModal
          isOpen={crud.createModal.isOpen}
          onClose={() => crud.setCreateModal({ isOpen: false })}
          onSave={crud.handleCreate}
        />

        {/* Edit modal */}
        <VoucherEditModal
          voucher={crud.editModal.entity}
          isOpen={crud.editModal.isOpen}
          onClose={() => crud.setEditModal({ isOpen: false, entity: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={crud.deleteModal.entity}
          entityType="voucher"
          isOpen={crud.deleteModal.isOpen}
          onConfirm={crud.handleDeleteConfirm}
          onCancel={() => crud.setDeleteModal({ isOpen: false, entity: null })}
        />

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            actions={[
              { type: 'activate', label: 'Activate Selected' },
              { type: 'deactivate', label: 'Deactivate Selected' }
            ]}
            onAction={(actionType) => {
              if (actionType === 'activate') handleBulkStatus(true)
              if (actionType === 'deactivate') handleBulkStatus(false)
            }}
            onCancel={clear}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default VoucherManagement

