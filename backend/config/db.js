/**
 * Database Connection Module
 * Handles MySQL database connection with connection pooling
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import mysql from 'mysql2/promise'

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

/**
 * Test database connection
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('MySQL Database Connected Successfully')
    connection.release()
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`)
    process.exit(1)
  }
}

// Export pool for use in models
export default pool
export { connectDB }

