-- Badminton Stores Sample Data - Child Categories
-- This file inserts 3-5 child categories per subcategory (approximately 120 total)
-- 
-- Execution Order: 3 (Depends on subcategories)
-- 
-- @author Thang Truong
-- @date 2025-01-17

USE ecommerce-mysql-db;

-- ============================================
-- CHILD CATEGORIES (3-5 per subcategory)
-- ============================================

-- Professional Rackets Child Categories (5)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Professional Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Head-Heavy Professional Rackets', 'Professional rackets with head-heavy balance for maximum power and smashing ability.'),
((SELECT id FROM subcategories WHERE name = 'Professional Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Even-Balance Professional Rackets', 'Professional rackets with balanced weight distribution for versatile play style.'),
((SELECT id FROM subcategories WHERE name = 'Professional Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Head-Light Professional Rackets', 'Professional rackets with head-light balance for speed and quick maneuverability.'),
((SELECT id FROM subcategories WHERE name = 'Professional Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Stiff Professional Rackets', 'Professional rackets with stiff shaft for precise control and power transfer.'),
((SELECT id FROM subcategories WHERE name = 'Professional Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Flexible Professional Rackets', 'Professional rackets with flexible shaft for enhanced power generation and comfort.');

-- Intermediate Rackets Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Intermediate Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'All-Round Intermediate Rackets', 'Versatile intermediate rackets suitable for all playing styles and techniques.'),
((SELECT id FROM subcategories WHERE name = 'Intermediate Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Power Intermediate Rackets', 'Intermediate rackets designed for players who prefer powerful shots and smashes.'),
((SELECT id FROM subcategories WHERE name = 'Intermediate Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Control Intermediate Rackets', 'Intermediate rackets focused on precision and control for accurate shot placement.'),
((SELECT id FROM subcategories WHERE name = 'Intermediate Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Speed Intermediate Rackets', 'Intermediate rackets optimized for fast-paced play and quick reactions.');

-- Beginner Rackets Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Beginner Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Pre-Strung Beginner Rackets', 'Ready-to-use beginner rackets with factory stringing. Perfect for new players.'),
((SELECT id FROM subcategories WHERE name = 'Beginner Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Beginner Racket Sets', 'Complete beginner sets including racket, shuttlecocks, and basic accessories.'),
((SELECT id FROM subcategories WHERE name = 'Beginner Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Junior Beginner Rackets', 'Lightweight beginner rackets designed specifically for junior players and children.');

-- Lightweight Rackets Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Lightweight Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Ultra-Light Rackets', 'Extremely lightweight rackets under 80g for maximum speed and agility.'),
((SELECT id FROM subcategories WHERE name = 'Lightweight Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Lightweight Power Rackets', 'Lightweight rackets with power-oriented design for fast and powerful shots.'),
((SELECT id FROM subcategories WHERE name = 'Lightweight Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Lightweight Control Rackets', 'Lightweight rackets focused on precision and control for accurate play.'),
((SELECT id FROM subcategories WHERE name = 'Lightweight Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Lightweight All-Round Rackets', 'Versatile lightweight rackets suitable for various playing styles.');

-- Heavy Rackets Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Heavy Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Head-Heavy Power Rackets', 'Heavy rackets with head-heavy balance for maximum smashing power.'),
((SELECT id FROM subcategories WHERE name = 'Heavy Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Heavy Stiff Rackets', 'Heavy rackets with stiff shaft for powerful and precise shots.'),
((SELECT id FROM subcategories WHERE name = 'Heavy Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Heavy Flexible Rackets', 'Heavy rackets with flexible shaft for enhanced power generation.'),
((SELECT id FROM subcategories WHERE name = 'Heavy Rackets' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Extra-Heavy Rackets', 'Ultra-heavy rackets for players who prefer maximum power and stability.');

-- Stringing Services Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Stringing Services' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Professional Stringing', 'Expert stringing service with precision tension control and quality strings.'),
((SELECT id FROM subcategories WHERE name = 'Stringing Services' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Standard Stringing', 'Standard stringing service with reliable tension and durable strings.'),
((SELECT id FROM subcategories WHERE name = 'Stringing Services' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Express Stringing', 'Fast stringing service for urgent needs with quality results.');

-- Racket Accessories Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Racket Accessories' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Racket Covers', 'Protective covers and cases to keep rackets safe during transport and storage.'),
((SELECT id FROM subcategories WHERE name = 'Racket Accessories' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Racket Maintenance Kits', 'Complete maintenance kits including cleaning supplies and protective accessories.'),
((SELECT id FROM subcategories WHERE name = 'Racket Accessories' AND category_id = (SELECT id FROM categories WHERE name = 'Racquets')), 'Racket Protection', 'Additional protection accessories including bumper guards and frame protectors.');

-- Racket Bags Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Racket Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Single Racket Bags', 'Compact bags designed to carry one racket. Lightweight and convenient.'),
((SELECT id FROM subcategories WHERE name = 'Racket Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Double Racket Bags', 'Bags designed to carry two rackets with additional storage compartments.'),
((SELECT id FROM subcategories WHERE name = 'Racket Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Multi-Racket Bags', 'Spacious bags capable of carrying three or more rackets with organized compartments.'),
((SELECT id FROM subcategories WHERE name = 'Racket Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Premium Racket Bags', 'High-end racket bags with premium materials and advanced features.');

-- Shoe Bags Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Shoe Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Standard Shoe Bags', 'Basic shoe bags for storing and transporting badminton shoes.'),
((SELECT id FROM subcategories WHERE name = 'Shoe Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Ventilated Shoe Bags', 'Shoe bags with ventilation features to keep shoes fresh and dry.'),
((SELECT id FROM subcategories WHERE name = 'Shoe Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Premium Shoe Bags', 'High-quality shoe bags with additional features and durable construction.');

-- Backpacks Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Backpacks' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Standard Backpacks', 'Versatile backpacks with multiple compartments for rackets and equipment.'),
((SELECT id FROM subcategories WHERE name = 'Backpacks' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Large Capacity Backpacks', 'Spacious backpacks designed to carry multiple rackets, shoes, and accessories.'),
((SELECT id FROM subcategories WHERE name = 'Backpacks' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Professional Backpacks', 'Premium backpacks with advanced organization features for serious players.'),
((SELECT id FROM subcategories WHERE name = 'Backpacks' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Tournament Backpacks', 'Tournament-grade backpacks with maximum capacity and professional features.');

-- Duffel Bags Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Duffel Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Standard Duffel Bags', 'Classic duffel bags with spacious main compartment for all badminton gear.'),
((SELECT id FROM subcategories WHERE name = 'Duffel Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Multi-Compartment Duffel Bags', 'Duffel bags with multiple organized compartments for better gear organization.'),
((SELECT id FROM subcategories WHERE name = 'Duffel Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Wheeled Duffel Bags', 'Duffel bags with wheels for easy transportation of heavy equipment.'),
((SELECT id FROM subcategories WHERE name = 'Duffel Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Premium Duffel Bags', 'High-end duffel bags with premium materials and advanced features.');

-- Travel Bags Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Travel Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Racket Travel Cases', 'Hard-shell travel cases designed to protect rackets during air travel and long journeys.'),
((SELECT id FROM subcategories WHERE name = 'Travel Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Equipment Travel Bags', 'Large travel bags for transporting complete badminton equipment sets.'),
((SELECT id FROM subcategories WHERE name = 'Travel Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Tournament Travel Bags', 'Professional travel bags designed for tournament players with maximum protection.');

-- Drawstring Bags Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Drawstring Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Standard Drawstring Bags', 'Simple drawstring bags for quick trips to the court.'),
((SELECT id FROM subcategories WHERE name = 'Drawstring Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Premium Drawstring Bags', 'High-quality drawstring bags with better materials and durability.'),
((SELECT id FROM subcategories WHERE name = 'Drawstring Bags' AND category_id = (SELECT id FROM categories WHERE name = 'Bags')), 'Branded Drawstring Bags', 'Drawstring bags featuring popular badminton brand logos and designs.');

-- Professional Shoes Child Categories (5)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Professional Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Professional Court Shoes', 'High-performance professional shoes with advanced cushioning and stability.'),
((SELECT id FROM subcategories WHERE name = 'Professional Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Professional Speed Shoes', 'Professional shoes optimized for speed and quick lateral movements.'),
((SELECT id FROM subcategories WHERE name = 'Professional Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Professional Power Shoes', 'Professional shoes designed for powerful movements and explosive jumps.'),
((SELECT id FROM subcategories WHERE name = 'Professional Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Professional Control Shoes', 'Professional shoes focused on stability and precise footwork.'),
((SELECT id FROM subcategories WHERE name = 'Professional Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Professional All-Round Shoes', 'Versatile professional shoes suitable for all playing styles.');

-- Indoor Court Shoes Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Indoor Court Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Non-Marking Court Shoes', 'Indoor court shoes with non-marking soles perfect for indoor facilities.'),
((SELECT id FROM subcategories WHERE name = 'Indoor Court Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'High-Grip Court Shoes', 'Indoor court shoes with superior grip for excellent traction on court surfaces.'),
((SELECT id FROM subcategories WHERE name = 'Indoor Court Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Cushioned Court Shoes', 'Indoor court shoes with extra cushioning for comfort during long matches.'),
((SELECT id FROM subcategories WHERE name = 'Indoor Court Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Lightweight Court Shoes', 'Lightweight indoor court shoes for agility and speed.');

-- Lightweight Shoes Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Lightweight Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Ultra-Light Shoes', 'Extremely lightweight shoes for maximum speed and minimal weight.'),
((SELECT id FROM subcategories WHERE name = 'Lightweight Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Lightweight Speed Shoes', 'Lightweight shoes optimized for fast movements and quick reactions.'),
((SELECT id FROM subcategories WHERE name = 'Lightweight Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Lightweight Training Shoes', 'Lightweight shoes designed for training sessions and practice.'),
((SELECT id FROM subcategories WHERE name = 'Lightweight Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Lightweight Competition Shoes', 'Lightweight shoes for competitive play with performance features.');

-- Cushioned Shoes Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Cushioned Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Maximum Cushioning Shoes', 'Shoes with maximum cushioning for superior impact protection and comfort.'),
((SELECT id FROM subcategories WHERE name = 'Cushioned Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Gel Cushioning Shoes', 'Shoes featuring gel cushioning technology for enhanced comfort.'),
((SELECT id FROM subcategories WHERE name = 'Cushioned Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Air Cushioning Shoes', 'Shoes with air cushioning systems for responsive comfort and support.'),
((SELECT id FROM subcategories WHERE name = 'Cushioned Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Memory Foam Cushioning Shoes', 'Shoes with memory foam cushioning for personalized comfort and fit.');

-- Budget Shoes Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Budget Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Entry-Level Budget Shoes', 'Affordable entry-level shoes with essential features for casual players.'),
((SELECT id FROM subcategories WHERE name = 'Budget Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Value Budget Shoes', 'Budget-friendly shoes offering good value with reliable performance.'),
((SELECT id FROM subcategories WHERE name = 'Budget Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Economy Budget Shoes', 'Economical shoes for beginners and recreational players.');

-- Training Shoes Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Training Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Durable Training Shoes', 'Durable training shoes built to withstand frequent practice sessions.'),
((SELECT id FROM subcategories WHERE name = 'Training Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Comfortable Training Shoes', 'Training shoes focused on comfort for extended training periods.'),
((SELECT id FROM subcategories WHERE name = 'Training Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Versatile Training Shoes', 'Versatile training shoes suitable for various training activities.'),
((SELECT id FROM subcategories WHERE name = 'Training Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Performance Training Shoes', 'Training shoes with performance features for serious training.');

-- Competition Shoes Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Competition Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Tournament Competition Shoes', 'Tournament-grade competition shoes with premium features and technology.'),
((SELECT id FROM subcategories WHERE name = 'Competition Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Elite Competition Shoes', 'Elite-level competition shoes designed for professional players.'),
((SELECT id FROM subcategories WHERE name = 'Competition Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Championship Competition Shoes', 'Championship-level competition shoes with advanced performance technology.'),
((SELECT id FROM subcategories WHERE name = 'Competition Shoes' AND category_id = (SELECT id FROM categories WHERE name = 'Shoes')), 'Pro Competition Shoes', 'Professional competition shoes used by top-ranked players worldwide.');

-- Shirts Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Shirts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Moisture-Wicking Shirts', 'Badminton shirts with advanced moisture-wicking technology for dry comfort.'),
((SELECT id FROM subcategories WHERE name = 'Shirts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Breathable Shirts', 'Highly breathable badminton shirts for optimal ventilation during play.'),
((SELECT id FROM subcategories WHERE name = 'Shirts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Performance Shirts', 'High-performance badminton shirts with advanced fabric technology.'),
((SELECT id FROM subcategories WHERE name = 'Shirts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Training Shirts', 'Comfortable training shirts designed for practice sessions and regular use.');

-- Shorts Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Shorts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Flexible Shorts', 'Badminton shorts with flexible materials for unrestricted movement.'),
((SELECT id FROM subcategories WHERE name = 'Shorts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Performance Shorts', 'High-performance badminton shorts with advanced features.'),
((SELECT id FROM subcategories WHERE name = 'Shorts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Training Shorts', 'Comfortable training shorts for practice and regular play.'),
((SELECT id FROM subcategories WHERE name = 'Shorts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Competition Shorts', 'Professional competition shorts with premium materials and design.');

-- Skirts Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Skirts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Performance Skirts', 'Badminton skirts designed for performance with functional features.'),
((SELECT id FROM subcategories WHERE name = 'Skirts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Training Skirts', 'Comfortable training skirts for practice and casual play.'),
((SELECT id FROM subcategories WHERE name = 'Skirts' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Competition Skirts', 'Professional competition skirts with premium design and materials.');

-- Socks Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Socks' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Cushioned Socks', 'Badminton socks with extra cushioning for impact protection and comfort.'),
((SELECT id FROM subcategories WHERE name = 'Socks' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Moisture-Wicking Socks', 'Socks with moisture-wicking technology to keep feet dry.'),
((SELECT id FROM subcategories WHERE name = 'Socks' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Performance Socks', 'High-performance badminton socks with advanced features.'),
((SELECT id FROM subcategories WHERE name = 'Socks' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Training Socks', 'Comfortable training socks for regular practice and play.');

-- Sets Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Sets' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Complete Apparel Sets', 'Complete badminton apparel sets including shirt, shorts, and accessories.'),
((SELECT id FROM subcategories WHERE name = 'Sets' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Training Sets', 'Training apparel sets designed for practice sessions.'),
((SELECT id FROM subcategories WHERE name = 'Sets' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Competition Sets', 'Professional competition apparel sets with coordinated designs.');

-- Jackets Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Jackets' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Warm-Up Jackets', 'Lightweight warm-up jackets for pre-game preparation.'),
((SELECT id FROM subcategories WHERE name = 'Jackets' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Training Jackets', 'Comfortable training jackets for practice and cool-down.'),
((SELECT id FROM subcategories WHERE name = 'Jackets' AND category_id = (SELECT id FROM categories WHERE name = 'Apparel')), 'Performance Jackets', 'High-performance jackets with advanced materials and features.');

-- Grips Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Grips' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Replacement Grips', 'Base replacement grips for racket handle restoration and customization.'),
((SELECT id FROM subcategories WHERE name = 'Grips' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Overgrips', 'Thin overgrips for enhanced grip feel and sweat absorption.'),
((SELECT id FROM subcategories WHERE name = 'Grips' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Towel Grips', 'Towel grips for maximum sweat absorption and comfort.'),
((SELECT id FROM subcategories WHERE name = 'Grips' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Premium Grips', 'High-end grips with advanced materials and superior feel.');

-- Strings Child Categories (5)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Strings' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'High-Tension Strings', 'High-tension strings for maximum control and precision.'),
((SELECT id FROM subcategories WHERE name = 'Strings' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Power Strings', 'Strings designed for maximum power and repulsion.'),
((SELECT id FROM subcategories WHERE name = 'Strings' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Durable Strings', 'Long-lasting strings with superior durability and resistance to breakage.'),
((SELECT id FROM subcategories WHERE name = 'Strings' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Control Strings', 'Strings optimized for precise control and shot placement.'),
((SELECT id FROM subcategories WHERE name = 'Strings' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'All-Round Strings', 'Versatile strings suitable for all playing styles and preferences.');

-- Wristbands Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Wristbands' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Standard Wristbands', 'Basic wristbands for sweat absorption and grip maintenance.'),
((SELECT id FROM subcategories WHERE name = 'Wristbands' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Premium Wristbands', 'High-quality wristbands with advanced materials and better absorption.'),
((SELECT id FROM subcategories WHERE name = 'Wristbands' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Branded Wristbands', 'Wristbands featuring popular badminton brand logos and designs.');

-- Headbands Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Headbands' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Standard Headbands', 'Basic headbands for keeping sweat away from eyes during play.'),
((SELECT id FROM subcategories WHERE name = 'Headbands' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Premium Headbands', 'High-quality headbands with superior moisture-wicking properties.'),
((SELECT id FROM subcategories WHERE name = 'Headbands' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Performance Headbands', 'Performance-focused headbands with advanced features and materials.');

-- Equipment Child Categories (4)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Equipment' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Badminton Nets', 'Professional badminton nets for court setup and training.'),
((SELECT id FROM subcategories WHERE name = 'Equipment' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Net Posts', 'Sturdy net posts and support systems for badminton courts.'),
((SELECT id FROM subcategories WHERE name = 'Equipment' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Court Equipment', 'Complete court equipment sets including nets, posts, and accessories.'),
((SELECT id FROM subcategories WHERE name = 'Equipment' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Training Equipment', 'Training equipment including targets, markers, and practice aids.');

-- Towels Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Towels' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Sports Towels', 'Quick-drying sports towels for wiping sweat during matches.'),
((SELECT id FROM subcategories WHERE name = 'Towels' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Premium Towels', 'High-quality sports towels with superior absorption and durability.'),
((SELECT id FROM subcategories WHERE name = 'Towels' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Microfiber Towels', 'Microfiber towels with advanced quick-drying technology.');

-- Water Bottles Child Categories (3)
INSERT INTO child_categories (subcategory_id, name, description) VALUES
((SELECT id FROM subcategories WHERE name = 'Water Bottles' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Sports Water Bottles', 'Durable sports water bottles for hydration during play.'),
((SELECT id FROM subcategories WHERE name = 'Water Bottles' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Insulated Water Bottles', 'Insulated water bottles to keep drinks cold during long matches.'),
((SELECT id FROM subcategories WHERE name = 'Water Bottles' AND category_id = (SELECT id FROM categories WHERE name = 'Accessories')), 'Premium Water Bottles', 'High-quality water bottles with advanced features and materials.');

