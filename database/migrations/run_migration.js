/**
 * Migration Runner Script
 * Runs the allow_null_user_id_in_carts migration
 * @author Thang Truong
 * @date 2025-12-12
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../..')

// Load environment variables
dotenv.config({ path: join(rootDir, '.env') })

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  multipleStatements: true
}

/**
 * Run migration to allow NULL user_id in carts table
 * @author Thang Truong
 * @date 2025-12-12
 */
async function runMigration() {
  let connection
  try {
    connection = await mysql.createConnection(dbConfig)
    console.log('Connected to database:', dbConfig.database)

    // Read migration SQL file
    const migrationPath = join(__dirname, 'allow_null_user_id_in_carts.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')

    // Execute migration
    console.log('Running migration: allow_null_user_id_in_carts...')
    await connection.query(migrationSQL)
    console.log('Migration completed successfully!')

    // Verify migration
    const [rows] = await connection.query(
      `SELECT IS_NULLABLE 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'carts' 
       AND COLUMN_NAME = 'user_id'`,
      [dbConfig.database]
    )

    if (rows[0]?.IS_NULLABLE === 'YES') {
      console.log('✓ Verification: user_id column now allows NULL')
    } else {
      console.log('⚠ Warning: user_id column still does not allow NULL')
    }
  } catch (error) {
    console.error('Migration failed:', error.message)
    if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
      console.error('Note: Foreign key constraint might have a different name.')
      console.error('Please run the SQL migration manually from the file.')
    }
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

runMigration()
