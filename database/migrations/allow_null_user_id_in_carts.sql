-- Migration: Allow NULL user_id in carts table for guest carts
-- This allows unauthenticated users to have carts stored in the database
-- Run this migration to fix the "Column user_id cannot be null" error
-- @author Thang Truong
-- @date 2025-12-12
-- 
-- To run this migration:
-- 1. Open MySQL client: mysql -u your_username -p
-- 2. Run: source database/migrations/allow_null_user_id_in_carts.sql
-- Or execute the SQL commands below in your MySQL client

USE ecommerce_db;

-- Step 1: Drop the foreign key constraint
-- Note: If you get an error that the constraint doesn't exist, that's okay - continue to step 2
ALTER TABLE carts DROP FOREIGN KEY carts_ibfk_1;

-- Step 2: Modify user_id column to allow NULL
-- This removes the NOT NULL constraint and UNIQUE constraint
ALTER TABLE carts MODIFY user_id INT NULL;

-- Step 3: Re-add the foreign key constraint (allows NULL values)
ALTER TABLE carts ADD CONSTRAINT carts_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Verification: Check that the column now allows NULL
-- Run this to verify: SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'ecommerce_db' AND TABLE_NAME = 'carts' AND COLUMN_NAME = 'user_id';
-- Expected result: 'YES'
