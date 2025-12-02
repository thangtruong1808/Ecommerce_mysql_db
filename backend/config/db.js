/**
 * Database Connection Module
 * Handles MySQL database connection with connection pooling
 * 
 * @author Thang Truong
 * @date 2024-12-19
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
  console.warn(`Warning: Could not load .env file from ${envPath}`)
  console.warn('Using default values or environment variables.')
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
    // Debug: Show what values are being used (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Database Configuration (from .env):')
      console.log(`  DB_HOST: ${process.env.DB_HOST || '(not set, using default: localhost)'}`)
      console.log(`  DB_USER: ${process.env.DB_USER || '(not set, using default: root)'}`)
      console.log(`  DB_NAME: ${process.env.DB_NAME || '(not set, using default: ecommerce_db)'}`)
      console.log(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? '*** (set)' : '(not set or empty)'}`)
      console.log(`  .env file path: ${envPath}`)
    }
    
    const connection = await pool.getConnection()
    console.log('MySQL Database Connected Successfully')
    console.log(`Connected to database: ${dbConfig.database} on ${dbConfig.host}`)
    connection.release()
  } catch (error) {
    console.error('Database Connection Error:', error.message)
    console.error('\nDatabase Configuration being used:')
    console.error(`  Host: ${dbConfig.host}`)
    console.error(`  User: ${dbConfig.user}`)
    console.error(`  Database: ${dbConfig.database}`)
    console.error(`  Password: ${dbConfig.password ? '*** (has value)' : '(empty or not set)'}`)
    console.error(`\nEnvironment variables from .env:`)
    console.error(`  DB_HOST: ${process.env.DB_HOST || '(not set)'}`)
    console.error(`  DB_USER: ${process.env.DB_USER || '(not set)'}`)
    console.error(`  DB_NAME: ${process.env.DB_NAME || '(not set)'}`)
    console.error(`  DB_PASSWORD: ${process.env.DB_PASSWORD ? '*** (set)' : '(not set or empty)'}`)
    console.error(`\n.env file location: ${envPath}`)
    console.error('\nPlease check your .env file in the project root directory.')
    console.error('Ensure DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME are set correctly.')
    console.error('Note: DB_PASSWORD should not have quotes around it in the .env file.')
    process.exit(1)
  }
}

// Export pool for use in models
export default pool
export { connectDB }

