-- Product Data for Ecommerce Database
-- This file contains products for child categories 32-41 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 32-41
-- ============================================

-- Child Category 32: Synthetic Shuttlecocks (subcategory_id: 7, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Mavis 350', 'Premium synthetic shuttlecock, durable, consistent flight, 12-pack', 16.99, 32, 200, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.3', 'Premium synthetic shuttlecock, durable, consistent flight, 12-pack', 15.99, 32, 205, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 300', 'Premium synthetic shuttlecock, durable, consistent flight, 12-pack', 14.99, 32, 210, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 370', 'Professional synthetic shuttlecock, high quality, consistent flight, 12-pack', 18.99, 32, 195, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.4', 'Professional synthetic shuttlecock, good quality, consistent flight, 12-pack', 17.99, 32, 198, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 400', 'Professional synthetic shuttlecock, good quality, consistent flight, 12-pack', 16.99, 32, 200, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 2000', 'Intermediate synthetic shuttlecock, good quality, consistent flight, 12-pack', 12.99, 32, 220, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.5', 'Intermediate synthetic shuttlecock, affordable quality, consistent flight, 12-pack', 11.99, 32, 225, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 500', 'Intermediate synthetic shuttlecock, affordable quality, consistent flight, 12-pack', 10.99, 32, 230, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 10', 'Beginner synthetic shuttlecock, affordable quality, consistent flight, 12-pack', 8.99, 32, 250, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.6', 'Beginner synthetic shuttlecock, affordable quality, consistent flight, 12-pack', 7.99, 32, 255, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 600', 'Beginner synthetic shuttlecock, affordable quality, consistent flight, 12-pack', 6.99, 32, 260, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 500', 'Training synthetic shuttlecock, durable, consistent flight, 12-pack', 9.99, 32, 245, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.7', 'Training synthetic shuttlecock, durable, consistent flight, 12-pack', 8.99, 32, 248, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 700', 'Training synthetic shuttlecock, durable, consistent flight, 12-pack', 7.99, 32, 250, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 600', 'Competition synthetic shuttlecock, high quality, consistent flight, 12-pack', 19.99, 32, 190, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.2', 'Competition synthetic shuttlecock, professional quality, excellent flight, 12-pack', 18.99, 32, 192, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 200', 'Competition synthetic shuttlecock, tournament-grade, consistent flight, 12-pack', 17.99, 32, 195, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 700', 'Elite synthetic shuttlecock, premium quality, exceptional flight, 12-pack', 21.99, 32, 180, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.1', 'Elite synthetic shuttlecock, premium quality, exceptional flight, 12-pack', 20.99, 32, 185, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 33: Training Shuttlecocks (subcategory_id: 7, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Mavis 10', 'Economical training shuttlecock, durable, consistent flight, 12-pack', 8.99, 33, 250, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.6', 'Economical training shuttlecock, durable, consistent flight, 12-pack', 7.99, 33, 255, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 600', 'Economical training shuttlecock, durable, consistent flight, 12-pack', 6.99, 33, 260, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 200', 'Budget training shuttlecock, good quality, consistent flight, 12-pack', 9.99, 33, 245, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.7', 'Budget training shuttlecock, good quality, consistent flight, 12-pack', 8.99, 33, 248, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 700', 'Budget training shuttlecock, good quality, consistent flight, 12-pack', 7.99, 33, 250, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 300', 'Standard training shuttlecock, consistent flight, 12-pack', 10.99, 33, 240, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.8', 'Standard training shuttlecock, consistent flight, 12-pack', 9.99, 33, 243, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 800', 'Standard training shuttlecock, consistent flight, 12-pack', 8.99, 33, 245, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 400', 'Quality training shuttlecock, consistent flight, 12-pack', 11.99, 33, 235, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.9', 'Quality training shuttlecock, consistent flight, 12-pack', 10.99, 33, 238, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 900', 'Quality training shuttlecock, consistent flight, 12-pack', 9.99, 33, 240, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 500', 'Premium training shuttlecock, high quality, consistent flight, 12-pack', 12.99, 33, 230, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.10', 'Premium training shuttlecock, high quality, consistent flight, 12-pack', 11.99, 33, 233, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 1000', 'Premium training shuttlecock, high quality, consistent flight, 12-pack', 10.99, 33, 235, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 600', 'Professional training shuttlecock, excellent quality, consistent flight, 12-pack', 13.99, 33, 225, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.11', 'Professional training shuttlecock, excellent quality, consistent flight, 12-pack', 12.99, 33, 228, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 1100', 'Professional training shuttlecock, excellent quality, consistent flight, 12-pack', 11.99, 33, 230, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 700', 'Elite training shuttlecock, premium quality, exceptional flight, 12-pack', 14.99, 33, 220, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.12', 'Elite training shuttlecock, premium quality, exceptional flight, 12-pack', 13.99, 33, 223, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 34: Competition Shuttlecocks (subcategory_id: 7, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Aerosensa 50', 'Tournament-grade competition shuttlecock, premium quality, consistent flight, 12-pack', 29.99, 34, 120, NULL, NULL, NULL, NULL, FALSE),
('Victor Master Ace', 'Tournament-grade competition shuttlecock, premium quality, excellent flight, 12-pack', 27.99, 34, 125, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 60', 'Tournament-grade competition shuttlecock, premium quality, consistent flight, 12-pack', 26.99, 34, 130, NULL, NULL, NULL, NULL, FALSE),
('Yonex Aerosensa 40', 'Professional competition shuttlecock, high quality, consistent flight, 12-pack', 26.99, 34, 135, NULL, NULL, NULL, NULL, FALSE),
('Victor Master Ace Pro', 'Professional competition shuttlecock, high quality, excellent flight, 12-pack', 29.99, 34, 120, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 40', 'Professional competition shuttlecock, high quality, consistent flight, 12-pack', 27.99, 34, 128, NULL, NULL, NULL, NULL, FALSE),
('Yonex Aerosensa 30', 'Elite competition shuttlecock, exceptional quality, consistent flight, 12-pack', 24.99, 34, 140, NULL, NULL, NULL, NULL, FALSE),
('Victor Champion', 'Elite competition shuttlecock, exceptional quality, excellent flight, 12-pack', 22.99, 34, 145, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 80', 'Elite competition shuttlecock, exceptional quality, consistent flight, 12-pack', 28.99, 34, 132, NULL, NULL, NULL, NULL, FALSE),
('Yonex Aerosensa 60', 'Championship competition shuttlecock, premium quality, exceptional flight, 12-pack', 32.99, 34, 110, NULL, NULL, NULL, NULL, FALSE),
('Victor Master Ace Elite', 'Championship competition shuttlecock, premium quality, exceptional flight, 12-pack', 31.99, 34, 115, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 20', 'Championship competition shuttlecock, premium quality, exceptional flight, 12-pack', 30.99, 34, 118, NULL, NULL, NULL, NULL, FALSE),
('Yonex Aerosensa 70', 'World-class competition shuttlecock, ultimate quality, exceptional flight, 12-pack', 34.99, 34, 105, NULL, NULL, NULL, NULL, FALSE),
('Victor Master Ace World', 'World-class competition shuttlecock, ultimate quality, exceptional flight, 12-pack', 33.99, 34, 108, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 10', 'World-class competition shuttlecock, ultimate quality, exceptional flight, 12-pack', 32.99, 34, 112, NULL, NULL, NULL, NULL, FALSE),
('Yonex Aerosensa 80', 'Olympic-grade competition shuttlecock, ultimate quality, exceptional flight, 12-pack', 36.99, 34, 100, NULL, NULL, NULL, NULL, FALSE),
('Victor Master Ace Olympic', 'Olympic-grade competition shuttlecock, ultimate quality, exceptional flight, 12-pack', 35.99, 34, 103, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 5', 'Olympic-grade competition shuttlecock, ultimate quality, exceptional flight, 12-pack', 34.99, 34, 106, NULL, NULL, NULL, NULL, FALSE),
('Yonex Aerosensa 90', 'Professional-grade competition shuttlecock, ultimate quality, exceptional flight, 12-pack', 38.99, 34, 95, NULL, NULL, NULL, NULL, FALSE),
('Victor Master Ace Pro Elite', 'Professional-grade competition shuttlecock, ultimate quality, exceptional flight, 12-pack', 37.99, 34, 98, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 35: Recreational Shuttlecocks (subcategory_id: 7, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Mavis 10', 'Casual recreational shuttlecock, affordable, consistent flight, 12-pack', 8.99, 35, 280, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.6', 'Casual recreational shuttlecock, affordable, consistent flight, 12-pack', 7.99, 35, 285, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 600', 'Casual recreational shuttlecock, affordable, consistent flight, 12-pack', 6.99, 35, 290, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 200', 'Standard recreational shuttlecock, good quality, consistent flight, 12-pack', 9.99, 35, 270, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.7', 'Standard recreational shuttlecock, good quality, consistent flight, 12-pack', 8.99, 35, 275, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 700', 'Standard recreational shuttlecock, good quality, consistent flight, 12-pack', 7.99, 35, 278, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 300', 'Quality recreational shuttlecock, consistent flight, 12-pack', 10.99, 35, 265, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.8', 'Quality recreational shuttlecock, consistent flight, 12-pack', 9.99, 35, 268, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 800', 'Quality recreational shuttlecock, consistent flight, 12-pack', 8.99, 35, 270, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 400', 'Premium recreational shuttlecock, high quality, consistent flight, 12-pack', 11.99, 35, 260, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.9', 'Premium recreational shuttlecock, high quality, consistent flight, 12-pack', 10.99, 35, 263, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 900', 'Premium recreational shuttlecock, high quality, consistent flight, 12-pack', 9.99, 35, 265, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 500', 'Deluxe recreational shuttlecock, excellent quality, consistent flight, 12-pack', 12.99, 35, 255, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.10', 'Deluxe recreational shuttlecock, excellent quality, consistent flight, 12-pack', 11.99, 35, 258, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 1000', 'Deluxe recreational shuttlecock, excellent quality, consistent flight, 12-pack', 10.99, 35, 260, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 600', 'Ultra recreational shuttlecock, premium quality, consistent flight, 12-pack', 13.99, 35, 250, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.11', 'Ultra recreational shuttlecock, premium quality, consistent flight, 12-pack', 12.99, 35, 253, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning A+ 1100', 'Ultra recreational shuttlecock, premium quality, consistent flight, 12-pack', 11.99, 35, 255, NULL, NULL, NULL, NULL, FALSE),
('Yonex Mavis 700', 'Elite recreational shuttlecock, ultimate quality, exceptional flight, 12-pack', 14.99, 35, 245, NULL, NULL, NULL, NULL, FALSE),
('Victor Master No.12', 'Elite recreational shuttlecock, ultimate quality, exceptional flight, 12-pack', 13.99, 35, 248, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 36: Professional Badminton Shoes (subcategory_id: 8, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3', 'Professional badminton shoes with Power Cushion technology, excellent grip, lightweight', 149.99, 36, 60, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200', 'Professional badminton shoes with excellent cushioning, stability, court grip', 139.99, 36, 65, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD006', 'Professional badminton shoes with excellent grip, cushioning, stability', 129.99, 36, 70, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z3', 'Professional badminton shoes with Power Cushion, stability, excellent grip', 159.99, 36, 58, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500', 'Professional badminton shoes with excellent cushioning, grip, stability', 149.99, 36, 62, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD007', 'Professional badminton shoes with excellent grip, cushioning, stability', 139.99, 36, 68, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D', 'Professional badminton shoes with Power Cushion, excellent grip, stability', 169.99, 36, 55, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200A', 'Professional badminton shoes with excellent cushioning, stability, court grip', 149.99, 36, 60, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD008', 'Professional badminton shoes with excellent grip, cushioning, stability', 139.99, 36, 66, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 FT', 'Professional badminton shoes with Power Cushion, excellent grip, lightweight', 159.99, 36, 57, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200B', 'Professional badminton shoes with excellent cushioning, stability, court grip', 149.99, 36, 61, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD009', 'Professional badminton shoes with excellent grip, cushioning, stability', 139.99, 36, 67, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 Z2', 'Professional badminton shoes with Power Cushion technology, excellent grip', 139.99, 36, 63, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500A', 'Professional badminton shoes with excellent cushioning, grip, stability', 149.99, 36, 59, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD010', 'Professional badminton shoes with excellent grip, cushioning, stability', 129.99, 36, 69, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z2', 'Professional badminton shoes with Power Cushion, stability, excellent grip', 149.99, 36, 60, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200C', 'Professional badminton shoes with excellent cushioning, stability, court grip', 139.99, 36, 64, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD011', 'Professional badminton shoes with excellent grip, cushioning, stability', 129.99, 36, 70, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D Pro', 'Professional badminton shoes with Power Cushion, excellent grip, stability', 179.99, 36, 52, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500B', 'Professional badminton shoes with excellent cushioning, grip, stability', 149.99, 36, 58, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 37: Indoor Court Shoes (subcategory_id: 8, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3', 'Indoor court shoes with Power Cushion technology, excellent grip, lightweight', 149.99, 37, 75, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200', 'Indoor court shoes with excellent cushioning, stability, court grip', 139.99, 37, 80, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD006', 'Indoor court shoes with excellent grip, cushioning, stability', 129.99, 37, 85, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z3', 'Indoor court shoes with Power Cushion, stability, excellent grip', 159.99, 37, 72, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500', 'Indoor court shoes with excellent cushioning, grip, stability', 149.99, 37, 78, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD007', 'Indoor court shoes with excellent grip, cushioning, stability', 139.99, 37, 82, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D', 'Indoor court shoes with Power Cushion, excellent grip, stability', 169.99, 37, 70, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200A', 'Indoor court shoes with excellent cushioning, stability, court grip', 149.99, 37, 76, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD008', 'Indoor court shoes with excellent grip, cushioning, stability', 139.99, 37, 80, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 FT', 'Indoor court shoes with Power Cushion, excellent grip, lightweight', 159.99, 37, 73, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200B', 'Indoor court shoes with excellent cushioning, stability, court grip', 149.99, 37, 77, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD009', 'Indoor court shoes with excellent grip, cushioning, stability', 139.99, 37, 81, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 Z2', 'Indoor court shoes with Power Cushion technology, excellent grip', 139.99, 37, 79, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500A', 'Indoor court shoes with excellent cushioning, grip, stability', 149.99, 37, 75, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD010', 'Indoor court shoes with excellent grip, cushioning, stability', 129.99, 37, 83, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z2', 'Indoor court shoes with Power Cushion, stability, excellent grip', 149.99, 37, 76, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200C', 'Indoor court shoes with excellent cushioning, stability, court grip', 139.99, 37, 78, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD011', 'Indoor court shoes with excellent grip, cushioning, stability', 129.99, 37, 82, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D Pro', 'Indoor court shoes with Power Cushion, excellent grip, stability', 179.99, 37, 68, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500B', 'Indoor court shoes with excellent cushioning, grip, stability', 149.99, 37, 74, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 38: Lightweight Badminton Shoes (subcategory_id: 8, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3', 'Lightweight badminton shoes with Power Cushion technology, excellent grip, agility', 149.99, 38, 80, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200', 'Lightweight badminton shoes with excellent cushioning, stability, court grip', 139.99, 38, 85, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD006', 'Lightweight badminton shoes with excellent grip, cushioning, stability', 129.99, 38, 90, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z3', 'Lightweight badminton shoes with Power Cushion, stability, excellent grip', 159.99, 38, 78, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500', 'Lightweight badminton shoes with excellent cushioning, grip, stability', 149.99, 38, 83, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD007', 'Lightweight badminton shoes with excellent grip, cushioning, stability', 139.99, 38, 87, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D', 'Lightweight badminton shoes with Power Cushion, excellent grip, stability', 169.99, 38, 75, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200A', 'Lightweight badminton shoes with excellent cushioning, stability, court grip', 149.99, 38, 81, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD008', 'Lightweight badminton shoes with excellent grip, cushioning, stability', 139.99, 38, 85, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 FT', 'Lightweight badminton shoes with Power Cushion, excellent grip, agility', 159.99, 38, 79, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200B', 'Lightweight badminton shoes with excellent cushioning, stability, court grip', 149.99, 38, 82, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD009', 'Lightweight badminton shoes with excellent grip, cushioning, stability', 139.99, 38, 86, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 Z2', 'Lightweight badminton shoes with Power Cushion technology, excellent grip', 139.99, 38, 84, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500A', 'Lightweight badminton shoes with excellent cushioning, grip, stability', 149.99, 38, 80, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD010', 'Lightweight badminton shoes with excellent grip, cushioning, stability', 129.99, 38, 88, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z2', 'Lightweight badminton shoes with Power Cushion, stability, excellent grip', 149.99, 38, 81, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200C', 'Lightweight badminton shoes with excellent cushioning, stability, court grip', 139.99, 38, 83, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD011', 'Lightweight badminton shoes with excellent grip, cushioning, stability', 129.99, 38, 87, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D Pro', 'Lightweight badminton shoes with Power Cushion, excellent grip, stability', 179.99, 38, 73, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500B', 'Lightweight badminton shoes with excellent cushioning, grip, stability', 149.99, 38, 79, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 39: Cushioned Badminton Shoes (subcategory_id: 8, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3', 'Cushioned badminton shoes with Power Cushion technology, excellent comfort, grip', 149.99, 39, 70, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200', 'Cushioned badminton shoes with excellent cushioning, stability, court grip', 139.99, 39, 75, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD006', 'Cushioned badminton shoes with excellent grip, cushioning, stability', 129.99, 39, 80, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z3', 'Cushioned badminton shoes with Power Cushion, stability, excellent comfort', 159.99, 39, 68, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500', 'Cushioned badminton shoes with excellent cushioning, grip, stability', 149.99, 39, 73, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD007', 'Cushioned badminton shoes with excellent grip, cushioning, stability', 139.99, 39, 77, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D', 'Cushioned badminton shoes with Power Cushion, excellent comfort, grip', 169.99, 39, 65, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200A', 'Cushioned badminton shoes with excellent cushioning, stability, court grip', 149.99, 39, 71, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD008', 'Cushioned badminton shoes with excellent grip, cushioning, stability', 139.99, 39, 75, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 FT', 'Cushioned badminton shoes with Power Cushion, excellent comfort, grip', 159.99, 39, 69, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200B', 'Cushioned badminton shoes with excellent cushioning, stability, court grip', 149.99, 39, 72, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD009', 'Cushioned badminton shoes with excellent grip, cushioning, stability', 139.99, 39, 76, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 Z2', 'Cushioned badminton shoes with Power Cushion technology, excellent comfort', 139.99, 39, 74, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500A', 'Cushioned badminton shoes with excellent cushioning, grip, stability', 149.99, 39, 70, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD010', 'Cushioned badminton shoes with excellent grip, cushioning, stability', 129.99, 39, 78, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z2', 'Cushioned badminton shoes with Power Cushion, stability, excellent comfort', 149.99, 39, 71, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200C', 'Cushioned badminton shoes with excellent cushioning, stability, court grip', 139.99, 39, 73, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD011', 'Cushioned badminton shoes with excellent grip, cushioning, stability', 129.99, 39, 77, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D Pro', 'Cushioned badminton shoes with Power Cushion, excellent comfort, grip', 179.99, 39, 62, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500B', 'Cushioned badminton shoes with excellent cushioning, grip, stability', 149.99, 39, 68, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 40: Budget Badminton Shoes (subcategory_id: 8, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3', 'Affordable badminton shoes with Power Cushion technology, excellent grip', 149.99, 40, 90, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200', 'Affordable badminton shoes with excellent cushioning, stability, court grip', 139.99, 40, 95, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD006', 'Affordable badminton shoes with excellent grip, cushioning, stability', 129.99, 40, 100, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z3', 'Affordable badminton shoes with Power Cushion, stability, excellent grip', 159.99, 40, 88, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500', 'Affordable badminton shoes with excellent cushioning, grip, stability', 149.99, 40, 93, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD007', 'Affordable badminton shoes with excellent grip, cushioning, stability', 139.99, 40, 97, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D', 'Affordable badminton shoes with Power Cushion, excellent grip, stability', 169.99, 40, 85, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200A', 'Affordable badminton shoes with excellent cushioning, stability, court grip', 149.99, 40, 91, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD008', 'Affordable badminton shoes with excellent grip, cushioning, stability', 139.99, 40, 95, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 FT', 'Affordable badminton shoes with Power Cushion, excellent grip, lightweight', 159.99, 40, 89, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200B', 'Affordable badminton shoes with excellent cushioning, stability, court grip', 149.99, 40, 92, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD009', 'Affordable badminton shoes with excellent grip, cushioning, stability', 139.99, 40, 96, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 Z2', 'Affordable badminton shoes with Power Cushion technology, excellent grip', 139.99, 40, 94, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500A', 'Affordable badminton shoes with excellent cushioning, grip, stability', 149.99, 40, 90, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD010', 'Affordable badminton shoes with excellent grip, cushioning, stability', 129.99, 40, 98, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion Eclipsion Z2', 'Affordable badminton shoes with Power Cushion, stability, excellent grip', 149.99, 40, 91, NULL, NULL, NULL, NULL, FALSE),
('Victor P9200C', 'Affordable badminton shoes with excellent cushioning, stability, court grip', 139.99, 40, 93, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD011', 'Affordable badminton shoes with excellent grip, cushioning, stability', 129.99, 40, 97, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 88D Pro', 'Affordable badminton shoes with Power Cushion, excellent grip, stability', 179.99, 40, 82, NULL, NULL, NULL, NULL, FALSE),
('Victor P8500B', 'Affordable badminton shoes with excellent cushioning, grip, stability', 149.99, 40, 88, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 41: Badminton Shirts (subcategory_id: 9, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Badminton Shirt Pro', 'Professional badminton shirt with moisture-wicking fabric, breathable, comfortable fit', 39.99, 41, 150, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shirt Elite', 'Professional badminton shirt with moisture-wicking fabric, breathable, comfortable fit', 34.99, 41, 160, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shirt Pro', 'Professional badminton shirt with moisture-wicking fabric, breathable, comfortable fit', 29.99, 41, 170, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shirt Performance', 'Performance badminton shirt with moisture-wicking fabric, breathable, comfortable', 44.99, 41, 145, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shirt Performance', 'Performance badminton shirt with moisture-wicking fabric, breathable, comfortable', 39.99, 41, 155, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shirt Performance', 'Performance badminton shirt with moisture-wicking fabric, breathable, comfortable', 34.99, 41, 165, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shirt Training', 'Training badminton shirt with moisture-wicking fabric, breathable, comfortable', 24.99, 41, 180, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shirt Training', 'Training badminton shirt with moisture-wicking fabric, breathable, comfortable', 19.99, 41, 190, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shirt Training', 'Training badminton shirt with moisture-wicking fabric, breathable, comfortable', 14.99, 41, 200, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shirt Casual', 'Casual badminton shirt with comfortable fabric, breathable, relaxed fit', 29.99, 41, 175, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shirt Casual', 'Casual badminton shirt with comfortable fabric, breathable, relaxed fit', 24.99, 41, 185, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shirt Casual', 'Casual badminton shirt with comfortable fabric, breathable, relaxed fit', 19.99, 41, 195, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shirt Competition', 'Competition badminton shirt with moisture-wicking fabric, breathable, performance fit', 49.99, 41, 140, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shirt Competition', 'Competition badminton shirt with moisture-wicking fabric, breathable, performance fit', 44.99, 41, 150, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shirt Competition', 'Competition badminton shirt with moisture-wicking fabric, breathable, performance fit', 39.99, 41, 160, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shirt Premium', 'Premium badminton shirt with advanced moisture-wicking, breathable, premium fit', 54.99, 41, 135, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shirt Premium', 'Premium badminton shirt with advanced moisture-wicking, breathable, premium fit', 49.99, 41, 145, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shirt Premium', 'Premium badminton shirt with advanced moisture-wicking, breathable, premium fit', 44.99, 41, 155, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shirt Elite', 'Elite badminton shirt with ultimate moisture-wicking, breathable, elite fit', 59.99, 41, 130, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shirt Elite Pro', 'Elite badminton shirt with ultimate moisture-wicking, breathable, elite fit', 54.99, 41, 140, NULL, NULL, NULL, NULL, FALSE);

