/**
 * Selection Hook
 * Reusable hook for managing item selection in tables
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState } from 'react'

/**
 * useSelection hook
 * @param {Array} items - Array of items with id property
 * @returns {Object} Selection state and handlers
 * @author Thang Truong
 * @date 2025-12-12
 */
export const useSelection = (items = []) => {
  const [selected, setSelected] = useState(new Set())

  /**
   * Toggle item selection
   * @param {number|string} id - Item ID
   * @author Thang Truong
   * @date 2025-12-12
   */
  const toggle = (id) => {
    setSelected(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  /**
   * Select all items
   * @param {boolean} select - Whether to select or deselect all
   * @author Thang Truong
   * @date 2025-12-12
   */
  const selectAll = (select) => {
    if (select) {
      setSelected(new Set(items.map(item => item.id)))
    } else {
      setSelected(new Set())
    }
  }

  /**
   * Clear selection
   * @author Thang Truong
   * @date 2025-12-12
   */
  const clear = () => {
    setSelected(new Set())
  }

  return {
    selected,
    toggle,
    selectAll,
    clear,
    selectedCount: selected.size
  }
}
