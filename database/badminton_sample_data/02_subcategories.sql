-- Badminton Stores Sample Data - Subcategories
-- This file inserts 5-7 subcategories per category (30 total)
-- 
-- Execution Order: 2 (Depends on categories)
-- 
-- @author Thang Truong
-- @date 2025-01-17

USE ecommerce-mysql-db;

-- ============================================
-- SUBCATEGORIES (30 subcategories - 5-7 per category)
-- ============================================

-- Racquets Subcategories (7 subcategories)
INSERT INTO subcategories (category_id, name, description, photo_url) VALUES
((SELECT id FROM categories WHERE name = 'Racquets'), 'Professional Rackets', 'High-end professional badminton rackets designed for advanced and tournament players. Premium materials and advanced technology.', NULL),
((SELECT id FROM categories WHERE name = 'Racquets'), 'Intermediate Rackets', 'Mid-range badminton rackets perfect for intermediate players developing their skills. Balanced performance and value.', NULL),
((SELECT id FROM categories WHERE name = 'Racquets'), 'Beginner Rackets', 'Entry-level badminton rackets ideal for beginners and casual players. Easy to use with forgiving characteristics.', NULL),
((SELECT id FROM categories WHERE name = 'Racquets'), 'Lightweight Rackets', 'Ultra-lightweight rackets designed for speed and quick maneuverability. Perfect for fast-paced play.', NULL),
((SELECT id FROM categories WHERE name = 'Racquets'), 'Heavy Rackets', 'Head-heavy rackets built for power and stability. Ideal for players who prefer powerful smashes.', NULL),
((SELECT id FROM categories WHERE name = 'Racquets'), 'Stringing Services', 'Professional racket stringing services and string tension customization for optimal performance.', NULL),
((SELECT id FROM categories WHERE name = 'Racquets'), 'Racket Accessories', 'Racket covers, protective cases, and maintenance accessories to keep your racket in perfect condition.', NULL);

-- Bags Subcategories (6 subcategories)
INSERT INTO subcategories (category_id, name, description, photo_url) VALUES
((SELECT id FROM categories WHERE name = 'Bags'), 'Racket Bags', 'Dedicated bags designed specifically for carrying badminton rackets. Various sizes from single to multi-racket capacity.', NULL),
((SELECT id FROM categories WHERE name = 'Bags'), 'Shoe Bags', 'Specialized bags for storing and transporting badminton shoes. Keeps shoes separate from other equipment.', NULL),
((SELECT id FROM categories WHERE name = 'Bags'), 'Backpacks', 'Multi-compartment backpacks for carrying rackets, shoes, apparel, and accessories. Perfect for training and tournaments.', NULL),
((SELECT id FROM categories WHERE name = 'Bags'), 'Duffel Bags', 'Spacious duffel bags with multiple compartments for all your badminton gear. Great for extended training sessions.', NULL),
((SELECT id FROM categories WHERE name = 'Bags'), 'Travel Bags', 'Large travel bags designed for transporting multiple rackets and equipment. Ideal for tournaments and travel.', NULL),
((SELECT id FROM categories WHERE name = 'Bags'), 'Drawstring Bags', 'Lightweight drawstring bags for quick trips to the court. Simple and convenient storage solution.', NULL);

-- Shoes Subcategories (7 subcategories)
INSERT INTO subcategories (category_id, name, description, photo_url) VALUES
((SELECT id FROM categories WHERE name = 'Shoes'), 'Professional Shoes', 'High-performance badminton shoes designed for competitive play. Advanced cushioning and stability features.', NULL),
((SELECT id FROM categories WHERE name = 'Shoes'), 'Indoor Court Shoes', 'Specialized indoor court shoes with excellent grip and non-marking soles. Perfect for indoor badminton courts.', NULL),
((SELECT id FROM categories WHERE name = 'Shoes'), 'Lightweight Shoes', 'Ultra-lightweight badminton shoes for maximum agility and speed. Minimal weight without compromising support.', NULL),
((SELECT id FROM categories WHERE name = 'Shoes'), 'Cushioned Shoes', 'Extra cushioning badminton shoes for comfort and impact protection. Ideal for players with foot sensitivity.', NULL),
((SELECT id FROM categories WHERE name = 'Shoes'), 'Budget Shoes', 'Affordable badminton shoes offering good value for casual players. Essential features at accessible prices.', NULL),
((SELECT id FROM categories WHERE name = 'Shoes'), 'Training Shoes', 'Durable training shoes designed for practice sessions and regular use. Built to withstand frequent training.', NULL),
((SELECT id FROM categories WHERE name = 'Shoes'), 'Competition Shoes', 'Tournament-grade competition shoes with premium materials and technology. For serious competitive players.', NULL);

-- Apparel Subcategories (6 subcategories)
INSERT INTO subcategories (category_id, name, description, photo_url) VALUES
((SELECT id FROM categories WHERE name = 'Apparel'), 'Shirts', 'Moisture-wicking badminton shirts and tops. Breathable fabrics designed for optimal performance and comfort.', NULL),
((SELECT id FROM categories WHERE name = 'Apparel'), 'Shorts', 'Comfortable badminton shorts with flexible materials. Designed for freedom of movement during play.', NULL),
((SELECT id FROM categories WHERE name = 'Apparel'), 'Skirts', 'Badminton skirts and dresses for female players. Stylish designs with performance-focused features.', NULL),
((SELECT id FROM categories WHERE name = 'Apparel'), 'Socks', 'Specialized badminton socks with cushioning and moisture management. Essential for foot comfort and protection.', NULL),
((SELECT id FROM categories WHERE name = 'Apparel'), 'Sets', 'Complete badminton apparel sets including shirts, shorts, and accessories. Coordinated designs for a professional look.', NULL),
((SELECT id FROM categories WHERE name = 'Apparel'), 'Jackets', 'Badminton jackets and warm-up gear. Lightweight and breathable for pre-game warm-ups and post-game cool-downs.', NULL);

-- Accessories Subcategories (7 subcategories)
INSERT INTO subcategories (category_id, name, description, photo_url) VALUES
((SELECT id FROM categories WHERE name = 'Accessories'), 'Grips', 'Replacement grips and overgrips for badminton rackets. Various materials and thicknesses for personalized feel.', NULL),
((SELECT id FROM categories WHERE name = 'Accessories'), 'Strings', 'Badminton racket strings in various materials and gauges. High-quality strings for optimal performance and durability.', NULL),
((SELECT id FROM categories WHERE name = 'Accessories'), 'Wristbands', 'Sweat-absorbing wristbands to keep hands dry during play. Essential for maintaining grip and comfort.', NULL),
((SELECT id FROM categories WHERE name = 'Accessories'), 'Headbands', 'Moisture-wicking headbands to keep sweat away from eyes. Comfortable and functional during intense matches.', NULL),
((SELECT id FROM categories WHERE name = 'Accessories'), 'Equipment', 'Badminton nets, posts, and court equipment. Essential for setting up practice courts and training facilities.', NULL),
((SELECT id FROM categories WHERE name = 'Accessories'), 'Towels', 'Sports towels for wiping sweat during matches and training. Quick-drying and absorbent materials.', NULL),
((SELECT id FROM categories WHERE name = 'Accessories'), 'Water Bottles', 'Sports water bottles and hydration solutions. Keep hydrated during training and matches with convenient designs.', NULL);

