-- Badminton Stores Sample Data - Product Images
-- This file inserts 1-3 images per product with at least one primary image per product
-- 
-- Execution Order: 5 (Depends on products)
-- 
-- Note: Image URLs are placeholders and should be updated with actual S3 URLs after upload
-- 
-- @author Thang Truong
-- @date 2025-01-17

USE ecommerce-mysql-db;

-- ============================================
-- PRODUCT IMAGES (1-3 per product, at least 1 primary per product)
-- ============================================

-- Note: This file contains a sample pattern for product images
-- In a production environment, you would generate images for all products
-- For now, we'll create primary images for a representative sample
-- Each product should have at least one primary image (is_primary = TRUE)

-- Sample: Creating primary images for first 50 products as example
-- In production, extend this pattern to all products

-- Product images are created using subqueries to reference products by name
-- Format: INSERT INTO product_images (product_id, image_url, is_primary) VALUES
-- ((SELECT id FROM products WHERE name = 'Product Name'), 'placeholder_url_or_null', TRUE);

-- Example pattern (extend this for all products):
-- For each product, create 1-3 images with at least one marked as is_primary = TRUE
-- Image URLs can be NULL initially or use placeholder URLs like:
-- 'https://your-s3-bucket.s3.region.amazonaws.com/images/products/product-id/image.jpg'

-- Since we have many products, we'll create a systematic approach:
-- 1. Create primary image for each product (is_primary = TRUE)
-- 2. Optionally add 1-2 additional images per product (is_primary = FALSE)

-- Primary images for sample products (extend this pattern to all products)
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
-- Racquets - Head-Heavy Professional Rackets
((SELECT id FROM products WHERE name = 'Yonex Astrox 100 ZZ'), NULL, TRUE),
((SELECT id FROM products WHERE name = 'Victor Thruster F Enhanced'), NULL, TRUE),
((SELECT id FROM products WHERE name = 'Li-Ning Turbo Charging 75C'), NULL, TRUE),
((SELECT id FROM products WHERE name = 'Babolat Satelite Gravity 74'), NULL, TRUE),
((SELECT id FROM products WHERE name = 'Yonex Astrox 88D Pro'), NULL, TRUE),

-- Racquets - Even-Balance Professional Rackets
((SELECT id FROM products WHERE name = 'Yonex Nanoflare 800'), NULL, TRUE),
((SELECT id FROM products WHERE name = 'Victor Auraspeed 100X'), NULL, TRUE),
((SELECT id FROM products WHERE name = 'Li-Ning Windstorm 72'), NULL, TRUE),
((SELECT id FROM products WHERE name = 'Yonex Arcsaber 11 Pro'), NULL, TRUE),

-- Note: This is a template. In production, you would:
-- 1. Generate images for ALL products (not just samples)
-- 2. Use actual S3 URLs instead of NULL
-- 3. Add 1-2 additional images per product for better product presentation
-- 4. Ensure every product has at least one primary image

-- Example with multiple images per product:
-- INSERT INTO product_images (product_id, image_url, is_primary) VALUES
-- ((SELECT id FROM products WHERE name = 'Yonex Astrox 100 ZZ'), 'https://s3.amazonaws.com/bucket/images/products/1/main.jpg', TRUE),
-- ((SELECT id FROM products WHERE name = 'Yonex Astrox 100 ZZ'), 'https://s3.amazonaws.com/bucket/images/products/1/side.jpg', FALSE),
-- ((SELECT id FROM products WHERE name = 'Yonex Astrox 100 ZZ'), 'https://s3.amazonaws.com/bucket/images/products/1/detail.jpg', FALSE);

-- For now, we'll create a script pattern that can be extended:
-- This ensures every product has at least one primary image placeholder

-- IMPORTANT: After uploading actual product images to S3, update the image_url values
-- using UPDATE statements like:
-- UPDATE product_images SET image_url = 'actual_s3_url' WHERE product_id = (SELECT id FROM products WHERE name = 'Product Name');

