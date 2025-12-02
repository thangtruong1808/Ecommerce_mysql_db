-- Product Generation Script
-- This script generates INSERT statements for all 2500 products
-- Run this after inserting categories, subcategories, and child categories
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- This is a template showing the pattern for generating products
-- For production use, you would generate all 2500 products programmatically
-- Each child category (1-125) should have 20 products

-- Example pattern for generating products:
-- For each child_category_id from 1 to 125:
--   Generate 20 products with:
--     - Realistic name based on child category
--     - Detailed description (50-200 chars)
--     - Realistic price (varies by category type)
--     - Stock quantity (10-100 units)

-- Sample: Products for child_category_id = 1 (Android Phones)
-- (Already included in sample_data.sql)

-- To generate all products, you can use a script like this pattern:

/*
DELIMITER //
CREATE PROCEDURE generate_all_products()
BEGIN
  DECLARE child_cat_id INT DEFAULT 1;
  DECLARE product_num INT;
  DECLARE product_name VARCHAR(255);
  DECLARE product_desc TEXT;
  DECLARE product_price DECIMAL(10,2);
  DECLARE product_stock INT;
  
  WHILE child_cat_id <= 125 DO
    SET product_num = 1;
    WHILE product_num <= 20 DO
      -- Generate product data based on child_category_id
      SET product_name = CONCAT('Product ', child_cat_id, '-', product_num);
      SET product_desc = CONCAT('Description for product ', child_cat_id, '-', product_num);
      SET product_price = 10.00 + (RAND() * 1000);
      SET product_stock = 10 + FLOOR(RAND() * 90);
      
      INSERT INTO products (name, description, price, child_category_id, stock)
      VALUES (product_name, product_desc, product_price, child_cat_id, product_stock);
      
      SET product_num = product_num + 1;
    END WHILE;
    SET child_cat_id = child_cat_id + 1;
  END WHILE;
END//
DELIMITER ;

CALL generate_all_products();
*/

-- Alternatively, use a programming language (Node.js, Python, etc.) to generate
-- all INSERT statements with realistic product names and descriptions

