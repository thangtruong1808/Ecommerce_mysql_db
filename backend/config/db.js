/**
 * Database Connection Module
 * Handles MySQL database connection with connection pooling
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from root .env file
// This ensures env vars are loaded before creating the database config
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../..')
const envPath = path.join(rootDir, '.env')

const envResult = dotenv.config({ path: envPath })
if (envResult.error && process.env.NODE_ENV !== 'test') {
  // .env file not found, using default values or environment variables
}

// Get database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

// Create connection pool for better performance
const pool = mysql.createPool(dbConfig)

/**
 * Test database connection
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const connection = await pool.getConnection()
    connection.release()
  } catch (error) {
    // Database connection failed - exit process
    process.exit(1)
  }
}

// Export pool for use in models
export default pool
export { connectDB }

