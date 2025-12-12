/**
 * User Address Model
 * Handles all database operations related to user addresses
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Get all addresses for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of address objects
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getUserAddresses = async (userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
    [userId]
  )
  return rows
}

/**
 * Get address by ID
 * @param {number} addressId - Address ID
 * @param {number} userId - User ID (for security)
 * @returns {Promise<Object|null>} - Address object or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAddressById = async (addressId, userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM user_addresses WHERE id = ? AND user_id = ?',
    [addressId, userId]
  )
  return rows[0] || null
}

/**
 * Create a new address
 * @param {number} userId - User ID
 * @param {Object} addressData - Address data
 * @returns {Promise<number>} - Created address ID
 * @author Thang Truong
 * @date 2025-12-12
 */
export const createAddress = async (userId, addressData) => {
  const { address, city, postal_code, country, is_default } = addressData
  
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    
    // If this is set as default, unset other defaults
    if (is_default) {
      await connection.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      )
    }
    
    const [result] = await connection.execute(
      `INSERT INTO user_addresses (user_id, address, city, postal_code, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, address, city, postal_code, country, is_default || false]
    )
    
    await connection.commit()
    return result.insertId
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Update an address
 * @param {number} addressId - Address ID
 * @param {number} userId - User ID (for security)
 * @param {Object} addressData - Address data to update
 * @returns {Promise<Object|null>} - Updated address or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateAddress = async (addressId, userId, addressData) => {
  const { address, city, postal_code, country, is_default } = addressData
  
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    
    // If this is set as default, unset other defaults
    if (is_default) {
      await connection.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [userId, addressId]
      )
    }
    
    const fields = []
    const values = []
    
    if (address !== undefined) {
      fields.push('address = ?')
      values.push(address)
    }
    if (city !== undefined) {
      fields.push('city = ?')
      values.push(city)
    }
    if (postal_code !== undefined) {
      fields.push('postal_code = ?')
      values.push(postal_code)
    }
    if (country !== undefined) {
      fields.push('country = ?')
      values.push(country)
    }
    if (is_default !== undefined) {
      fields.push('is_default = ?')
      values.push(is_default)
    }
    
    if (fields.length === 0) {
      await connection.rollback()
      return null
    }
    
    values.push(addressId, userId)
    const [result] = await connection.execute(
      `UPDATE user_addresses SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    )
    
    if (result.affectedRows === 0) {
      await connection.rollback()
      return null
    }
    
    await connection.commit()
    return getAddressById(addressId, userId)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Delete an address
 * @param {number} addressId - Address ID
 * @param {number} userId - User ID (for security)
 * @returns {Promise<boolean>} - True if deleted
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteAddress = async (addressId, userId) => {
  const [result] = await db.execute(
    'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
    [addressId, userId]
  )
  return result.affectedRows > 0
}
