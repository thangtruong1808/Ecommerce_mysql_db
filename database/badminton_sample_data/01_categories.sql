-- Badminton Stores Sample Data - Categories
-- This file inserts 5 badminton categories
-- 
-- Execution Order: 1 (No dependencies)
-- 
-- @author Thang Truong
-- @date 2025-01-17

USE ecommerce-mysql-db;

-- ============================================
-- CATEGORIES (5 categories)
-- ============================================

INSERT INTO categories (name, description, photo_url) VALUES
('Racquets', 'Professional and recreational badminton rackets for all skill levels. From entry-level to tournament-grade rackets with various balance points and string tensions.', NULL),
('Bags', 'Badminton bags, backpacks, and carrying solutions for rackets, shoes, and equipment. Durable and functional designs for players on the go.', NULL),
('Shoes', 'Specialized badminton footwear designed for court performance. Features excellent grip, cushioning, and support for quick movements and lateral stability.', NULL),
('Apparel', 'Badminton clothing and sportswear including shirts, shorts, skirts, socks, and complete sets. Moisture-wicking fabrics for optimal comfort during play.', NULL),
('Accessories', 'Essential badminton accessories including grips, strings, wristbands, headbands, towels, water bottles, and court equipment.', NULL);

