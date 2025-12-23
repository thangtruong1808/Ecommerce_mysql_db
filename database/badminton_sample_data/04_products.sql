-- Badminton Stores Sample Data - Products
-- This file inserts 2-5 products per child category with at least one clearance product per child category
-- 
-- Execution Order: 4 (Depends on child_categories)
-- 
-- @author Thang Truong
-- @date 2025-01-17

USE ecommerce-mysql-db;

-- ============================================
-- PRODUCTS (2-5 per child category, at least 1 clearance per child category)
-- ============================================

-- ============================================
-- RACQUETS CATEGORY PRODUCTS
-- ============================================

-- Head-Heavy Professional Rackets (5 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Astrox 100 ZZ', 'Professional head-heavy racket with Z-Force technology. Stiff shaft, 4U weight, designed for powerful smashes and aggressive play. Used by top professional players worldwide.', 299.99, (SELECT id FROM child_categories WHERE name = 'Head-Heavy Professional Rackets'), 25, 4.8, 142, NULL, NULL, NULL, NULL, FALSE),
('Victor Thruster F Enhanced', 'Premium head-heavy racket with enhanced power system. Stiff flex, 3U weight, excellent for offensive players seeking maximum power.', 279.99, (SELECT id FROM child_categories WHERE name = 'Head-Heavy Professional Rackets'), 30, 4.7, 98, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Turbo Charging 75C', 'Professional head-heavy racket with turbo charging technology. Extra stiff shaft, 3U weight, designed for explosive power and control.', 269.99, (SELECT id FROM child_categories WHERE name = 'Head-Heavy Professional Rackets'), 20, 4.6, 76, NULL, NULL, NULL, NULL, FALSE),
('Babolat Satelite Gravity 74', 'Head-heavy racket with gravity technology for enhanced power. Stiff shaft, 4U weight, perfect for aggressive attacking style.', 259.99, (SELECT id FROM child_categories WHERE name = 'Head-Heavy Professional Rackets'), 35, 4.5, 89, NULL, NULL, NULL, NULL, FALSE),
('Yonex Astrox 88D Pro', 'Professional head-heavy racket with new grommet pattern. Stiff shaft, 4U weight, excellent for doubles play with powerful smashes.', 189.99, (SELECT id FROM child_categories WHERE name = 'Head-Heavy Professional Rackets'), 15, 4.4, 45, 'percentage', 45.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Even-Balance Professional Rackets (4 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Nanoflare 800', 'Professional even-balance racket with nanometric technology. Stiff shaft, 4U weight, perfect for all-round play with speed and control.', 289.99, (SELECT id FROM child_categories WHERE name = 'Even-Balance Professional Rackets'), 28, 4.7, 156, NULL, NULL, NULL, NULL, FALSE),
('Victor Auraspeed 100X', 'Premium even-balance racket with speed enhancement. Medium stiff shaft, 4U weight, excellent for fast-paced rallies.', 269.99, (SELECT id FROM child_categories WHERE name = 'Even-Balance Professional Rackets'), 32, 4.6, 112, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Windstorm 72', 'Professional even-balance racket with windstorm technology. Stiff shaft, 3U weight, designed for versatile playing style.', 249.99, (SELECT id FROM child_categories WHERE name = 'Even-Balance Professional Rackets'), 22, 4.5, 87, NULL, NULL, NULL, NULL, FALSE),
('Yonex Arcsaber 11 Pro', 'Professional even-balance racket with control-oriented design. Medium stiff shaft, 4U weight, perfect for precise shot placement.', 179.99, (SELECT id FROM child_categories WHERE name = 'Even-Balance Professional Rackets'), 18, 4.3, 54, 'percentage', 40.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Head-Light Professional Rackets (4 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Nanoflare 700', 'Professional head-light racket with exceptional speed. Stiff shaft, 4U weight, designed for quick reactions and fast play.', 279.99, (SELECT id FROM child_categories WHERE name = 'Head-Light Professional Rackets'), 26, 4.8, 134, NULL, NULL, NULL, NULL, FALSE),
('Victor Jetspeed S 12', 'Premium head-light racket with jet speed technology. Medium stiff shaft, 4U weight, excellent for defensive and counter-attacking play.', 259.99, (SELECT id FROM child_categories WHERE name = 'Head-Light Professional Rackets'), 30, 4.6, 98, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning N90 III', 'Professional head-light racket with speed enhancement. Stiff shaft, 3U weight, perfect for quick net play and fast drives.', 239.99, (SELECT id FROM child_categories WHERE name = 'Head-Light Professional Rackets'), 24, 4.5, 76, NULL, NULL, NULL, NULL, FALSE),
('Yonex Duora 10', 'Professional head-light racket with dual-sided technology. Medium stiff shaft, 4U weight, excellent for versatile play style.', 169.99, (SELECT id FROM child_categories WHERE name = 'Head-Light Professional Rackets'), 16, 4.2, 48, 'percentage', 42.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Stiff Professional Rackets (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Astrox 99 Pro', 'Professional stiff racket with maximum power transfer. Extra stiff shaft, 4U weight, designed for powerful smashes and precise control.', 299.99, (SELECT id FROM child_categories WHERE name = 'Stiff Professional Rackets'), 20, 4.9, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor Thruster K Enhanced', 'Premium stiff racket with enhanced control. Extra stiff shaft, 3U weight, excellent for professional players seeking precision.', 279.99, (SELECT id FROM child_categories WHERE name = 'Stiff Professional Rackets'), 25, 4.7, 125, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning N7 II', 'Professional stiff racket with power system. Extra stiff shaft, 4U weight, perfect for aggressive attacking play.', 199.99, (SELECT id FROM child_categories WHERE name = 'Stiff Professional Rackets'), 15, 4.4, 67, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Flexible Professional Rackets (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Arcsaber 7 Pro', 'Professional flexible racket with enhanced power generation. Flexible shaft, 4U weight, designed for comfortable play with good power.', 269.99, (SELECT id FROM child_categories WHERE name = 'Flexible Professional Rackets'), 22, 4.6, 98, NULL, NULL, NULL, NULL, FALSE),
('Victor Bravesword 12', 'Premium flexible racket with power enhancement. Medium flexible shaft, 4U weight, excellent for players seeking comfort and power.', 249.99, (SELECT id FROM child_categories WHERE name = 'Flexible Professional Rackets'), 28, 4.5, 87, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning N55 III', 'Professional flexible racket with balanced performance. Flexible shaft, 3U weight, perfect for all-round play style.', 179.99, (SELECT id FROM child_categories WHERE name = 'Flexible Professional Rackets'), 18, 4.3, 56, 'percentage', 38.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- All-Round Intermediate Rackets (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Arcsaber 11', 'Versatile intermediate racket suitable for all playing styles. Medium stiff shaft, 4U weight, excellent for developing players.', 149.99, (SELECT id FROM child_categories WHERE name = 'All-Round Intermediate Rackets'), 40, 4.6, 234, NULL, NULL, NULL, NULL, FALSE),
('Victor Jetspeed S 10', 'Intermediate racket with speed and control balance. Medium stiff shaft, 4U weight, perfect for intermediate players.', 129.99, (SELECT id FROM child_categories WHERE name = 'All-Round Intermediate Rackets'), 45, 4.5, 187, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Windstorm 500', 'Versatile intermediate racket with good all-round performance. Medium stiff shaft, 4U weight, excellent value for intermediate players.', 89.99, (SELECT id FROM child_categories WHERE name = 'All-Round Intermediate Rackets'), 35, 4.2, 98, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Power Intermediate Rackets (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Astrox 21', 'Intermediate racket with power-oriented design. Medium stiff shaft, 4U weight, excellent for players developing attacking skills.', 139.99, (SELECT id FROM child_categories WHERE name = 'Power Intermediate Rackets'), 38, 4.5, 156, NULL, NULL, NULL, NULL, FALSE),
('Victor Thruster F', 'Intermediate racket with enhanced power system. Medium stiff shaft, 4U weight, perfect for power-focused intermediate players.', 119.99, (SELECT id FROM child_categories WHERE name = 'Power Intermediate Rackets'), 42, 4.4, 134, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Turbo Charging 55', 'Intermediate racket with turbo charging technology. Medium stiff shaft, 4U weight, excellent for developing power game.', 79.99, (SELECT id FROM child_categories WHERE name = 'Power Intermediate Rackets'), 32, 4.1, 87, 'percentage', 28.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Control Intermediate Rackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Arcsaber 71', 'Intermediate racket focused on control and precision. Medium stiff shaft, 4U weight, perfect for developing accurate shot placement.', 129.99, (SELECT id FROM child_categories WHERE name = 'Control Intermediate Rackets'), 36, 4.4, 145, NULL, NULL, NULL, NULL, FALSE),
('Victor Bravesword 10', 'Intermediate racket with control-oriented design. Medium stiff shaft, 4U weight, excellent for precision-focused players.', 69.99, (SELECT id FROM child_categories WHERE name = 'Control Intermediate Rackets'), 30, 4.0, 76, 'percentage', 32.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Speed Intermediate Rackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Nanoflare 270', 'Intermediate racket optimized for speed and quick reactions. Medium stiff shaft, 4U weight, perfect for fast-paced play.', 119.99, (SELECT id FROM child_categories WHERE name = 'Speed Intermediate Rackets'), 40, 4.3, 123, NULL, NULL, NULL, NULL, FALSE),
('Victor Jetspeed S 8', 'Intermediate racket with speed enhancement. Medium stiff shaft, 4U weight, excellent for developing quick game style.', 69.99, (SELECT id FROM child_categories WHERE name = 'Speed Intermediate Rackets'), 35, 4.1, 89, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Pre-Strung Beginner Rackets (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Nanoray 10F', 'Beginner racket pre-strung and ready to use. Flexible shaft, 4U weight, perfect for new players starting their badminton journey.', 49.99, (SELECT id FROM child_categories WHERE name = 'Pre-Strung Beginner Rackets'), 60, 4.2, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor Brave Sword 5', 'Beginner racket with factory stringing. Flexible shaft, 4U weight, excellent for casual players and beginners.', 39.99, (SELECT id FROM child_categories WHERE name = 'Pre-Strung Beginner Rackets'), 65, 4.1, 167, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Windstorm 300', 'Beginner racket pre-strung with good balance. Flexible shaft, 4U weight, perfect for entry-level players.', 29.99, (SELECT id FROM child_categories WHERE name = 'Pre-Strung Beginner Rackets'), 55, 3.9, 134, 'percentage', 25.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Beginner Racket Sets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Beginner Set', 'Complete beginner set including racket, shuttlecocks, and basic accessories. Everything needed to start playing badminton.', 59.99, (SELECT id FROM child_categories WHERE name = 'Beginner Racket Sets'), 50, 4.3, 245, NULL, NULL, NULL, NULL, FALSE),
('Victor Starter Set', 'Beginner starter set with racket, shuttlecocks, and grip tape. Perfect package for new badminton players.', 34.99, (SELECT id FROM child_categories WHERE name = 'Beginner Racket Sets'), 45, 4.0, 178, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Junior Beginner Rackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Junior Racket', 'Lightweight junior racket designed for children. Flexible shaft, 5U weight, perfect for young players learning badminton.', 34.99, (SELECT id FROM child_categories WHERE name = 'Junior Beginner Rackets'), 55, 4.4, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor Kids Racket', 'Junior racket with smaller grip and lighter weight. Flexible shaft, 5U weight, excellent for children starting badminton.', 24.99, (SELECT id FROM child_categories WHERE name = 'Junior Beginner Rackets'), 50, 4.1, 145, 'percentage', 28.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Ultra-Light Rackets (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Nanoflare 8000', 'Ultra-lightweight racket under 75g for maximum speed. Stiff shaft, 5U weight, designed for lightning-fast play.', 249.99, (SELECT id FROM child_categories WHERE name = 'Ultra-Light Rackets'), 20, 4.7, 112, NULL, NULL, NULL, NULL, FALSE),
('Victor Jetspeed S 12F', 'Ultra-light racket with exceptional maneuverability. Medium stiff shaft, 5U weight, perfect for quick reactions.', 229.99, (SELECT id FROM child_categories WHERE name = 'Ultra-Light Rackets'), 25, 4.6, 98, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Windstorm 72F', 'Ultra-light racket with speed enhancement. Stiff shaft, 5U weight, excellent for fast-paced defensive play.', 149.99, (SELECT id FROM child_categories WHERE name = 'Ultra-Light Rackets'), 18, 4.3, 67, 'percentage', 40.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Lightweight Power Rackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Astrox 88S', 'Lightweight racket with power-oriented design. Stiff shaft, 4U weight, excellent for fast and powerful play.', 219.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Power Rackets'), 22, 4.5, 134, NULL, NULL, NULL, NULL, FALSE),
('Victor Thruster F Enhanced Light', 'Lightweight racket with enhanced power system. Medium stiff shaft, 4U weight, perfect for quick power shots.', 129.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Power Rackets'), 20, 4.2, 89, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Lightweight Control Rackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Arcsaber 11 Light', 'Lightweight racket focused on precision and control. Medium stiff shaft, 4U weight, excellent for accurate shot placement.', 199.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Control Rackets'), 24, 4.4, 112, NULL, NULL, NULL, NULL, FALSE),
('Victor Bravesword 12 Light', 'Lightweight racket with control-oriented design. Medium stiff shaft, 4U weight, perfect for precise play.', 119.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Control Rackets'), 18, 4.1, 76, 'percentage', 33.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Lightweight All-Round Rackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Nanoflare 270 Light', 'Lightweight versatile racket suitable for all playing styles. Medium stiff shaft, 4U weight, excellent for developing players.', 179.99, (SELECT id FROM child_categories WHERE name = 'Lightweight All-Round Rackets'), 26, 4.3, 98, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Windstorm 500 Light', 'Lightweight all-round racket with good balance. Medium stiff shaft, 4U weight, perfect for versatile play style.', 99.99, (SELECT id FROM child_categories WHERE name = 'Lightweight All-Round Rackets'), 22, 4.0, 67, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Head-Heavy Power Rackets (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Astrox 100', 'Heavy head-heavy racket with maximum smashing power. Stiff shaft, 3U weight, designed for aggressive attacking play.', 279.99, (SELECT id FROM child_categories WHERE name = 'Head-Heavy Power Rackets'), 18, 4.8, 156, NULL, NULL, NULL, NULL, FALSE),
('Victor Thruster K', 'Heavy head-heavy racket with enhanced power. Stiff shaft, 3U weight, excellent for powerful smashes and drives.', 259.99, (SELECT id FROM child_categories WHERE name = 'Head-Heavy Power Rackets'), 20, 4.6, 134, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Turbo Charging 75', 'Heavy head-heavy racket with turbo charging technology. Stiff shaft, 3U weight, perfect for maximum power generation.', 179.99, (SELECT id FROM child_categories WHERE name = 'Head-Heavy Power Rackets'), 16, 4.4, 89, 'percentage', 40.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Heavy Stiff Rackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Astrox 99', 'Heavy stiff racket with precise power transfer. Extra stiff shaft, 3U weight, excellent for powerful and accurate shots.', 269.99, (SELECT id FROM child_categories WHERE name = 'Heavy Stiff Rackets'), 15, 4.7, 123, NULL, NULL, NULL, NULL, FALSE),
('Victor Thruster K Enhanced Heavy', 'Heavy stiff racket with enhanced control. Extra stiff shaft, 3U weight, perfect for professional power play.', 159.99, (SELECT id FROM child_categories WHERE name = 'Heavy Stiff Rackets'), 12, 4.3, 78, 'percentage', 38.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Heavy Flexible Rackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Arcsaber 11 Heavy', 'Heavy flexible racket with enhanced power generation. Flexible shaft, 3U weight, excellent for comfortable power play.', 239.99, (SELECT id FROM child_categories WHERE name = 'Heavy Flexible Rackets'), 17, 4.5, 98, NULL, NULL, NULL, NULL, FALSE),
('Victor Bravesword 12 Heavy', 'Heavy flexible racket with power enhancement. Medium flexible shaft, 3U weight, perfect for players seeking comfort and power.', 139.99, (SELECT id FROM child_categories WHERE name = 'Heavy Flexible Rackets'), 14, 4.2, 67, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Extra-Heavy Rackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Astrox 100 Extra Heavy', 'Ultra-heavy racket for maximum power and stability. Stiff shaft, 2U weight, designed for players who prefer maximum power.', 289.99, (SELECT id FROM child_categories WHERE name = 'Extra-Heavy Rackets'), 10, 4.6, 89, NULL, NULL, NULL, NULL, FALSE),
('Victor Thruster F Extra Heavy', 'Ultra-heavy racket with enhanced power system. Stiff shaft, 2U weight, excellent for powerful attacking play.', 169.99, (SELECT id FROM child_categories WHERE name = 'Extra-Heavy Rackets'), 8, 4.3, 56, 'percentage', 42.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Professional Stringing (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Professional Stringing Service', 'Expert stringing service with precision tension control. Includes premium strings and professional stringing by certified technicians.', 35.00, (SELECT id FROM child_categories WHERE name = 'Professional Stringing'), 100, 4.8, 234, NULL, NULL, NULL, NULL, FALSE),
('Express Professional Stringing', 'Fast professional stringing service with quality results. Premium strings included, completed within 24 hours.', 24.99, (SELECT id FROM child_categories WHERE name = 'Professional Stringing'), 100, 4.5, 167, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Standard Stringing (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Standard Stringing Service', 'Reliable stringing service with standard tension control. Includes quality strings and professional stringing.', 25.00, (SELECT id FROM child_categories WHERE name = 'Standard Stringing'), 100, 4.6, 198, NULL, NULL, NULL, NULL, FALSE),
('Basic Stringing Service', 'Standard stringing service with durable strings. Good value for regular players.', 14.99, (SELECT id FROM child_categories WHERE name = 'Standard Stringing'), 100, 4.3, 145, 'percentage', 25.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Express Stringing (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Express Stringing Service', 'Fast stringing service for urgent needs. Quality strings included, completed within 12 hours.', 30.00, (SELECT id FROM child_categories WHERE name = 'Express Stringing'), 100, 4.7, 178, NULL, NULL, NULL, NULL, FALSE),
('Rush Stringing Service', 'Ultra-fast stringing service for immediate needs. Premium strings, completed within 6 hours.', 19.99, (SELECT id FROM child_categories WHERE name = 'Express Stringing'), 100, 4.4, 123, 'percentage', 33.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Racket Covers (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Racket Cover', 'Premium racket cover with padding protection. Fits most rackets, excellent for transport and storage.', 24.99, (SELECT id FROM child_categories WHERE name = 'Racket Covers'), 80, 4.5, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor Racket Cover', 'Durable racket cover with reinforced corners. Protects racket from scratches and impacts.', 19.99, (SELECT id FROM child_categories WHERE name = 'Racket Covers'), 85, 4.4, 167, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Racket Cover', 'Quality racket cover with zipper closure. Lightweight and protective design.', 12.99, (SELECT id FROM child_categories WHERE name = 'Racket Covers'), 75, 4.2, 134, 'percentage', 28.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Racket Maintenance Kits (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Complete Racket Maintenance Kit', 'Complete maintenance kit including cleaning supplies, grip tape, and protective accessories. Everything to keep your racket in perfect condition.', 34.99, (SELECT id FROM child_categories WHERE name = 'Racket Maintenance Kits'), 60, 4.6, 189, NULL, NULL, NULL, NULL, FALSE),
('Basic Racket Care Kit', 'Essential maintenance kit with cleaning cloth and basic care supplies. Good value for regular racket maintenance.', 19.99, (SELECT id FROM child_categories WHERE name = 'Racket Maintenance Kits'), 70, 4.3, 145, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Racket Protection (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Racket Bumper Guard Set', 'Protective bumper guards to prevent frame damage. Easy to install, protects racket during play.', 14.99, (SELECT id FROM child_categories WHERE name = 'Racket Protection'), 90, 4.4, 178, NULL, NULL, NULL, NULL, FALSE),
('Frame Protection Tape', 'Protective tape for racket frame edges. Prevents scratches and extends racket lifespan.', 7.99, (SELECT id FROM child_categories WHERE name = 'Racket Protection'), 95, 4.1, 123, 'percentage', 25.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- ============================================
-- BAGS CATEGORY PRODUCTS
-- ============================================

-- Single Racket Bags (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Single Racket Bag', 'Compact single racket bag with shoulder strap. Lightweight design, perfect for quick trips to the court.', 29.99, (SELECT id FROM child_categories WHERE name = 'Single Racket Bags'), 70, 4.5, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor Single Racket Bag', 'Durable single racket bag with padded protection. Comfortable shoulder strap and zipper closure.', 24.99, (SELECT id FROM child_categories WHERE name = 'Single Racket Bags'), 75, 4.4, 167, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Single Racket Bag', 'Quality single racket bag with side pocket. Lightweight and functional design.', 16.99, (SELECT id FROM child_categories WHERE name = 'Single Racket Bags'), 65, 4.2, 134, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Double Racket Bags (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Double Racket Bag', 'Spacious double racket bag with multiple compartments. Shoulder strap and handles, perfect for two rackets.', 39.99, (SELECT id FROM child_categories WHERE name = 'Double Racket Bags'), 65, 4.6, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor Double Racket Bag', 'Durable double racket bag with padded dividers. Additional storage pockets for accessories.', 34.99, (SELECT id FROM child_categories WHERE name = 'Double Racket Bags'), 70, 4.5, 156, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Double Racket Bag', 'Quality double racket bag with side pockets. Comfortable carrying options.', 24.99, (SELECT id FROM child_categories WHERE name = 'Double Racket Bags'), 60, 4.3, 123, 'percentage', 28.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Multi-Racket Bags (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Multi-Racket Bag', 'Large multi-racket bag for 3-6 rackets. Multiple compartments and storage pockets for all equipment.', 69.99, (SELECT id FROM child_categories WHERE name = 'Multi-Racket Bags'), 50, 4.7, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor Multi-Racket Bag', 'Spacious multi-racket bag with organized compartments. Perfect for serious players with multiple rackets.', 59.99, (SELECT id FROM child_categories WHERE name = 'Multi-Racket Bags'), 55, 4.6, 145, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Multi-Racket Bag', 'Quality multi-racket bag with good organization. Excellent value for players with multiple rackets.', 44.99, (SELECT id FROM child_categories WHERE name = 'Multi-Racket Bags'), 45, 4.4, 112, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Premium Racket Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Premium Racket Bag', 'High-end premium racket bag with advanced features. Premium materials and maximum protection.', 99.99, (SELECT id FROM child_categories WHERE name = 'Premium Racket Bags'), 40, 4.8, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor Professional Racket Bag', 'Professional-grade racket bag with premium construction. Maximum capacity and protection.', 69.99, (SELECT id FROM child_categories WHERE name = 'Premium Racket Bags'), 35, 4.6, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Standard Shoe Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Shoe Bag', 'Standard shoe bag for badminton shoes. Keeps shoes separate and protected from other equipment.', 19.99, (SELECT id FROM child_categories WHERE name = 'Standard Shoe Bags'), 80, 4.4, 167, NULL, NULL, NULL, NULL, FALSE),
('Victor Shoe Bag', 'Durable shoe bag with ventilation. Prevents odor and keeps shoes fresh.', 14.99, (SELECT id FROM child_categories WHERE name = 'Standard Shoe Bags'), 85, 4.3, 145, 'percentage', 25.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Ventilated Shoe Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Ventilated Shoe Bag', 'Shoe bag with ventilation features. Mesh panels allow air circulation to keep shoes dry and fresh.', 24.99, (SELECT id FROM child_categories WHERE name = 'Ventilated Shoe Bags'), 70, 4.5, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor Airflow Shoe Bag', 'Ventilated shoe bag with advanced airflow system. Keeps shoes fresh and prevents moisture buildup.', 17.99, (SELECT id FROM child_categories WHERE name = 'Ventilated Shoe Bags'), 75, 4.3, 134, 'percentage', 28.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Premium Shoe Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Premium Shoe Bag', 'High-quality shoe bag with premium materials. Enhanced ventilation and protection features.', 34.99, (SELECT id FROM child_categories WHERE name = 'Premium Shoe Bags'), 60, 4.6, 145, NULL, NULL, NULL, NULL, FALSE),
('Victor Professional Shoe Bag', 'Professional-grade shoe bag with superior ventilation. Premium construction and materials.', 24.99, (SELECT id FROM child_categories WHERE name = 'Premium Shoe Bags'), 55, 4.4, 112, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Standard Backpacks (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Badminton Backpack', 'Versatile badminton backpack with multiple compartments. Perfect for carrying rackets, shoes, and accessories.', 59.99, (SELECT id FROM child_categories WHERE name = 'Standard Backpacks'), 55, 4.6, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor Sports Backpack', 'Durable sports backpack with organized storage. Comfortable straps and multiple pockets.', 49.99, (SELECT id FROM child_categories WHERE name = 'Standard Backpacks'), 60, 4.5, 167, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Training Backpack', 'Quality training backpack with good organization. Excellent value for regular players.', 39.99, (SELECT id FROM child_categories WHERE name = 'Standard Backpacks'), 50, 4.3, 134, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Large Capacity Backpacks (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Large Capacity Backpack', 'Spacious backpack designed for multiple rackets and equipment. Maximum storage capacity for serious players.', 89.99, (SELECT id FROM child_categories WHERE name = 'Large Capacity Backpacks'), 45, 4.7, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor Pro Backpack', 'Large capacity backpack with advanced organization. Perfect for players with extensive equipment.', 79.99, (SELECT id FROM child_categories WHERE name = 'Large Capacity Backpacks'), 50, 4.6, 145, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Tournament Backpack', 'Large tournament backpack with excellent organization. Great value for competitive players.', 64.99, (SELECT id FROM child_categories WHERE name = 'Large Capacity Backpacks'), 40, 4.4, 112, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Professional Backpacks (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Professional Backpack', 'High-end professional backpack with advanced features. Premium materials and maximum organization.', 129.99, (SELECT id FROM child_categories WHERE name = 'Professional Backpacks'), 35, 4.8, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor Elite Backpack', 'Elite-level professional backpack with premium construction. Maximum capacity and protection.', 99.99, (SELECT id FROM child_categories WHERE name = 'Professional Backpacks'), 30, 4.7, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Tournament Backpacks (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Tournament Backpack', 'Tournament-grade backpack with maximum capacity. Designed for competitive players and tournaments.', 149.99, (SELECT id FROM child_categories WHERE name = 'Tournament Backpacks'), 25, 4.9, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor Championship Backpack', 'Championship-level backpack with premium features. Perfect for tournament play and travel.', 104.99, (SELECT id FROM child_categories WHERE name = 'Tournament Backpacks'), 20, 4.7, 134, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Standard Duffel Bags (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Duffel Bag', 'Classic duffel bag with spacious main compartment. Perfect for carrying all badminton gear.', 49.99, (SELECT id FROM child_categories WHERE name = 'Standard Duffel Bags'), 60, 4.5, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor Sports Duffel', 'Durable sports duffel bag with good capacity. Comfortable handles and shoulder strap.', 44.99, (SELECT id FROM child_categories WHERE name = 'Standard Duffel Bags'), 65, 4.4, 156, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Training Duffel', 'Quality training duffel bag with functional design. Excellent value for regular use.', 34.99, (SELECT id FROM child_categories WHERE name = 'Standard Duffel Bags'), 55, 4.3, 123, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Multi-Compartment Duffel Bags (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Multi-Compartment Duffel', 'Duffel bag with multiple organized compartments. Better gear organization and easy access.', 69.99, (SELECT id FROM child_categories WHERE name = 'Multi-Compartment Duffel Bags'), 50, 4.6, 167, NULL, NULL, NULL, NULL, FALSE),
('Victor Organized Duffel', 'Multi-compartment duffel with excellent organization. Perfect for players with extensive equipment.', 59.99, (SELECT id FROM child_categories WHERE name = 'Multi-Compartment Duffel Bags'), 55, 4.5, 145, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Compartment Duffel', 'Quality multi-compartment duffel with good organization. Great value for organized players.', 49.99, (SELECT id FROM child_categories WHERE name = 'Multi-Compartment Duffel Bags'), 45, 4.4, 112, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Wheeled Duffel Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Wheeled Duffel', 'Duffel bag with wheels for easy transportation. Perfect for heavy equipment and travel.', 89.99, (SELECT id FROM child_categories WHERE name = 'Wheeled Duffel Bags'), 40, 4.7, 145, NULL, NULL, NULL, NULL, FALSE),
('Victor Rolling Duffel', 'Wheeled duffel bag with retractable handle. Easy to transport heavy badminton equipment.', 69.99, (SELECT id FROM child_categories WHERE name = 'Wheeled Duffel Bags'), 35, 4.5, 112, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Premium Duffel Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Premium Duffel', 'High-end premium duffel bag with advanced features. Premium materials and maximum capacity.', 119.99, (SELECT id FROM child_categories WHERE name = 'Premium Duffel Bags'), 30, 4.8, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor Professional Duffel', 'Professional-grade duffel bag with premium construction. Maximum protection and organization.', 89.99, (SELECT id FROM child_categories WHERE name = 'Premium Duffel Bags'), 25, 4.6, 134, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Racket Travel Cases (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Hard-Shell Travel Case', 'Hard-shell travel case designed to protect rackets during air travel. Maximum protection for valuable rackets.', 149.99, (SELECT id FROM child_categories WHERE name = 'Racket Travel Cases'), 25, 4.8, 167, NULL, NULL, NULL, NULL, FALSE),
('Victor Protective Travel Case', 'Protective travel case with hard-shell construction. Perfect for protecting rackets during long journeys.', 104.99, (SELECT id FROM child_categories WHERE name = 'Racket Travel Cases'), 20, 4.6, 123, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Equipment Travel Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Equipment Travel Bag', 'Large travel bag for transporting complete badminton equipment sets. Maximum capacity for all gear.', 129.99, (SELECT id FROM child_categories WHERE name = 'Equipment Travel Bags'), 30, 4.7, 145, NULL, NULL, NULL, NULL, FALSE),
('Victor Complete Travel Bag', 'Complete travel bag with excellent organization. Perfect for transporting all badminton equipment.', 94.99, (SELECT id FROM child_categories WHERE name = 'Equipment Travel Bags'), 25, 4.5, 112, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Tournament Travel Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Tournament Travel Bag', 'Professional travel bag designed for tournament players. Maximum protection and capacity.', 179.99, (SELECT id FROM child_categories WHERE name = 'Tournament Travel Bags'), 20, 4.9, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor Pro Travel Bag', 'Professional tournament travel bag with premium features. Perfect for competitive players.', 129.99, (SELECT id FROM child_categories WHERE name = 'Tournament Travel Bags'), 15, 4.7, 134, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Standard Drawstring Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Drawstring Bag', 'Simple drawstring bag for quick trips to the court. Lightweight and convenient storage solution.', 14.99, (SELECT id FROM child_categories WHERE name = 'Standard Drawstring Bags'), 90, 4.3, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor Drawstring Bag', 'Durable drawstring bag with good quality. Perfect for casual players and quick sessions.', 9.99, (SELECT id FROM child_categories WHERE name = 'Standard Drawstring Bags'), 95, 4.1, 167, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Premium Drawstring Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Premium Drawstring', 'High-quality drawstring bag with better materials. Enhanced durability and design.', 24.99, (SELECT id FROM child_categories WHERE name = 'Premium Drawstring Bags'), 70, 4.5, 145, NULL, NULL, NULL, NULL, FALSE),
('Victor Quality Drawstring', 'Premium drawstring bag with superior construction. Better materials and durability.', 17.99, (SELECT id FROM child_categories WHERE name = 'Premium Drawstring Bags'), 75, 4.3, 112, 'percentage', 28.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Branded Drawstring Bags (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Branded Drawstring', 'Drawstring bag featuring Yonex brand logo and design. Stylish and functional.', 19.99, (SELECT id FROM child_categories WHERE name = 'Branded Drawstring Bags'), 80, 4.4, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor Logo Drawstring', 'Drawstring bag with Victor brand logo. Perfect for brand enthusiasts.', 13.99, (SELECT id FROM child_categories WHERE name = 'Branded Drawstring Bags'), 85, 4.2, 134, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- ============================================
-- SHOES CATEGORY PRODUCTS
-- ============================================

-- Professional Court Shoes (4 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3', 'Professional court shoes with Power Cushion technology. Excellent grip, stability, and cushioning for competitive play.', 179.99, (SELECT id FROM child_categories WHERE name = 'Professional Court Shoes'), 40, 4.8, 234, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200', 'Professional court shoes with advanced cushioning system. Superior grip and support for professional players.', 169.99, (SELECT id FROM child_categories WHERE name = 'Professional Court Shoes'), 45, 4.7, 198, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD005', 'Professional court shoes with excellent court feel. Advanced technology for optimal performance.', 159.99, (SELECT id FROM child_categories WHERE name = 'Professional Court Shoes'), 38, 4.6, 167, NULL, NULL, NULL, NULL, FALSE),
('Yonex Power Cushion 65 Z2', 'Previous generation professional court shoes. Still excellent performance with Power Cushion technology.', 119.99, (SELECT id FROM child_categories WHERE name = 'Professional Court Shoes'), 30, 4.5, 145, 'percentage', 40.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Professional Speed Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Aerus Z', 'Professional speed shoes optimized for quick movements. Lightweight design with excellent grip.', 189.99, (SELECT id FROM child_categories WHERE name = 'Professional Speed Shoes'), 35, 4.7, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-A920', 'Professional speed shoes with enhanced agility. Perfect for fast-paced defensive play.', 179.99, (SELECT id FROM child_categories WHERE name = 'Professional Speed Shoes'), 40, 4.6, 156, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD006', 'Professional speed shoes with lightweight construction. Excellent for quick reactions and movements.', 134.99, (SELECT id FROM child_categories WHERE name = 'Professional Speed Shoes'), 28, 4.4, 123, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Professional Power Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 Power', 'Professional power shoes designed for explosive movements. Enhanced support for powerful jumps and smashes.', 179.99, (SELECT id FROM child_categories WHERE name = 'Professional Power Shoes'), 32, 4.7, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Power', 'Professional power shoes with maximum support. Perfect for aggressive attacking play style.', 169.99, (SELECT id FROM child_categories WHERE name = 'Professional Power Shoes'), 36, 4.6, 145, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD007', 'Professional power shoes with enhanced stability. Excellent for powerful movements and jumps.', 124.99, (SELECT id FROM child_categories WHERE name = 'Professional Power Shoes'), 25, 4.3, 98, 'percentage', 38.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Professional Control Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 Control', 'Professional control shoes focused on stability and precision. Excellent for accurate footwork and control.', 179.99, (SELECT id FROM child_categories WHERE name = 'Professional Control Shoes'), 34, 4.6, 167, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Control', 'Professional control shoes with enhanced stability. Perfect for precise movements and control.', 169.99, (SELECT id FROM child_categories WHERE name = 'Professional Control Shoes'), 38, 4.5, 134, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD008', 'Professional control shoes with stability focus. Excellent for control-oriented play style.', 119.99, (SELECT id FROM child_categories WHERE name = 'Professional Control Shoes'), 27, 4.2, 112, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Professional All-Round Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 All-Round', 'Versatile professional shoes suitable for all playing styles. Balanced performance and comfort.', 179.99, (SELECT id FROM child_categories WHERE name = 'Professional All-Round Shoes'), 42, 4.7, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-A920 All-Round', 'Professional all-round shoes with versatile performance. Perfect for players with varied playing style.', 169.99, (SELECT id FROM child_categories WHERE name = 'Professional All-Round Shoes'), 45, 4.6, 178, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD009', 'Professional all-round shoes with balanced features. Excellent value for versatile players.', 124.99, (SELECT id FROM child_categories WHERE name = 'Professional All-Round Shoes'), 30, 4.4, 145, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Non-Marking Court Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 Non-Marking', 'Professional non-marking court shoes. Perfect for indoor facilities with Power Cushion technology.', 179.99, (SELECT id FROM child_categories WHERE name = 'Non-Marking Court Shoes'), 50, 4.7, 223, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Non-Marking', 'Professional non-marking shoes with excellent grip. Perfect for indoor badminton courts.', 169.99, (SELECT id FROM child_categories WHERE name = 'Non-Marking Court Shoes'), 55, 4.6, 198, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD010', 'Professional non-marking court shoes with good performance. Excellent value for indoor play.', 119.99, (SELECT id FROM child_categories WHERE name = 'Non-Marking Court Shoes'), 40, 4.4, 156, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- High-Grip Court Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 High-Grip', 'Professional court shoes with superior grip technology. Excellent traction on court surfaces.', 179.99, (SELECT id FROM child_categories WHERE name = 'High-Grip Court Shoes'), 38, 4.8, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 High-Grip', 'Professional high-grip shoes with advanced sole technology. Perfect for maximum traction.', 169.99, (SELECT id FROM child_categories WHERE name = 'High-Grip Court Shoes'), 42, 4.7, 178, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD011', 'Professional high-grip court shoes with excellent traction. Great for players who need superior grip.', 124.99, (SELECT id FROM child_categories WHERE name = 'High-Grip Court Shoes'), 32, 4.5, 134, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Cushioned Court Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 Cushioned', 'Professional court shoes with maximum cushioning. Excellent impact protection and comfort.', 179.99, (SELECT id FROM child_categories WHERE name = 'Cushioned Court Shoes'), 36, 4.7, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Cushioned', 'Professional cushioned shoes with advanced cushioning system. Perfect for players with foot sensitivity.', 169.99, (SELECT id FROM child_categories WHERE name = 'Cushioned Court Shoes'), 40, 4.6, 167, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD012', 'Professional cushioned court shoes with extra padding. Excellent comfort for long matches.', 119.99, (SELECT id FROM child_categories WHERE name = 'Cushioned Court Shoes'), 30, 4.4, 123, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Lightweight Court Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Aerus Z Light', 'Ultra-lightweight court shoes for maximum agility. Minimal weight without compromising support.', 189.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Court Shoes'), 33, 4.8, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-A920 Light', 'Lightweight court shoes with speed enhancement. Perfect for quick movements and reactions.', 179.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Court Shoes'), 37, 4.7, 178, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD013', 'Lightweight court shoes with good performance. Excellent value for speed-focused players.', 129.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Court Shoes'), 28, 4.5, 145, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Ultra-Light Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Aerus Z Ultra-Light', 'Extremely lightweight shoes under 250g. Maximum speed and agility for fast play.', 199.99, (SELECT id FROM child_categories WHERE name = 'Ultra-Light Shoes'), 25, 4.8, 167, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-A920 Ultra-Light', 'Ultra-lightweight shoes with minimal weight. Perfect for players seeking maximum speed.', 189.99, (SELECT id FROM child_categories WHERE name = 'Ultra-Light Shoes'), 28, 4.7, 145, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD014', 'Ultra-lightweight shoes with excellent performance. Great value for speed-focused players.', 139.99, (SELECT id FROM child_categories WHERE name = 'Ultra-Light Shoes'), 22, 4.5, 112, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Lightweight Speed Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Aerus Z Speed', 'Lightweight speed shoes optimized for quick reactions. Excellent for fast-paced play.', 189.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Speed Shoes'), 30, 4.7, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-A920 Speed', 'Lightweight speed shoes with enhanced agility. Perfect for developing quick game style.', 134.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Speed Shoes'), 26, 4.5, 134, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Lightweight Training Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z2 Training', 'Lightweight training shoes designed for practice sessions. Durable and comfortable for regular use.', 149.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Training Shoes'), 35, 4.6, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9100 Training', 'Lightweight training shoes with good durability. Perfect for frequent practice sessions.', 104.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Training Shoes'), 32, 4.4, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Lightweight Competition Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Aerus Z Competition', 'Lightweight competition shoes with premium features. Perfect for tournament play.', 189.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Competition Shoes'), 28, 4.8, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-A920 Competition', 'Lightweight competition shoes with advanced technology. Excellent for competitive players.', 134.99, (SELECT id FROM child_categories WHERE name = 'Lightweight Competition Shoes'), 24, 4.6, 167, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Maximum Cushioning Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 Max', 'Maximum cushioning shoes with superior impact protection. Perfect for players with foot sensitivity.', 179.99, (SELECT id FROM child_categories WHERE name = 'Maximum Cushioning Shoes'), 34, 4.7, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Max Cushion', 'Maximum cushioning shoes with advanced padding. Excellent comfort for long matches.', 169.99, (SELECT id FROM child_categories WHERE name = 'Maximum Cushioning Shoes'), 38, 4.6, 178, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD015', 'Maximum cushioning shoes with extra padding. Great value for comfort-focused players.', 124.99, (SELECT id FROM child_categories WHERE name = 'Maximum Cushioning Shoes'), 29, 4.4, 145, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Gel Cushioning Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion Gel', 'Shoes featuring gel cushioning technology. Enhanced comfort and impact protection.', 169.99, (SELECT id FROM child_categories WHERE name = 'Gel Cushioning Shoes'), 32, 4.6, 167, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Gel', 'Gel cushioning shoes with advanced comfort features. Perfect for players seeking superior comfort.', 119.99, (SELECT id FROM child_categories WHERE name = 'Gel Cushioning Shoes'), 27, 4.3, 123, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Air Cushioning Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion Air', 'Shoes with air cushioning systems for responsive comfort. Excellent support and cushioning.', 169.99, (SELECT id FROM child_categories WHERE name = 'Air Cushioning Shoes'), 30, 4.6, 156, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Air', 'Air cushioning shoes with responsive support. Perfect for players who need responsive comfort.', 119.99, (SELECT id FROM child_categories WHERE name = 'Air Cushioning Shoes'), 25, 4.3, 112, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Memory Foam Cushioning Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion Memory', 'Shoes with memory foam cushioning for personalized comfort. Adapts to your foot shape.', 169.99, (SELECT id FROM child_categories WHERE name = 'Memory Foam Cushioning Shoes'), 28, 4.6, 145, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Memory', 'Memory foam cushioning shoes with adaptive comfort. Excellent for personalized fit and comfort.', 119.99, (SELECT id FROM child_categories WHERE name = 'Memory Foam Cushioning Shoes'), 23, 4.3, 98, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Entry-Level Budget Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z2 Budget', 'Affordable entry-level shoes with essential features. Good value for casual players.', 79.99, (SELECT id FROM child_categories WHERE name = 'Entry-Level Budget Shoes'), 60, 4.3, 234, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9100 Budget', 'Budget-friendly shoes with reliable performance. Perfect for beginners and casual players.', 69.99, (SELECT id FROM child_categories WHERE name = 'Entry-Level Budget Shoes'), 65, 4.2, 198, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD016', 'Entry-level budget shoes with good value. Excellent for new players starting badminton.', 49.99, (SELECT id FROM child_categories WHERE name = 'Entry-Level Budget Shoes'), 55, 4.0, 167, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Value Budget Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z1', 'Value budget shoes offering good performance. Reliable quality at affordable price.', 89.99, (SELECT id FROM child_categories WHERE name = 'Value Budget Shoes'), 58, 4.4, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9000 Value', 'Value budget shoes with good features. Excellent value for regular players.', 62.99, (SELECT id FROM child_categories WHERE name = 'Value Budget Shoes'), 52, 4.1, 178, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Economy Budget Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Basic Court Shoes', 'Economical shoes for beginners. Essential features at accessible price point.', 59.99, (SELECT id FROM child_categories WHERE name = 'Economy Budget Shoes'), 70, 4.1, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor Starter Shoes', 'Economy shoes perfect for recreational players. Good value for casual badminton.', 41.99, (SELECT id FROM child_categories WHERE name = 'Economy Budget Shoes'), 65, 3.9, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Durable Training Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z2 Training Pro', 'Durable training shoes built to withstand frequent practice. Excellent for regular training sessions.', 149.99, (SELECT id FROM child_categories WHERE name = 'Durable Training Shoes'), 45, 4.6, 223, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9100 Training Pro', 'Durable training shoes with reinforced construction. Perfect for intensive training programs.', 139.99, (SELECT id FROM child_categories WHERE name = 'Durable Training Shoes'), 50, 4.5, 198, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD017', 'Durable training shoes with good longevity. Great value for frequent training.', 104.99, (SELECT id FROM child_categories WHERE name = 'Durable Training Shoes'), 38, 4.3, 167, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Comfortable Training Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z2 Comfort', 'Comfortable training shoes focused on comfort. Perfect for extended training periods.', 149.99, (SELECT id FROM child_categories WHERE name = 'Comfortable Training Shoes'), 42, 4.5, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9100 Comfort', 'Comfortable training shoes with enhanced padding. Excellent for long training sessions.', 104.99, (SELECT id FROM child_categories WHERE name = 'Comfortable Training Shoes'), 36, 4.2, 178, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Versatile Training Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z2 Versatile', 'Versatile training shoes suitable for various training activities. Good all-round performance.', 149.99, (SELECT id FROM child_categories WHERE name = 'Versatile Training Shoes'), 40, 4.5, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9100 Versatile', 'Versatile training shoes with balanced features. Perfect for diverse training needs.', 104.99, (SELECT id FROM child_categories WHERE name = 'Versatile Training Shoes'), 34, 4.2, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Performance Training Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z2 Performance', 'Performance training shoes with advanced features. Perfect for serious training.', 149.99, (SELECT id FROM child_categories WHERE name = 'Performance Training Shoes'), 38, 4.6, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9100 Performance', 'Performance training shoes with professional features. Excellent for competitive training.', 104.99, (SELECT id FROM child_categories WHERE name = 'Performance Training Shoes'), 32, 4.3, 167, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Tournament Competition Shoes (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 Tournament', 'Tournament-grade competition shoes with premium features. Maximum performance for competitive play.', 179.99, (SELECT id FROM child_categories WHERE name = 'Tournament Competition Shoes'), 30, 4.9, 234, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Tournament', 'Tournament competition shoes with advanced technology. Perfect for tournament play.', 169.99, (SELECT id FROM child_categories WHERE name = 'Tournament Competition Shoes'), 33, 4.8, 201, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning AYAD018', 'Tournament competition shoes with excellent performance. Great value for competitive players.', 124.99, (SELECT id FROM child_categories WHERE name = 'Tournament Competition Shoes'), 25, 4.6, 178, 'percentage', 35.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Elite Competition Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 Elite', 'Elite-level competition shoes designed for professional players. Maximum performance and technology.', 199.99, (SELECT id FROM child_categories WHERE name = 'Elite Competition Shoes'), 22, 4.9, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Elite', 'Elite competition shoes with premium construction. Perfect for top-ranked players.', 139.99, (SELECT id FROM child_categories WHERE name = 'Elite Competition Shoes'), 18, 4.7, 145, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Championship Competition Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 Championship', 'Championship-level competition shoes with advanced performance technology. Used by world champions.', 209.99, (SELECT id FROM child_categories WHERE name = 'Championship Competition Shoes'), 20, 4.9, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Championship', 'Championship competition shoes with maximum performance. Perfect for championship-level play.', 149.99, (SELECT id FROM child_categories WHERE name = 'Championship Competition Shoes'), 16, 4.7, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Pro Competition Shoes (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Power Cushion 65 Z3 Pro', 'Professional competition shoes used by top-ranked players worldwide. Maximum performance and technology.', 219.99, (SELECT id FROM child_categories WHERE name = 'Pro Competition Shoes'), 18, 4.9, 223, NULL, NULL, NULL, NULL, FALSE),
('Victor SH-P9200 Pro', 'Professional competition shoes with elite features. Perfect for professional players.', 159.99, (SELECT id FROM child_categories WHERE name = 'Pro Competition Shoes'), 15, 4.8, 189, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- ============================================
-- APPAREL CATEGORY PRODUCTS
-- ============================================

-- Moisture-Wicking Shirts (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Performance Shirt', 'Moisture-wicking badminton shirt with advanced fabric technology. Keeps you dry and comfortable during play.', 39.99, (SELECT id FROM child_categories WHERE name = 'Moisture-Wicking Shirts'), 80, 4.6, 234, NULL, NULL, NULL, NULL, FALSE),
('Victor Dry-Fit Shirt', 'Moisture-wicking shirt with excellent breathability. Perfect for intense matches and training.', 34.99, (SELECT id FROM child_categories WHERE name = 'Moisture-Wicking Shirts'), 85, 4.5, 198, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Quick-Dry Shirt', 'Moisture-wicking shirt with quick-dry technology. Excellent value for regular players.', 24.99, (SELECT id FROM child_categories WHERE name = 'Moisture-Wicking Shirts'), 75, 4.3, 167, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Breathable Shirts (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Breathable Shirt', 'Highly breathable badminton shirt for optimal ventilation. Mesh panels for enhanced airflow.', 39.99, (SELECT id FROM child_categories WHERE name = 'Breathable Shirts'), 78, 4.6, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor Airflow Shirt', 'Breathable shirt with advanced ventilation system. Keeps you cool during intense play.', 34.99, (SELECT id FROM child_categories WHERE name = 'Breathable Shirts'), 82, 4.5, 178, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Ventilated Shirt', 'Breathable shirt with mesh ventilation. Great value for comfort-focused players.', 24.99, (SELECT id FROM child_categories WHERE name = 'Breathable Shirts'), 72, 4.3, 145, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Performance Shirts (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Pro Performance Shirt', 'High-performance badminton shirt with advanced fabric technology. Maximum performance features.', 49.99, (SELECT id FROM child_categories WHERE name = 'Performance Shirts'), 70, 4.7, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor Elite Shirt', 'Performance shirt with professional features. Perfect for competitive players.', 34.99, (SELECT id FROM child_categories WHERE name = 'Performance Shirts'), 65, 4.5, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Training Shirts (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Training Shirt', 'Comfortable training shirt designed for practice sessions. Good value for regular training.', 29.99, (SELECT id FROM child_categories WHERE name = 'Training Shirts'), 85, 4.4, 223, NULL, NULL, NULL, NULL, FALSE),
('Victor Practice Shirt', 'Training shirt with comfortable fit. Perfect for regular practice and casual play.', 20.99, (SELECT id FROM child_categories WHERE name = 'Training Shirts'), 80, 4.2, 189, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Flexible Shorts (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Flexible Shorts', 'Badminton shorts with flexible materials for unrestricted movement. Perfect for all playing styles.', 34.99, (SELECT id FROM child_categories WHERE name = 'Flexible Shorts'), 90, 4.6, 245, NULL, NULL, NULL, NULL, FALSE),
('Victor Stretch Shorts', 'Flexible shorts with stretch fabric. Excellent for quick movements and agility.', 29.99, (SELECT id FROM child_categories WHERE name = 'Flexible Shorts'), 95, 4.5, 201, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Comfort Shorts', 'Flexible shorts with comfortable fit. Great value for regular players.', 19.99, (SELECT id FROM child_categories WHERE name = 'Flexible Shorts'), 85, 4.3, 178, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Performance Shorts (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Performance Shorts', 'High-performance badminton shorts with advanced features. Maximum performance and comfort.', 39.99, (SELECT id FROM child_categories WHERE name = 'Performance Shorts'), 75, 4.7, 198, NULL, NULL, NULL, NULL, FALSE),
('Victor Pro Shorts', 'Performance shorts with professional features. Perfect for competitive play.', 27.99, (SELECT id FROM child_categories WHERE name = 'Performance Shorts'), 70, 4.5, 167, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Training Shorts (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Training Shorts', 'Comfortable training shorts for practice sessions. Good value for regular training.', 29.99, (SELECT id FROM child_categories WHERE name = 'Training Shorts'), 88, 4.4, 234, NULL, NULL, NULL, NULL, FALSE),
('Victor Practice Shorts', 'Training shorts with comfortable fit. Perfect for regular practice.', 20.99, (SELECT id FROM child_categories WHERE name = 'Training Shorts'), 82, 4.2, 189, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Competition Shorts (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Competition Shorts', 'Professional competition shorts with premium materials. Perfect for tournament play.', 44.99, (SELECT id FROM child_categories WHERE name = 'Competition Shorts'), 65, 4.8, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor Tournament Shorts', 'Competition shorts with professional design. Excellent for competitive players.', 31.99, (SELECT id FROM child_categories WHERE name = 'Competition Shorts'), 60, 4.6, 178, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Performance Skirts (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Performance Skirt', 'Badminton skirt designed for performance with functional features. Comfortable and stylish.', 39.99, (SELECT id FROM child_categories WHERE name = 'Performance Skirts'), 70, 4.6, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor Pro Skirt', 'Performance skirt with professional features. Perfect for competitive female players.', 27.99, (SELECT id FROM child_categories WHERE name = 'Performance Skirts'), 65, 4.4, 145, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Training Skirts (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Training Skirt', 'Comfortable training skirt for practice and casual play. Good value for regular players.', 29.99, (SELECT id FROM child_categories WHERE name = 'Training Skirts'), 75, 4.4, 167, NULL, NULL, NULL, NULL, FALSE),
('Victor Practice Skirt', 'Training skirt with comfortable fit. Perfect for regular practice sessions.', 20.99, (SELECT id FROM child_categories WHERE name = 'Training Skirts'), 70, 4.2, 134, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Competition Skirts (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Competition Skirt', 'Professional competition skirt with premium design. Perfect for tournament play.', 44.99, (SELECT id FROM child_categories WHERE name = 'Competition Skirts'), 60, 4.7, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor Tournament Skirt', 'Competition skirt with professional materials. Excellent for competitive players.', 31.99, (SELECT id FROM child_categories WHERE name = 'Competition Skirts'), 55, 4.5, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Cushioned Socks (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Cushioned Socks', 'Badminton socks with extra cushioning for impact protection. Comfortable and protective.', 12.99, (SELECT id FROM child_categories WHERE name = 'Cushioned Socks'), 150, 4.5, 456, NULL, NULL, NULL, NULL, FALSE),
('Victor Padded Socks', 'Cushioned socks with enhanced padding. Perfect for players with foot sensitivity.', 10.99, (SELECT id FROM child_categories WHERE name = 'Cushioned Socks'), 160, 4.4, 389, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Comfort Socks', 'Cushioned socks with good padding. Great value for regular players.', 7.99, (SELECT id FROM child_categories WHERE name = 'Cushioned Socks'), 140, 4.2, 312, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Moisture-Wicking Socks (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Moisture-Wicking Socks', 'Socks with moisture-wicking technology to keep feet dry. Essential for comfort during play.', 12.99, (SELECT id FROM child_categories WHERE name = 'Moisture-Wicking Socks'), 155, 4.6, 478, NULL, NULL, NULL, NULL, FALSE),
('Victor Dry-Fit Socks', 'Moisture-wicking socks with excellent breathability. Perfect for intense matches.', 10.99, (SELECT id FROM child_categories WHERE name = 'Moisture-Wicking Socks'), 165, 4.5, 412, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Quick-Dry Socks', 'Moisture-wicking socks with quick-dry technology. Great value for regular players.', 7.99, (SELECT id FROM child_categories WHERE name = 'Moisture-Wicking Socks'), 145, 4.3, 345, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Performance Socks (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Performance Socks', 'High-performance badminton socks with advanced features. Maximum comfort and support.', 14.99, (SELECT id FROM child_categories WHERE name = 'Performance Socks'), 140, 4.7, 423, NULL, NULL, NULL, NULL, FALSE),
('Victor Pro Socks', 'Performance socks with professional features. Perfect for competitive players.', 10.99, (SELECT id FROM child_categories WHERE name = 'Performance Socks'), 135, 4.5, 367, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Training Socks (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Training Socks', 'Comfortable training socks for regular practice and play. Good value for frequent use.', 9.99, (SELECT id FROM child_categories WHERE name = 'Training Socks'), 170, 4.4, 512, NULL, NULL, NULL, NULL, FALSE),
('Victor Practice Socks', 'Training socks with comfortable fit. Perfect for regular practice sessions.', 6.99, (SELECT id FROM child_categories WHERE name = 'Training Socks'), 165, 4.2, 445, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Complete Apparel Sets (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Complete Apparel Set', 'Complete badminton apparel set including shirt, shorts, and accessories. Coordinated design for professional look.', 79.99, (SELECT id FROM child_categories WHERE name = 'Complete Apparel Sets'), 50, 4.7, 234, NULL, NULL, NULL, NULL, FALSE),
('Victor Pro Apparel Set', 'Complete professional apparel set with premium materials. Perfect for competitive players.', 69.99, (SELECT id FROM child_categories WHERE name = 'Complete Apparel Sets'), 55, 4.6, 201, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Training Set', 'Complete training apparel set with good value. Excellent for regular players.', 49.99, (SELECT id FROM child_categories WHERE name = 'Complete Apparel Sets'), 45, 4.4, 178, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Training Sets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Training Apparel Set', 'Training apparel set designed for practice sessions. Good value for regular training.', 59.99, (SELECT id FROM child_categories WHERE name = 'Training Sets'), 60, 4.5, 267, NULL, NULL, NULL, NULL, FALSE),
('Victor Practice Set', 'Training set with comfortable fit. Perfect for regular practice and casual play.', 41.99, (SELECT id FROM child_categories WHERE name = 'Training Sets'), 58, 4.3, 223, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Competition Sets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Competition Apparel Set', 'Professional competition apparel set with coordinated designs. Perfect for tournament play.', 89.99, (SELECT id FROM child_categories WHERE name = 'Competition Sets'), 40, 4.8, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor Tournament Set', 'Competition set with professional materials. Excellent for competitive players.', 62.99, (SELECT id FROM child_categories WHERE name = 'Competition Sets'), 35, 4.6, 178, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Warm-Up Jackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Warm-Up Jacket', 'Lightweight warm-up jacket for pre-game preparation. Breathable and comfortable.', 49.99, (SELECT id FROM child_categories WHERE name = 'Warm-Up Jackets'), 65, 4.6, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor Pre-Game Jacket', 'Warm-up jacket with good ventilation. Perfect for pre-game warm-ups.', 34.99, (SELECT id FROM child_categories WHERE name = 'Warm-Up Jackets'), 70, 4.4, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Training Jackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Training Jacket', 'Comfortable training jacket for practice and cool-down. Good value for regular use.', 44.99, (SELECT id FROM child_categories WHERE name = 'Training Jackets'), 60, 4.5, 178, NULL, NULL, NULL, NULL, FALSE),
('Victor Practice Jacket', 'Training jacket with comfortable fit. Perfect for practice sessions.', 31.99, (SELECT id FROM child_categories WHERE name = 'Training Jackets'), 65, 4.3, 145, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Performance Jackets (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Performance Jacket', 'High-performance jacket with advanced materials. Perfect for competitive players.', 59.99, (SELECT id FROM child_categories WHERE name = 'Performance Jackets'), 55, 4.7, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor Pro Jacket', 'Performance jacket with professional features. Excellent for tournament play.', 41.99, (SELECT id FROM child_categories WHERE name = 'Performance Jackets'), 50, 4.5, 167, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- ============================================
-- ACCESSORIES CATEGORY PRODUCTS
-- ============================================

-- Replacement Grips (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Replacement Grip', 'Base replacement grip for racket handle restoration. High-quality materials for comfortable feel.', 8.99, (SELECT id FROM child_categories WHERE name = 'Replacement Grips'), 200, 4.5, 567, NULL, NULL, NULL, NULL, FALSE),
('Victor Base Grip', 'Replacement grip with good quality. Perfect for restoring racket handle feel.', 7.99, (SELECT id FROM child_categories WHERE name = 'Replacement Grips'), 210, 4.4, 489, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Standard Grip', 'Quality replacement grip with reliable performance. Great value for regular players.', 5.99, (SELECT id FROM child_categories WHERE name = 'Replacement Grips'), 190, 4.2, 412, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Overgrips (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Super Grap Overgrip', 'Thin overgrip for enhanced grip feel and sweat absorption. Popular choice among professional players.', 4.99, (SELECT id FROM child_categories WHERE name = 'Overgrips'), 300, 4.7, 1234, NULL, NULL, NULL, NULL, FALSE),
('Victor Super Wipe Overgrip', 'Overgrip with excellent sweat absorption. Perfect for maintaining grip during intense play.', 4.49, (SELECT id FROM child_categories WHERE name = 'Overgrips'), 310, 4.6, 1089, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Overgrip', 'Quality overgrip with good performance. Great value for regular players.', 3.49, (SELECT id FROM child_categories WHERE name = 'Overgrips'), 290, 4.4, 912, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Towel Grips (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Towel Grip', 'Towel grip for maximum sweat absorption and comfort. Perfect for players with sweaty hands.', 6.99, (SELECT id FROM child_categories WHERE name = 'Towel Grips'), 180, 4.6, 456, NULL, NULL, NULL, NULL, FALSE),
('Victor Absorbent Grip', 'Towel grip with excellent absorption. Great for maintaining grip in humid conditions.', 4.99, (SELECT id FROM child_categories WHERE name = 'Towel Grips'), 175, 4.4, 389, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Premium Grips (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Premium Grip', 'High-end grip with advanced materials and superior feel. Maximum comfort and performance.', 12.99, (SELECT id FROM child_categories WHERE name = 'Premium Grips'), 150, 4.8, 678, NULL, NULL, NULL, NULL, FALSE),
('Victor Elite Grip', 'Premium grip with professional features. Perfect for players seeking superior feel.', 9.99, (SELECT id FROM child_categories WHERE name = 'Premium Grips'), 145, 4.6, 567, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- High-Tension Strings (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex BG80 String', 'High-tension string for maximum control and precision. Popular among professional players.', 24.99, (SELECT id FROM child_categories WHERE name = 'High-Tension Strings'), 100, 4.8, 789, NULL, NULL, NULL, NULL, FALSE),
('Victor VS-850 String', 'High-tension string with excellent control. Perfect for precision-focused players.', 22.99, (SELECT id FROM child_categories WHERE name = 'High-Tension Strings'), 105, 4.7, 678, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.1 String', 'High-tension string with good control. Great value for control-oriented players.', 17.99, (SELECT id FROM child_categories WHERE name = 'High-Tension Strings'), 95, 4.5, 567, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Power Strings (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex BG65 String', 'Power string designed for maximum repulsion. Excellent for powerful shots and smashes.', 19.99, (SELECT id FROM child_categories WHERE name = 'Power Strings'), 110, 4.7, 845, NULL, NULL, NULL, NULL, FALSE),
('Victor VS-680 String', 'Power string with enhanced repulsion. Perfect for players who prefer powerful shots.', 17.99, (SELECT id FROM child_categories WHERE name = 'Power Strings'), 115, 4.6, 734, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.5 String', 'Power string with good repulsion. Great value for power-focused players.', 14.99, (SELECT id FROM child_categories WHERE name = 'Power Strings'), 100, 4.4, 623, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Durable Strings (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex BG65 Ti String', 'Durable string with superior resistance to breakage. Long-lasting performance for regular players.', 21.99, (SELECT id FROM child_categories WHERE name = 'Durable Strings'), 108, 4.6, 712, NULL, NULL, NULL, NULL, FALSE),
('Victor VS-750 String', 'Durable string with excellent longevity. Perfect for players who break strings frequently.', 19.99, (SELECT id FROM child_categories WHERE name = 'Durable Strings'), 112, 4.5, 645, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.7 String', 'Durable string with good resistance. Great value for durability-focused players.', 16.99, (SELECT id FROM child_categories WHERE name = 'Durable Strings'), 102, 4.3, 534, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Control Strings (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex BG66 Ultimax String', 'Control string optimized for precise shot placement. Excellent for accurate play.', 26.99, (SELECT id FROM child_categories WHERE name = 'Control Strings'), 98, 4.8, 756, NULL, NULL, NULL, NULL, FALSE),
('Victor VS-890 String', 'Control string with enhanced precision. Perfect for players seeking accurate shot placement.', 24.99, (SELECT id FROM child_categories WHERE name = 'Control Strings'), 103, 4.7, 667, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.3 String', 'Control string with good precision. Great value for control-oriented players.', 19.99, (SELECT id FROM child_categories WHERE name = 'Control Strings'), 93, 4.5, 578, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- All-Round Strings (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex BG65 String All-Round', 'Versatile string suitable for all playing styles. Balanced performance and value.', 19.99, (SELECT id FROM child_categories WHERE name = 'All-Round Strings'), 115, 4.7, 923, NULL, NULL, NULL, NULL, FALSE),
('Victor VS-700 String', 'All-round string with versatile performance. Perfect for players with varied playing style.', 17.99, (SELECT id FROM child_categories WHERE name = 'All-Round Strings'), 120, 4.6, 812, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.6 String', 'All-round string with balanced features. Great value for versatile players.', 14.99, (SELECT id FROM child_categories WHERE name = 'All-Round Strings'), 110, 4.4, 701, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Standard Wristbands (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Wristband', 'Basic wristband for sweat absorption and grip maintenance. Essential for comfortable play.', 5.99, (SELECT id FROM child_categories WHERE name = 'Standard Wristbands'), 250, 4.4, 1234, NULL, NULL, NULL, NULL, FALSE),
('Victor Sweatband', 'Standard wristband with good absorption. Perfect for keeping hands dry during play.', 4.99, (SELECT id FROM child_categories WHERE name = 'Standard Wristbands'), 260, 4.3, 1089, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Basic Wristband', 'Quality wristband with reliable performance. Great value for regular players.', 3.99, (SELECT id FROM child_categories WHERE name = 'Standard Wristbands'), 240, 4.1, 912, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Premium Wristbands (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Premium Wristband', 'High-quality wristband with superior absorption. Enhanced comfort and performance.', 8.99, (SELECT id FROM child_categories WHERE name = 'Premium Wristbands'), 200, 4.6, 678, NULL, NULL, NULL, NULL, FALSE),
('Victor Elite Wristband', 'Premium wristband with advanced materials. Perfect for players seeking superior comfort.', 6.99, (SELECT id FROM child_categories WHERE name = 'Premium Wristbands'), 195, 4.4, 567, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Branded Wristbands (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Branded Wristband', 'Wristband featuring Yonex brand logo and design. Stylish and functional.', 6.99, (SELECT id FROM child_categories WHERE name = 'Branded Wristbands'), 220, 4.5, 789, NULL, NULL, NULL, NULL, FALSE),
('Victor Logo Wristband', 'Wristband with Victor brand logo. Perfect for brand enthusiasts.', 4.99, (SELECT id FROM child_categories WHERE name = 'Branded Wristbands'), 225, 4.3, 645, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Standard Headbands (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Headband', 'Basic headband for keeping sweat away from eyes. Essential for comfortable play.', 6.99, (SELECT id FROM child_categories WHERE name = 'Standard Headbands'), 230, 4.5, 1012, NULL, NULL, NULL, NULL, FALSE),
('Victor Sweat Headband', 'Standard headband with good absorption. Perfect for intense matches and training.', 5.99, (SELECT id FROM child_categories WHERE name = 'Standard Headbands'), 240, 4.4, 889, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Basic Headband', 'Quality headband with reliable performance. Great value for regular players.', 4.99, (SELECT id FROM child_categories WHERE name = 'Standard Headbands'), 220, 4.2, 756, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Premium Headbands (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Premium Headband', 'High-quality headband with superior moisture-wicking properties. Enhanced comfort during play.', 9.99, (SELECT id FROM child_categories WHERE name = 'Premium Headbands'), 190, 4.7, 623, NULL, NULL, NULL, NULL, FALSE),
('Victor Elite Headband', 'Premium headband with advanced features. Perfect for players seeking superior comfort.', 7.99, (SELECT id FROM child_categories WHERE name = 'Premium Headbands'), 185, 4.5, 534, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Performance Headbands (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Performance Headband', 'Performance-focused headband with advanced features. Maximum comfort and functionality.', 11.99, (SELECT id FROM child_categories WHERE name = 'Performance Headbands'), 180, 4.8, 712, NULL, NULL, NULL, NULL, FALSE),
('Victor Pro Headband', 'Performance headband with professional features. Excellent for competitive players.', 8.99, (SELECT id FROM child_categories WHERE name = 'Performance Headbands'), 175, 4.6, 601, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Badminton Nets (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Professional Net', 'Professional badminton net for court setup and training. High-quality materials and construction.', 89.99, (SELECT id FROM child_categories WHERE name = 'Badminton Nets'), 40, 4.7, 234, NULL, NULL, NULL, NULL, FALSE),
('Victor Tournament Net', 'Tournament-grade badminton net with premium construction. Perfect for competitive play.', 79.99, (SELECT id FROM child_categories WHERE name = 'Badminton Nets'), 45, 4.6, 201, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Standard Net', 'Quality badminton net with good durability. Great value for practice courts.', 62.99, (SELECT id FROM child_categories WHERE name = 'Badminton Nets'), 35, 4.4, 178, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Net Posts (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Net Post System', 'Sturdy net posts and support system for badminton courts. Professional-grade construction.', 149.99, (SELECT id FROM child_categories WHERE name = 'Net Posts'), 25, 4.8, 189, NULL, NULL, NULL, NULL, FALSE),
('Victor Court Post Set', 'Net post system with excellent stability. Perfect for setting up practice courts.', 104.99, (SELECT id FROM child_categories WHERE name = 'Net Posts'), 20, 4.6, 156, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Court Equipment (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Complete Court Set', 'Complete court equipment set including net, posts, and accessories. Everything needed for court setup.', 199.99, (SELECT id FROM child_categories WHERE name = 'Court Equipment'), 20, 4.9, 201, NULL, NULL, NULL, NULL, FALSE),
('Victor Professional Court Set', 'Professional court equipment set with premium components. Perfect for training facilities.', 139.99, (SELECT id FROM child_categories WHERE name = 'Court Equipment'), 15, 4.7, 167, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Training Equipment (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Training Equipment Set', 'Training equipment including targets, markers, and practice aids. Perfect for skill development.', 49.99, (SELECT id FROM child_categories WHERE name = 'Training Equipment'), 50, 4.6, 234, NULL, NULL, NULL, NULL, FALSE),
('Victor Practice Aids Set', 'Training equipment set with various practice aids. Excellent for improving technique.', 34.99, (SELECT id FROM child_categories WHERE name = 'Training Equipment'), 45, 4.4, 201, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Sports Towels (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Sports Towel', 'Quick-drying sports towel for wiping sweat during matches. Essential for comfort during play.', 14.99, (SELECT id FROM child_categories WHERE name = 'Sports Towels'), 120, 4.5, 567, NULL, NULL, NULL, NULL, FALSE),
('Victor Quick-Dry Towel', 'Sports towel with quick-drying technology. Perfect for intense matches and training.', 12.99, (SELECT id FROM child_categories WHERE name = 'Sports Towels'), 130, 4.4, 489, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Absorbent Towel', 'Quality sports towel with good absorption. Great value for regular players.', 9.99, (SELECT id FROM child_categories WHERE name = 'Sports Towels'), 110, 4.2, 412, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Premium Towels (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Premium Sports Towel', 'High-quality sports towel with superior absorption and durability. Enhanced comfort and performance.', 19.99, (SELECT id FROM child_categories WHERE name = 'Premium Towels'), 100, 4.7, 623, NULL, NULL, NULL, NULL, FALSE),
('Victor Elite Towel', 'Premium sports towel with advanced features. Perfect for players seeking superior quality.', 13.99, (SELECT id FROM child_categories WHERE name = 'Premium Towels'), 95, 4.5, 534, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Microfiber Towels (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Microfiber Towel', 'Microfiber towel with advanced quick-drying technology. Excellent absorption and fast drying.', 16.99, (SELECT id FROM child_categories WHERE name = 'Microfiber Towels'), 105, 4.6, 578, NULL, NULL, NULL, NULL, FALSE),
('Victor Quick-Dry Microfiber', 'Microfiber towel with superior quick-drying properties. Perfect for frequent use.', 11.99, (SELECT id FROM child_categories WHERE name = 'Microfiber Towels'), 100, 4.4, 489, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Sports Water Bottles (3 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Sports Water Bottle', 'Durable sports water bottle for hydration during play. Essential for maintaining performance.', 19.99, (SELECT id FROM child_categories WHERE name = 'Sports Water Bottles'), 150, 4.6, 789, NULL, NULL, NULL, NULL, FALSE),
('Victor Hydration Bottle', 'Sports water bottle with good capacity. Perfect for staying hydrated during matches.', 16.99, (SELECT id FROM child_categories WHERE name = 'Sports Water Bottles'), 160, 4.5, 678, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Water Bottle', 'Quality sports water bottle with reliable performance. Great value for regular players.', 12.99, (SELECT id FROM child_categories WHERE name = 'Sports Water Bottles'), 140, 4.3, 567, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

-- Insulated Water Bottles (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Insulated Water Bottle', 'Insulated water bottle to keep drinks cold during long matches. Excellent for extended play.', 24.99, (SELECT id FROM child_categories WHERE name = 'Insulated Water Bottles'), 120, 4.7, 645, NULL, NULL, NULL, NULL, FALSE),
('Victor Cold-Keep Bottle', 'Insulated water bottle with superior temperature retention. Perfect for long training sessions.', 17.99, (SELECT id FROM child_categories WHERE name = 'Insulated Water Bottles'), 115, 4.5, 534, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-03-31 23:59:59', TRUE);

-- Premium Water Bottles (2 products, 1 clearance)
INSERT INTO products (name, description, price, child_category_id, stock, rating, num_reviews, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Premium Water Bottle', 'High-quality water bottle with advanced features and materials. Maximum durability and performance.', 29.99, (SELECT id FROM child_categories WHERE name = 'Premium Water Bottles'), 100, 4.8, 712, NULL, NULL, NULL, NULL, FALSE),
('Victor Elite Bottle', 'Premium water bottle with superior construction. Perfect for players seeking quality.', 20.99, (SELECT id FROM child_categories WHERE name = 'Premium Water Bottles'), 95, 4.6, 601, 'percentage', 30.00, '2025-01-01 00:00:00', '2025-02-28 23:59:59', TRUE);

