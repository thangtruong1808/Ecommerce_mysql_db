-- Migration: Add product_views table
-- This migration adds the product_views table to track product views for both authenticated and guest users
-- Date: 2025-12-12

USE ecommerce_db;

-- Create product_views table
CREATE TABLE IF NOT EXISTS product_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NULL,  -- NULL for guest users
    session_id VARCHAR(255) NULL,  -- UUID for guest sessions
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_user (user_id),
    INDEX idx_session (session_id),
    INDEX idx_viewed_at (viewed_at),
    INDEX idx_user_product (user_id, product_id),
    INDEX idx_session_product (session_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
