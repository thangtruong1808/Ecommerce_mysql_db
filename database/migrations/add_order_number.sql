-- Migration: Add order_number column and generate_order_number function
-- This adds professional order number format (ORD-YYYYMMDD-XXXXX) to orders table
-- @author Thang Truong
-- @date 2025-12-12
-- 
-- IMPORTANT: Run each section separately in your MySQL client
-- Section 1: Add column and index
-- Section 2: Create function (run this as a single block)
-- Section 3: Backfill existing orders

USE ecommerce_db;

-- ============================================
-- SECTION 1: Add column and index
-- Run this section first
-- ============================================

ALTER TABLE orders 
ADD COLUMN order_number VARCHAR(50) NULL AFTER id;

ALTER TABLE orders 
ADD UNIQUE INDEX idx_order_number (order_number);

-- ============================================
-- SECTION 2: Create function
-- IMPORTANT: Copy and run this entire section as ONE block
-- Do NOT split it - run from DELIMITER // to DELIMITER ; together
-- ============================================

DELIMITER //

DROP FUNCTION IF EXISTS generate_order_number//

CREATE FUNCTION generate_order_number() RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE order_num VARCHAR(50);
    DECLARE date_part VARCHAR(8);
    DECLARE seq_num INT;
    
    SET date_part = DATE_FORMAT(NOW(), '%Y%m%d');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number, -5) AS UNSIGNED)), 0) + 1
    INTO seq_num
    FROM orders
    WHERE order_number COLLATE utf8mb4_unicode_ci LIKE CONCAT('ORD-', date_part, '-%') COLLATE utf8mb4_unicode_ci;
    
    SET order_num = CONCAT('ORD-', date_part, '-', LPAD(seq_num, 5, '0'));
    
    RETURN order_num;
END//

DELIMITER ;

-- ============================================
-- SECTION 3: Backfill existing orders
-- Run this section last
-- ============================================

UPDATE orders 
SET order_number = CONCAT(
    'ORD-',
    DATE_FORMAT(created_at, '%Y%m%d'),
    '-',
    LPAD(id, 5, '0')
)
WHERE order_number IS NULL;
