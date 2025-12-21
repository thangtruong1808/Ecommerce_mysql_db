/**
 * Date Formatting Utility
 * Utility functions for formatting dates
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * Format date to dd-mmm-yyyy format (e.g., 25-Dec-2025)
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string
 * @author Thang Truong
 * @date 2025-12-12
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    
    const day = String(date.getDate()).padStart(2, '0')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    
    return `${day}-${month}-${year}`
  } catch (error) {
    return 'N/A'
  }
}

/**
 * Format date and time to dd-mmm-yyyy HH:mm format
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date and time string
 * @author Thang Truong
 * @date 2025-12-12
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    
    const day = String(date.getDate()).padStart(2, '0')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${day}-${month}-${year} ${hours}:${minutes}`
  } catch (error) {
    return 'N/A'
  }
}

/**
 * Get relative date string (e.g., "Expires in 3 days")
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Relative date string
 * @author Thang Truong
 * @date 2025-12-17
 */
export const getRelativeDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    const now = new Date()
    const diff = date - now
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    if (days < 0) return 'Expired'
    if (days === 0) return 'Expires today'
    if (days === 1) return 'Expires tomorrow'
    return `Expires in ${days} days`
  } catch (error) {
    return ''
  }
}
