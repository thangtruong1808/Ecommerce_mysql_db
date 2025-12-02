-- Product Data for Ecommerce Database
-- This file contains products for child categories 122-125 (4 child categories)
-- Each child category has 20 products = 80 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 122-125
-- ============================================

-- Child Category 122: Pillows & Mattress Toppers (subcategory_id: 25, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Memory Foam Pillow', 'Memory foam pillow with excellent support, comfortable, hypoallergenic, standard size', 39.99, 122, 150),
('Down Pillow', 'Down pillow with excellent comfort, soft, hypoallergenic, standard size', 49.99, 122, 140),
('Mattress Topper Memory Foam', 'Memory foam mattress topper with excellent support, comfortable, hypoallergenic, queen size', 129.99, 122, 100),
('Memory Foam Pillow Set of 2', 'Set of 2 memory foam pillows with excellent support, comfortable, hypoallergenic, standard size', 69.99, 122, 145),
('Down Pillow Set of 2', 'Set of 2 down pillows with excellent comfort, soft, hypoallergenic, standard size', 89.99, 122, 135),
('Mattress Topper Gel Memory Foam', 'Gel memory foam mattress topper with excellent support, comfortable, cooling, queen size', 149.99, 122, 95),
('Memory Foam Pillow Premium', 'Premium memory foam pillow with excellent support, comfortable, hypoallergenic, standard size', 59.99, 122, 138),
('Down Pillow Premium', 'Premium down pillow with excellent comfort, soft, hypoallergenic, standard size', 69.99, 122, 128),
('Mattress Topper Memory Foam King', 'Memory foam mattress topper with excellent support, comfortable, hypoallergenic, king size', 159.99, 122, 90),
('Memory Foam Pillow Set of 4', 'Set of 4 memory foam pillows with excellent support, comfortable, hypoallergenic, standard size', 119.99, 122, 140),
('Down Pillow Set of 4', 'Set of 4 down pillows with excellent comfort, soft, hypoallergenic, standard size', 159.99, 122, 130),
('Mattress Topper Gel Memory Foam King', 'Gel memory foam mattress topper with excellent support, comfortable, cooling, king size', 179.99, 122, 85),
('Memory Foam Pillow Deluxe', 'Deluxe memory foam pillow with excellent support, comfortable, hypoallergenic, standard size', 79.99, 122, 133),
('Down Pillow Deluxe', 'Deluxe down pillow with excellent comfort, soft, hypoallergenic, standard size', 89.99, 122, 123),
('Mattress Topper Memory Foam Full', 'Memory foam mattress topper with excellent support, comfortable, hypoallergenic, full size', 109.99, 122, 105),
('Memory Foam Pillow Ultimate', 'Ultimate memory foam pillow with excellent support, comfortable, hypoallergenic, standard size', 99.99, 122, 128),
('Down Pillow Ultimate', 'Ultimate down pillow with excellent comfort, soft, hypoallergenic, standard size', 109.99, 122, 118),
('Mattress Topper Gel Memory Foam Full', 'Gel memory foam mattress topper with excellent support, comfortable, cooling, full size', 129.99, 122, 100),
('Memory Foam Pillow Complete Set', 'Complete memory foam pillow set with excellent support, comfortable, hypoallergenic, 4-piece', 139.99, 122, 125),
('Down Pillow Complete Set', 'Complete down pillow set with excellent comfort, soft, hypoallergenic, 4-piece', 179.99, 122, 115);

-- Child Category 123: Bath Towels (subcategory_id: 25, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Bath Towel Set of 4', 'Set of 4 bath towels with excellent absorbency, soft, durable, various colors, 27x52 inches', 39.99, 123, 150),
('Hand Towel Set of 4', 'Set of 4 hand towels with excellent absorbency, soft, durable, various colors, 16x28 inches', 24.99, 123, 160),
('Washcloth Set of 6', 'Set of 6 washcloths with excellent absorbency, soft, durable, various colors, 13x13 inches', 19.99, 123, 170),
('Bath Towel Set of 6', 'Set of 6 bath towels with excellent absorbency, soft, durable, various colors, 27x52 inches', 59.99, 123, 145),
('Hand Towel Set of 6', 'Set of 6 hand towels with excellent absorbency, soft, durable, various colors, 16x28 inches', 34.99, 123, 155),
('Washcloth Set of 8', 'Set of 8 washcloths with excellent absorbency, soft, durable, various colors, 13x13 inches', 24.99, 123, 165),
('Bath Towel Set of 8', 'Set of 8 bath towels with excellent absorbency, soft, durable, various colors, 27x52 inches', 79.99, 123, 140),
('Hand Towel Set of 8', 'Set of 8 hand towels with excellent absorbency, soft, durable, various colors, 16x28 inches', 44.99, 123, 150),
('Washcloth Set of 10', 'Set of 10 washcloths with excellent absorbency, soft, durable, various colors, 13x13 inches', 29.99, 123, 160),
('Bath Towel Premium Set of 4', 'Premium set of 4 bath towels with excellent absorbency, soft, durable, various colors, 30x56 inches', 59.99, 123, 135),
('Hand Towel Premium Set of 4', 'Premium set of 4 hand towels with excellent absorbency, soft, durable, various colors, 18x30 inches', 34.99, 123, 145),
('Washcloth Premium Set of 6', 'Premium set of 6 washcloths with excellent absorbency, soft, durable, various colors, 14x14 inches', 29.99, 123, 155),
('Bath Towel Premium Set of 6', 'Premium set of 6 bath towels with excellent absorbency, soft, durable, various colors, 30x56 inches', 89.99, 123, 130),
('Hand Towel Premium Set of 6', 'Premium set of 6 hand towels with excellent absorbency, soft, durable, various colors, 18x30 inches', 49.99, 123, 140),
('Washcloth Premium Set of 8', 'Premium set of 8 washcloths with excellent absorbency, soft, durable, various colors, 14x14 inches', 34.99, 123, 150),
('Bath Towel Deluxe Set of 4', 'Deluxe set of 4 bath towels with excellent absorbency, soft, durable, various colors, 32x60 inches', 79.99, 123, 125),
('Hand Towel Deluxe Set of 4', 'Deluxe set of 4 hand towels with excellent absorbency, soft, durable, various colors, 20x32 inches', 44.99, 123, 135),
('Washcloth Deluxe Set of 6', 'Deluxe set of 6 washcloths with excellent absorbency, soft, durable, various colors, 15x15 inches', 39.99, 123, 145),
('Bath Towel Complete Set', 'Complete bath towel set with bath towels, hand towels, washcloths, excellent absorbency, soft, durable', 99.99, 123, 120),
('Hand Towel Complete Set', 'Complete hand towel set with hand towels and washcloths, excellent absorbency, soft, durable', 59.99, 123, 130);

-- Child Category 124: Bath Accessories (subcategory_id: 25, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Shower Curtain', 'Shower curtain with water-resistant fabric, various designs, easy installation, 72x72 inches', 24.99, 124, 150),
('Bath Mat Set of 2', 'Set of 2 bath mats with non-slip backing, soft, absorbent, easy to clean, various colors', 29.99, 124, 140),
('Shower Curtain Premium', 'Premium shower curtain with water-resistant fabric, various designs, easy installation, 72x72 inches', 39.99, 124, 135),
('Bath Mat Set of 3', 'Set of 3 bath mats with non-slip backing, soft, absorbent, easy to clean, various colors', 39.99, 124, 130),
('Shower Curtain Deluxe', 'Deluxe shower curtain with water-resistant fabric, various designs, easy installation, 72x72 inches', 49.99, 124, 125),
('Bath Mat Premium Set of 2', 'Premium set of 2 bath mats with non-slip backing, soft, absorbent, easy to clean, various colors', 44.99, 124, 128),
('Shower Curtain Set', 'Shower curtain set with curtain, liner, and hooks, water-resistant fabric, easy installation, 72x72 inches', 34.99, 124, 138),
('Bath Mat Deluxe Set of 2', 'Deluxe set of 2 bath mats with non-slip backing, soft, absorbent, easy to clean, various colors', 54.99, 124, 123),
('Shower Curtain Premium Set', 'Premium shower curtain set with curtain, liner, and hooks, water-resistant fabric, easy installation', 59.99, 124, 120),
('Bath Mat Set of 4', 'Set of 4 bath mats with non-slip backing, soft, absorbent, easy to clean, various colors', 49.99, 124, 125),
('Shower Curtain Deluxe Set', 'Deluxe shower curtain set with curtain, liner, and hooks, water-resistant fabric, easy installation', 69.99, 124, 115),
('Bath Mat Premium Set of 3', 'Premium set of 3 bath mats with non-slip backing, soft, absorbent, easy to clean, various colors', 59.99, 124, 118),
('Shower Curtain Ultimate', 'Ultimate shower curtain with water-resistant fabric, various designs, easy installation, 72x72 inches', 79.99, 124, 110),
('Bath Mat Deluxe Set of 3', 'Deluxe set of 3 bath mats with non-slip backing, soft, absorbent, easy to clean, various colors', 69.99, 124, 113),
('Shower Curtain Ultimate Set', 'Ultimate shower curtain set with curtain, liner, and hooks, water-resistant fabric, easy installation', 89.99, 124, 105),
('Bath Mat Complete Set', 'Complete bath mat set with non-slip backing, soft, absorbent, easy to clean, various colors, 4-piece', 79.99, 124, 108),
('Shower Curtain Complete', 'Complete shower curtain with water-resistant fabric, various designs, easy installation, 72x72 inches, premium', 99.99, 124, 100),
('Bath Mat Ultimate Set of 2', 'Ultimate set of 2 bath mats with non-slip backing, soft, absorbent, easy to clean, various colors', 84.99, 124, 103),
('Shower Curtain Complete Set', 'Complete shower curtain set with curtain, liner, and hooks, water-resistant fabric, easy installation, premium', 109.99, 124, 95),
('Bath Mat Ultimate Set of 3', 'Ultimate set of 3 bath mats with non-slip backing, soft, absorbent, easy to clean, various colors', 94.99, 124, 98);

-- Child Category 125: Bathroom Storage (subcategory_id: 25, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Medicine Cabinet', 'Medicine cabinet with mirror, spacious storage, easy installation, various sizes, excellent quality', 149.99, 125, 100),
('Bathroom Organizer', 'Bathroom organizer with multiple shelves, spacious storage, easy installation, excellent quality', 39.99, 125, 140),
('Medicine Cabinet Premium', 'Premium medicine cabinet with mirror, spacious storage, easy installation, various sizes, excellent quality', 199.99, 125, 90),
('Bathroom Organizer Premium', 'Premium bathroom organizer with multiple shelves, spacious storage, easy installation, excellent quality', 59.99, 125, 130),
('Medicine Cabinet Deluxe', 'Deluxe medicine cabinet with mirror, spacious storage, easy installation, various sizes, excellent quality', 249.99, 125, 80),
('Bathroom Organizer Deluxe', 'Deluxe bathroom organizer with multiple shelves, spacious storage, easy installation, excellent quality', 79.99, 125, 120),
('Medicine Cabinet Set', 'Medicine cabinet set with mirror and shelves, spacious storage, easy installation, various sizes, excellent quality', 179.99, 125, 95),
('Bathroom Organizer Set', 'Bathroom organizer set with multiple shelves and drawers, spacious storage, easy installation, excellent quality', 99.99, 125, 110),
('Medicine Cabinet Premium Set', 'Premium medicine cabinet set with mirror and shelves, spacious storage, easy installation, various sizes', 229.99, 125, 85),
('Bathroom Organizer Premium Set', 'Premium bathroom organizer set with multiple shelves and drawers, spacious storage, easy installation', 119.99, 125, 105),
('Medicine Cabinet Deluxe Set', 'Deluxe medicine cabinet set with mirror and shelves, spacious storage, easy installation, various sizes', 279.99, 125, 75),
('Bathroom Organizer Deluxe Set', 'Deluxe bathroom organizer set with multiple shelves and drawers, spacious storage, easy installation', 139.99, 125, 100),
('Medicine Cabinet Ultimate', 'Ultimate medicine cabinet with mirror, spacious storage, easy installation, various sizes, excellent quality', 299.99, 125, 70),
('Bathroom Organizer Ultimate', 'Ultimate bathroom organizer with multiple shelves, spacious storage, easy installation, excellent quality', 159.99, 125, 95),
('Medicine Cabinet Complete', 'Complete medicine cabinet with mirror, shelves, and lighting, spacious storage, easy installation, various sizes', 349.99, 125, 65),
('Bathroom Organizer Complete', 'Complete bathroom organizer with multiple shelves, drawers, and hooks, spacious storage, easy installation', 179.99, 125, 90),
('Medicine Cabinet Ultimate Set', 'Ultimate medicine cabinet set with mirror and shelves, spacious storage, easy installation, various sizes', 329.99, 125, 68),
('Bathroom Organizer Ultimate Set', 'Ultimate bathroom organizer set with multiple shelves and drawers, spacious storage, easy installation', 199.99, 125, 88),
('Medicine Cabinet Complete Set', 'Complete medicine cabinet set with mirror, shelves, and lighting, spacious storage, easy installation', 379.99, 125, 62),
('Bathroom Organizer Complete Set', 'Complete bathroom organizer set with multiple shelves, drawers, and hooks, spacious storage, easy installation', 219.99, 125, 85);

