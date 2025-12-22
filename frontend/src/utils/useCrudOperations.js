/**
 * CRUD Operations Hook
 * Shared hook for common CRUD operations in admin pages
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { shouldSuppress401Toast } from './authUtils.js'

/**
 * useCrudOperations hook
 * @param {string} endpoint - API endpoint base path
 * @param {Function} onSuccess - Success callback
 * @returns {Object} CRUD operation handlers
 * @author Thang Truong
 * @date 2025-12-12
 */
export const useCrudOperations = (endpoint, onSuccess) => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, entity: null })
  const [editModal, setEditModal] = useState({ isOpen: false, entity: null })
  const [createModal, setCreateModal] = useState({ isOpen: false })

  /**
   * Handle create
   * @param {Object} data - Entity data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleCreate = async (data) => {
    try {
      await axios.post(endpoint, data)
      toast.success('Created successfully')
      setCreateModal({ isOpen: false })
      onSuccess?.()
    } catch (error) {
      // Suppress toast if 401 error will be handled by token refresh
      if (!shouldSuppress401Toast(error)) {
        toast.error(error.response?.data?.message || 'Failed to create')
      }
    }
  }

  /**
   * Handle update
   * @param {number} id - Entity ID
   * @param {Object} data - Entity data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleUpdate = async (id, data) => {
    try {
      await axios.put(`${endpoint}/${id}`, data)
      toast.success('Updated successfully')
      setEditModal({ isOpen: false, entity: null })
      onSuccess?.()
    } catch (error) {
      // Suppress toast if 401 error will be handled by token refresh
      if (!shouldSuppress401Toast(error)) {
        toast.error(error.response?.data?.message || 'Failed to update')
      }
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDeleteConfirm = async () => {
    if (!deleteModal.entity) return
    try {
      await axios.delete(`${endpoint}/${deleteModal.entity.id}`)
      toast.success('Deleted successfully')
      setDeleteModal({ isOpen: false, entity: null })
      onSuccess?.()
    } catch (error) {
      // Suppress toast if 401 error will be handled by token refresh
      if (!shouldSuppress401Toast(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete')
      }
    }
  }

  /**
   * Handle bulk delete
   * @param {Array} ids - Entity IDs
   * @param {string} bulkEndpoint - Bulk delete endpoint
   * @param {string} idsKey - Key name for IDs array in request body
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleBulkDelete = async (ids, bulkEndpoint, idsKey) => {
    try {
      const requestBody = idsKey ? { [idsKey]: ids } : { ids }
      await axios.post(bulkEndpoint, requestBody)
      toast.success(`${ids.length} item(s) deleted successfully`)
      onSuccess?.()
    } catch (error) {
      // Suppress toast if 401 error will be handled by token refresh
      if (!shouldSuppress401Toast(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete items')
      }
    }
  }

  return {
    deleteModal,
    setDeleteModal,
    editModal,
    setEditModal,
    createModal,
    setCreateModal,
    handleCreate,
    handleUpdate,
    handleDeleteConfirm,
    handleBulkDelete
  }
}
