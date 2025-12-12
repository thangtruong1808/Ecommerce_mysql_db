-- Migration: Fix collation issue in generate_invoice_number function
-- This fixes the "illegal mix of collations" error when placing orders
-- @author Thang Truong
-- @date 2025-12-12

USE ecommerce_db;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS generate_invoice_number;

-- Recreate the function with explicit collation for LIKE operation
DELIMITER //

CREATE FUNCTION generate_invoice_number() RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE invoice_num VARCHAR(50);
    DECLARE date_part VARCHAR(8);
    DECLARE seq_num INT;
    
    SET date_part = DATE_FORMAT(NOW(), '%Y%m%d');
    
    -- Get the last sequence number for today
    -- Use COLLATE to ensure consistent collation for LIKE operation
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number, -5) AS UNSIGNED)), 0) + 1
    INTO seq_num
    FROM invoices
    WHERE invoice_number COLLATE utf8mb4_unicode_ci LIKE CONCAT('INV-', date_part, '-%') COLLATE utf8mb4_unicode_ci;
    
    SET invoice_num = CONCAT('INV-', date_part, '-', LPAD(seq_num, 5, '0'));
    
    RETURN invoice_num;
END//

DELIMITER ;
