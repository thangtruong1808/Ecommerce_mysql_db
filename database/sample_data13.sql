-- Product Data for Ecommerce Database
-- This file contains products for child categories 112-121 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 112-121
-- ============================================

-- Child Category 112: Plants & Seeds (subcategory_id: 23, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Flower Seeds Mix', 'Mixed flower seeds packet with various varieties, easy to grow, excellent quality, 100+ seeds', 9.99, 112, 200, NULL, NULL, NULL, NULL, FALSE),
('Vegetable Seeds Tomato', 'Tomato seeds packet with various varieties, easy to grow, excellent quality, 50+ seeds', 7.99, 112, 220, NULL, NULL, NULL, NULL, FALSE),
('Herb Seeds Basil', 'Basil seeds packet with various varieties, easy to grow, excellent quality, 100+ seeds', 6.99, 112, 230, NULL, NULL, NULL, NULL, FALSE),
('Flower Seeds Sunflower', 'Sunflower seeds packet with various varieties, easy to grow, excellent quality, 50+ seeds', 8.99, 112, 210, NULL, NULL, NULL, NULL, FALSE),
('Vegetable Seeds Lettuce', 'Lettuce seeds packet with various varieties, easy to grow, excellent quality, 100+ seeds', 5.99, 112, 240, NULL, NULL, NULL, NULL, FALSE),
('Herb Seeds Mint', 'Mint seeds packet with various varieties, easy to grow, excellent quality, 100+ seeds', 7.99, 112, 225, NULL, NULL, NULL, NULL, FALSE),
('Flower Seeds Rose', 'Rose seeds packet with various varieties, easy to grow, excellent quality, 25+ seeds', 12.99, 112, 190, NULL, NULL, NULL, NULL, FALSE),
('Vegetable Seeds Pepper', 'Pepper seeds packet with various varieties, easy to grow, excellent quality, 50+ seeds', 8.99, 112, 215, NULL, NULL, NULL, NULL, FALSE),
('Herb Seeds Rosemary', 'Rosemary seeds packet with various varieties, easy to grow, excellent quality, 50+ seeds', 9.99, 112, 205, NULL, NULL, NULL, NULL, FALSE),
('Flower Seeds Marigold', 'Marigold seeds packet with various varieties, easy to grow, excellent quality, 100+ seeds', 6.99, 112, 235, NULL, NULL, NULL, NULL, FALSE),
('Vegetable Seeds Carrot', 'Carrot seeds packet with various varieties, easy to grow, excellent quality, 200+ seeds', 4.99, 112, 245, NULL, NULL, NULL, NULL, FALSE),
('Herb Seeds Cilantro', 'Cilantro seeds packet with various varieties, easy to grow, excellent quality, 100+ seeds', 7.99, 112, 228, NULL, NULL, NULL, NULL, FALSE),
('Flower Seeds Petunia', 'Petunia seeds packet with various varieties, easy to grow, excellent quality, 100+ seeds', 7.99, 112, 218, NULL, NULL, NULL, NULL, FALSE),
('Vegetable Seeds Cucumber', 'Cucumber seeds packet with various varieties, easy to grow, excellent quality, 50+ seeds', 6.99, 112, 232, NULL, NULL, NULL, NULL, FALSE),
('Herb Seeds Thyme', 'Thyme seeds packet with various varieties, easy to grow, excellent quality, 50+ seeds', 8.99, 112, 212, NULL, NULL, NULL, NULL, FALSE),
('Flower Seeds Zinnia', 'Zinnia seeds packet with various varieties, easy to grow, excellent quality, 100+ seeds', 5.99, 112, 238, NULL, NULL, NULL, NULL, FALSE),
('Vegetable Seeds Bean', 'Bean seeds packet with various varieties, easy to grow, excellent quality, 50+ seeds', 5.99, 112, 242, NULL, NULL, NULL, NULL, FALSE),
('Herb Seeds Oregano', 'Oregano seeds packet with various varieties, easy to grow, excellent quality, 100+ seeds', 8.99, 112, 210, NULL, NULL, NULL, NULL, FALSE),
('Flower Seeds Pansy', 'Pansy seeds packet with various varieties, easy to grow, excellent quality, 50+ seeds', 9.99, 112, 200, NULL, NULL, NULL, NULL, FALSE),
('Vegetable Seeds Radish', 'Radish seeds packet with various varieties, easy to grow, excellent quality, 200+ seeds', 4.99, 112, 248, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 113: Outdoor Furniture (subcategory_id: 23, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Patio Dining Set 4-Person', '4-person patio dining set with table and chairs, weather-resistant, durable, easy assembly', 299.99, 113, 80, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Lounge Chair', 'Outdoor lounge chair with weather-resistant material, comfortable, durable, easy assembly', 149.99, 113, 100, NULL, NULL, NULL, NULL, FALSE),
('Patio Umbrella 9 ft', '9-foot patio umbrella with weather-resistant fabric, adjustable tilt, durable, easy installation', 129.99, 113, 90, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Sofa Set 3-Piece', '3-piece outdoor sofa set with weather-resistant material, comfortable, durable, easy assembly', 499.99, 113, 60, NULL, NULL, NULL, NULL, FALSE),
('Patio Dining Set 6-Person', '6-person patio dining set with table and chairs, weather-resistant, durable, easy assembly', 399.99, 113, 70, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Lounge Chair Premium', 'Premium outdoor lounge chair with weather-resistant material, comfortable, durable, easy assembly', 199.99, 113, 88, NULL, NULL, NULL, NULL, FALSE),
('Patio Umbrella 10 ft', '10-foot patio umbrella with weather-resistant fabric, adjustable tilt, durable, easy installation', 149.99, 113, 85, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Sofa Set 5-Piece', '5-piece outdoor sofa set with weather-resistant material, comfortable, durable, easy assembly', 699.99, 113, 50, NULL, NULL, NULL, NULL, FALSE),
('Patio Dining Set 8-Person', '8-person patio dining set with table and chairs, weather-resistant, durable, easy assembly', 549.99, 113, 58, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Lounge Chair Deluxe', 'Deluxe outdoor lounge chair with weather-resistant material, comfortable, durable, easy assembly', 249.99, 113, 75, NULL, NULL, NULL, NULL, FALSE),
('Patio Umbrella 11 ft', '11-foot patio umbrella with weather-resistant fabric, adjustable tilt, durable, easy installation', 169.99, 113, 82, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Sofa Set 7-Piece', '7-piece outdoor sofa set with weather-resistant material, comfortable, durable, easy assembly', 899.99, 113, 42, NULL, NULL, NULL, NULL, FALSE),
('Patio Dining Set Premium 4-Person', 'Premium 4-person patio dining set with table and chairs, weather-resistant, durable, easy assembly', 399.99, 113, 72, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Lounge Chair Set of 2', 'Set of 2 outdoor lounge chairs with weather-resistant material, comfortable, durable, easy assembly', 279.99, 113, 80, NULL, NULL, NULL, NULL, FALSE),
('Patio Umbrella 12 ft', '12-foot patio umbrella with weather-resistant fabric, adjustable tilt, durable, easy installation', 189.99, 113, 78, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Sofa Set Premium', 'Premium outdoor sofa set with weather-resistant material, comfortable, durable, easy assembly, 3-piece', 599.99, 113, 55, NULL, NULL, NULL, NULL, FALSE),
('Patio Dining Set Premium 6-Person', 'Premium 6-person patio dining set with table and chairs, weather-resistant, durable, easy assembly', 499.99, 113, 65, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Lounge Chair Set of 4', 'Set of 4 outdoor lounge chairs with weather-resistant material, comfortable, durable, easy assembly', 549.99, 113, 68, NULL, NULL, NULL, NULL, FALSE),
('Patio Umbrella Premium', 'Premium patio umbrella with weather-resistant fabric, adjustable tilt, durable, easy installation, 9 ft', 179.99, 113, 84, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Sofa Set Deluxe', 'Deluxe outdoor sofa set with weather-resistant material, comfortable, durable, easy assembly, 5-piece', 799.99, 113, 48, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 114: Lawn Care (subcategory_id: 23, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Lawn Mower Push 21"', '21-inch push lawn mower with adjustable height, easy to use, durable, excellent quality', 199.99, 114, 90, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer 20 lbs', '20-pound lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 29.99, 114, 150, NULL, NULL, NULL, NULL, FALSE),
('Lawn Mower Self-Propelled 22"', '22-inch self-propelled lawn mower with adjustable height, easy to use, durable, excellent quality', 349.99, 114, 75, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer 40 lbs', '40-pound lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 49.99, 114, 130, NULL, NULL, NULL, NULL, FALSE),
('Lawn Mower Electric 20"', '20-inch electric lawn mower with adjustable height, easy to use, durable, excellent quality', 249.99, 114, 85, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer Organic 20 lbs', '20-pound organic lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 39.99, 114, 140, NULL, NULL, NULL, NULL, FALSE),
('Lawn Mower Battery 21"', '21-inch battery-powered lawn mower with adjustable height, easy to use, durable, excellent quality', 299.99, 114, 80, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer Premium 20 lbs', 'Premium 20-pound lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 34.99, 114, 145, NULL, NULL, NULL, NULL, FALSE),
('Lawn Mower Riding 42"', '42-inch riding lawn mower with adjustable height, easy to use, durable, excellent quality', 1999.99, 114, 30, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer Premium 40 lbs', 'Premium 40-pound lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 59.99, 114, 120, NULL, NULL, NULL, NULL, FALSE),
('Lawn Mower Push 20"', '20-inch push lawn mower with adjustable height, easy to use, durable, excellent quality', 179.99, 114, 95, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer Deluxe 20 lbs', 'Deluxe 20-pound lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 44.99, 114, 135, NULL, NULL, NULL, NULL, FALSE),
('Lawn Mower Self-Propelled 21"', '21-inch self-propelled lawn mower with adjustable height, easy to use, durable, excellent quality', 329.99, 114, 78, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer Deluxe 40 lbs', 'Deluxe 40-pound lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 69.99, 114, 115, NULL, NULL, NULL, NULL, FALSE),
('Lawn Mower Electric 21"', '21-inch electric lawn mower with adjustable height, easy to use, durable, excellent quality', 269.99, 114, 82, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer Complete 20 lbs', 'Complete 20-pound lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 54.99, 114, 128, NULL, NULL, NULL, NULL, FALSE),
('Lawn Mower Battery 22"', '22-inch battery-powered lawn mower with adjustable height, easy to use, durable, excellent quality', 319.99, 114, 76, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer Complete 40 lbs', 'Complete 40-pound lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 79.99, 114, 110, NULL, NULL, NULL, NULL, FALSE),
('Lawn Mower Riding 46"', '46-inch riding lawn mower with adjustable height, easy to use, durable, excellent quality', 2299.99, 114, 25, NULL, NULL, NULL, NULL, FALSE),
('Lawn Fertilizer Ultimate 20 lbs', 'Ultimate 20-pound lawn fertilizer with excellent nutrients, easy to apply, promotes healthy growth', 64.99, 114, 125, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 115: Garden Decor (subcategory_id: 23, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Garden Statue Bird', 'Garden bird statue with weather-resistant material, decorative, durable, elegant design', 49.99, 115, 120, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Small', 'Small garden fountain with water pump, weather-resistant, decorative, easy installation', 149.99, 115, 80, NULL, NULL, NULL, NULL, FALSE),
('Garden Statue Angel', 'Garden angel statue with weather-resistant material, decorative, durable, elegant design', 79.99, 115, 100, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Medium', 'Medium garden fountain with water pump, weather-resistant, decorative, easy installation', 199.99, 115, 70, NULL, NULL, NULL, NULL, FALSE),
('Garden Statue Animal', 'Garden animal statue with weather-resistant material, decorative, durable, elegant design', 59.99, 115, 110, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Large', 'Large garden fountain with water pump, weather-resistant, decorative, easy installation', 299.99, 115, 60, NULL, NULL, NULL, NULL, FALSE),
('Garden Statue Gnome', 'Garden gnome statue with weather-resistant material, decorative, durable, elegant design', 39.99, 115, 130, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Premium', 'Premium garden fountain with water pump, weather-resistant, decorative, easy installation, small', 179.99, 115, 75, NULL, NULL, NULL, NULL, FALSE),
('Garden Statue Premium', 'Premium garden statue with weather-resistant material, decorative, durable, elegant design', 99.99, 115, 90, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Deluxe', 'Deluxe garden fountain with water pump, weather-resistant, decorative, easy installation, medium', 249.99, 115, 65, NULL, NULL, NULL, NULL, FALSE),
('Garden Statue Set of 2', 'Set of 2 garden statues with weather-resistant material, decorative, durable, elegant design', 89.99, 115, 105, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Ultimate', 'Ultimate garden fountain with water pump, weather-resistant, decorative, easy installation, large', 349.99, 115, 55, NULL, NULL, NULL, NULL, FALSE),
('Garden Statue Deluxe', 'Deluxe garden statue with weather-resistant material, decorative, durable, elegant design', 119.99, 115, 85, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Complete', 'Complete garden fountain with water pump, weather-resistant, decorative, easy installation, premium', 399.99, 115, 50, NULL, NULL, NULL, NULL, FALSE),
('Garden Statue Ultimate', 'Ultimate garden statue with weather-resistant material, decorative, durable, elegant design', 139.99, 115, 80, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Set of 2', 'Set of 2 garden fountains with water pump, weather-resistant, decorative, easy installation', 279.99, 115, 62, NULL, NULL, NULL, NULL, FALSE),
('Garden Statue Complete', 'Complete garden statue set with weather-resistant material, decorative, durable, elegant design, 3-piece', 159.99, 115, 75, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Set of 3', 'Set of 3 garden fountains with water pump, weather-resistant, decorative, easy installation', 449.99, 115, 48, NULL, NULL, NULL, NULL, FALSE),
('Garden Statue Set of 3', 'Set of 3 garden statues with weather-resistant material, decorative, durable, elegant design', 129.99, 115, 88, NULL, NULL, NULL, NULL, FALSE),
('Garden Fountain Complete Set', 'Complete garden fountain set with water pump, weather-resistant, decorative, easy installation, 2-piece', 329.99, 115, 58, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 116: Power Tools (subcategory_id: 24, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Cordless Drill 20V', '20V cordless drill with battery and charger, excellent power, durable, easy to use', 99.99, 116, 100, NULL, NULL, NULL, NULL, FALSE),
('Circular Saw 7.25"', '7.25-inch circular saw with excellent power, durable, easy to use, versatile', 149.99, 116, 85, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill 18V', '18V cordless drill with battery and charger, excellent power, durable, easy to use', 79.99, 116, 110, NULL, NULL, NULL, NULL, FALSE),
('Circular Saw 6.5"', '6.5-inch circular saw with excellent power, durable, easy to use, versatile', 119.99, 116, 95, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill 12V', '12V cordless drill with battery and charger, excellent power, durable, easy to use', 59.99, 116, 120, NULL, NULL, NULL, NULL, FALSE),
('Circular Saw 8.25"', '8.25-inch circular saw with excellent power, durable, easy to use, versatile', 179.99, 116, 75, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill Set', 'Cordless drill set with battery, charger, and bits, excellent power, durable, easy to use', 129.99, 116, 90, NULL, NULL, NULL, NULL, FALSE),
('Circular Saw Premium', 'Premium circular saw with excellent power, durable, easy to use, versatile, 7.25"', 199.99, 116, 70, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill Premium', 'Premium cordless drill with battery and charger, excellent power, durable, easy to use, 20V', 149.99, 116, 88, NULL, NULL, NULL, NULL, FALSE),
('Circular Saw Deluxe', 'Deluxe circular saw with excellent power, durable, easy to use, versatile, 8.25"', 229.99, 116, 65, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill Deluxe', 'Deluxe cordless drill with battery and charger, excellent power, durable, easy to use, 20V', 179.99, 116, 82, NULL, NULL, NULL, NULL, FALSE),
('Circular Saw Complete', 'Complete circular saw with accessories, excellent power, durable, easy to use, versatile, 7.25"', 249.99, 116, 60, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill Complete', 'Complete cordless drill set with battery, charger, bits, and case, excellent power, durable, 20V', 199.99, 116, 78, NULL, NULL, NULL, NULL, FALSE),
('Circular Saw Ultimate', 'Ultimate circular saw with excellent power, durable, easy to use, versatile, 8.25"', 279.99, 116, 55, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill Ultimate', 'Ultimate cordless drill with battery and charger, excellent power, durable, easy to use, 20V', 229.99, 116, 72, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill Pro', 'Pro cordless drill with battery and charger, excellent power, durable, easy to use, 20V', 159.99, 116, 85, NULL, NULL, NULL, NULL, FALSE),
('Circular Saw Pro', 'Pro circular saw with excellent power, durable, easy to use, versatile, 7.25"', 219.99, 116, 68, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill Elite', 'Elite cordless drill with battery and charger, excellent power, durable, easy to use, 20V', 189.99, 116, 80, NULL, NULL, NULL, NULL, FALSE),
('Circular Saw Elite', 'Elite circular saw with excellent power, durable, easy to use, versatile, 8.25"', 259.99, 116, 62, NULL, NULL, NULL, NULL, FALSE),
('Cordless Drill Professional', 'Professional cordless drill with battery and charger, excellent power, durable, easy to use, 20V', 209.99, 116, 76, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 117: Hand Tools (subcategory_id: 24, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Hammer Claw 16 oz', '16-ounce claw hammer with comfortable grip, durable, versatile, excellent quality', 19.99, 117, 150, NULL, NULL, NULL, NULL, FALSE),
('Screwdriver Set 10-Piece', '10-piece screwdriver set with various sizes, durable, versatile, excellent quality', 24.99, 117, 140, NULL, NULL, NULL, NULL, FALSE),
('Wrench Set 10-Piece', '10-piece wrench set with various sizes, durable, versatile, excellent quality', 34.99, 117, 130, NULL, NULL, NULL, NULL, FALSE),
('Hammer Claw 20 oz', '20-ounce claw hammer with comfortable grip, durable, versatile, excellent quality', 24.99, 117, 145, NULL, NULL, NULL, NULL, FALSE),
('Screwdriver Set 15-Piece', '15-piece screwdriver set with various sizes, durable, versatile, excellent quality', 29.99, 117, 135, NULL, NULL, NULL, NULL, FALSE),
('Wrench Set 15-Piece', '15-piece wrench set with various sizes, durable, versatile, excellent quality', 44.99, 117, 125, NULL, NULL, NULL, NULL, FALSE),
('Hammer Claw 24 oz', '24-ounce claw hammer with comfortable grip, durable, versatile, excellent quality', 29.99, 117, 140, NULL, NULL, NULL, NULL, FALSE),
('Screwdriver Set 20-Piece', '20-piece screwdriver set with various sizes, durable, versatile, excellent quality', 34.99, 117, 130, NULL, NULL, NULL, NULL, FALSE),
('Wrench Set 20-Piece', '20-piece wrench set with various sizes, durable, versatile, excellent quality', 54.99, 117, 120, NULL, NULL, NULL, NULL, FALSE),
('Hammer Ball Peen', 'Ball peen hammer with comfortable grip, durable, versatile, excellent quality, 16 oz', 22.99, 117, 142, NULL, NULL, NULL, NULL, FALSE),
('Screwdriver Set Premium', 'Premium screwdriver set with various sizes, durable, versatile, excellent quality, 10-piece', 39.99, 117, 128, NULL, NULL, NULL, NULL, FALSE),
('Wrench Set Premium', 'Premium wrench set with various sizes, durable, versatile, excellent quality, 10-piece', 49.99, 117, 118, NULL, NULL, NULL, NULL, FALSE),
('Hammer Premium', 'Premium claw hammer with comfortable grip, durable, versatile, excellent quality, 20 oz', 34.99, 117, 138, NULL, NULL, NULL, NULL, FALSE),
('Screwdriver Set Deluxe', 'Deluxe screwdriver set with various sizes, durable, versatile, excellent quality, 15-piece', 44.99, 117, 123, NULL, NULL, NULL, NULL, FALSE),
('Wrench Set Deluxe', 'Deluxe wrench set with various sizes, durable, versatile, excellent quality, 15-piece', 59.99, 117, 113, NULL, NULL, NULL, NULL, FALSE),
('Hammer Deluxe', 'Deluxe claw hammer with comfortable grip, durable, versatile, excellent quality, 24 oz', 39.99, 117, 136, NULL, NULL, NULL, NULL, FALSE),
('Screwdriver Set Ultimate', 'Ultimate screwdriver set with various sizes, durable, versatile, excellent quality, 20-piece', 49.99, 117, 120, NULL, NULL, NULL, NULL, FALSE),
('Wrench Set Ultimate', 'Ultimate wrench set with various sizes, durable, versatile, excellent quality, 20-piece', 64.99, 117, 110, NULL, NULL, NULL, NULL, FALSE),
('Hammer Ultimate', 'Ultimate claw hammer with comfortable grip, durable, versatile, excellent quality, 20 oz', 44.99, 117, 134, NULL, NULL, NULL, NULL, FALSE),
('Tool Set Complete', 'Complete tool set with hammer, screwdrivers, wrenches, durable, versatile, excellent quality, 30-piece', 99.99, 117, 100, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 118: Paint & Supplies (subcategory_id: 24, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Interior Paint 1 Gallon', '1-gallon interior paint with excellent coverage, various colors, easy to apply, durable', 34.99, 118, 150, NULL, NULL, NULL, NULL, FALSE),
('Paint Brush Set 5-Piece', '5-piece paint brush set with various sizes, excellent quality, easy to use, durable', 19.99, 118, 160, NULL, NULL, NULL, NULL, FALSE),
('Paint Roller Set', 'Paint roller set with roller, tray, and cover, excellent quality, easy to use, durable', 24.99, 118, 155, NULL, NULL, NULL, NULL, FALSE),
('Exterior Paint 1 Gallon', '1-gallon exterior paint with excellent coverage, various colors, weather-resistant, durable', 44.99, 118, 140, NULL, NULL, NULL, NULL, FALSE),
('Paint Brush Set 10-Piece', '10-piece paint brush set with various sizes, excellent quality, easy to use, durable', 34.99, 118, 150, NULL, NULL, NULL, NULL, FALSE),
('Paint Roller Set Premium', 'Premium paint roller set with roller, tray, and cover, excellent quality, easy to use, durable', 39.99, 118, 145, NULL, NULL, NULL, NULL, FALSE),
('Interior Paint 5 Gallon', '5-gallon interior paint with excellent coverage, various colors, easy to apply, durable', 149.99, 118, 120, NULL, NULL, NULL, NULL, FALSE),
('Paint Brush Premium', 'Premium paint brush with excellent quality, easy to use, durable, various sizes', 14.99, 118, 165, NULL, NULL, NULL, NULL, FALSE),
('Paint Roller Premium', 'Premium paint roller with excellent quality, easy to use, durable, various sizes', 12.99, 118, 168, NULL, NULL, NULL, NULL, FALSE),
('Exterior Paint 5 Gallon', '5-gallon exterior paint with excellent coverage, various colors, weather-resistant, durable', 199.99, 118, 130, NULL, NULL, NULL, NULL, FALSE),
('Paint Brush Set Deluxe', 'Deluxe paint brush set with various sizes, excellent quality, easy to use, durable, 5-piece', 29.99, 118, 152, NULL, NULL, NULL, NULL, FALSE),
('Paint Roller Set Deluxe', 'Deluxe paint roller set with roller, tray, and cover, excellent quality, easy to use, durable', 44.99, 118, 142, NULL, NULL, NULL, NULL, FALSE),
('Interior Paint Premium', 'Premium interior paint with excellent coverage, various colors, easy to apply, durable, 1 gallon', 49.99, 118, 135, NULL, NULL, NULL, NULL, FALSE),
('Paint Brush Deluxe', 'Deluxe paint brush with excellent quality, easy to use, durable, various sizes', 19.99, 118, 158, NULL, NULL, NULL, NULL, FALSE),
('Paint Roller Deluxe', 'Deluxe paint roller with excellent quality, easy to use, durable, various sizes', 17.99, 118, 162, NULL, NULL, NULL, NULL, FALSE),
('Exterior Paint Premium', 'Premium exterior paint with excellent coverage, various colors, weather-resistant, durable, 1 gallon', 59.99, 118, 125, NULL, NULL, NULL, NULL, FALSE),
('Paint Brush Set Ultimate', 'Ultimate paint brush set with various sizes, excellent quality, easy to use, durable, 10-piece', 39.99, 118, 148, NULL, NULL, NULL, NULL, FALSE),
('Paint Roller Set Ultimate', 'Ultimate paint roller set with roller, tray, and cover, excellent quality, easy to use, durable', 54.99, 118, 138, NULL, NULL, NULL, NULL, FALSE),
('Interior Paint Deluxe', 'Deluxe interior paint with excellent coverage, various colors, easy to apply, durable, 1 gallon', 64.99, 118, 128, NULL, NULL, NULL, NULL, FALSE),
('Exterior Paint Deluxe', 'Deluxe exterior paint with excellent coverage, various colors, weather-resistant, durable, 1 gallon', 74.99, 118, 118, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 119: Hardware & Fasteners (subcategory_id: 24, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Screws Assorted 500-Piece', '500-piece assorted screws with various sizes, excellent quality, durable, versatile', 19.99, 119, 200, NULL, NULL, NULL, NULL, FALSE),
('Nails Assorted 1 lb', '1-pound assorted nails with various sizes, excellent quality, durable, versatile', 9.99, 119, 250, NULL, NULL, NULL, NULL, FALSE),
('Bolts Assorted 200-Piece', '200-piece assorted bolts with various sizes, excellent quality, durable, versatile', 24.99, 119, 180, NULL, NULL, NULL, NULL, FALSE),
('Screws Assorted 1000-Piece', '1000-piece assorted screws with various sizes, excellent quality, durable, versatile', 34.99, 119, 170, NULL, NULL, NULL, NULL, FALSE),
('Nails Assorted 5 lbs', '5-pound assorted nails with various sizes, excellent quality, durable, versatile', 19.99, 119, 220, NULL, NULL, NULL, NULL, FALSE),
('Bolts Assorted 500-Piece', '500-piece assorted bolts with various sizes, excellent quality, durable, versatile', 44.99, 119, 160, NULL, NULL, NULL, NULL, FALSE),
('Screws Assorted 2000-Piece', '2000-piece assorted screws with various sizes, excellent quality, durable, versatile', 59.99, 119, 150, NULL, NULL, NULL, NULL, FALSE),
('Nails Assorted 10 lbs', '10-pound assorted nails with various sizes, excellent quality, durable, versatile', 29.99, 119, 200, NULL, NULL, NULL, NULL, FALSE),
('Bolts Assorted 1000-Piece', '1000-piece assorted bolts with various sizes, excellent quality, durable, versatile', 79.99, 119, 140, NULL, NULL, NULL, NULL, FALSE),
('Screws Premium 500-Piece', 'Premium 500-piece assorted screws with various sizes, excellent quality, durable, versatile', 29.99, 119, 185, NULL, NULL, NULL, NULL, FALSE),
('Nails Premium 1 lb', 'Premium 1-pound assorted nails with various sizes, excellent quality, durable, versatile', 14.99, 119, 235, NULL, NULL, NULL, NULL, FALSE),
('Bolts Premium 200-Piece', 'Premium 200-piece assorted bolts with various sizes, excellent quality, durable, versatile', 34.99, 119, 175, NULL, NULL, NULL, NULL, FALSE),
('Screws Premium 1000-Piece', 'Premium 1000-piece assorted screws with various sizes, excellent quality, durable, versatile', 49.99, 119, 165, NULL, NULL, NULL, NULL, FALSE),
('Nails Premium 5 lbs', 'Premium 5-pound assorted nails with various sizes, excellent quality, durable, versatile', 24.99, 119, 215, NULL, NULL, NULL, NULL, FALSE),
('Bolts Premium 500-Piece', 'Premium 500-piece assorted bolts with various sizes, excellent quality, durable, versatile', 59.99, 119, 155, NULL, NULL, NULL, NULL, FALSE),
('Screws Deluxe 500-Piece', 'Deluxe 500-piece assorted screws with various sizes, excellent quality, durable, versatile', 39.99, 119, 178, NULL, NULL, NULL, NULL, FALSE),
('Nails Deluxe 1 lb', 'Deluxe 1-pound assorted nails with various sizes, excellent quality, durable, versatile', 19.99, 119, 228, NULL, NULL, NULL, NULL, FALSE),
('Bolts Deluxe 200-Piece', 'Deluxe 200-piece assorted bolts with various sizes, excellent quality, durable, versatile', 44.99, 119, 168, NULL, NULL, NULL, NULL, FALSE),
('Screws Deluxe 1000-Piece', 'Deluxe 1000-piece assorted screws with various sizes, excellent quality, durable, versatile', 64.99, 119, 158, NULL, NULL, NULL, NULL, FALSE),
('Nails Deluxe 5 lbs', 'Deluxe 5-pound assorted nails with various sizes, excellent quality, durable, versatile', 29.99, 119, 208, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 120: Storage & Organization (subcategory_id: 24, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Storage Bins Set of 6', 'Set of 6 storage bins with lids, various sizes, stackable, durable, excellent organization', 39.99, 120, 150, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit 5-Tier', '5-tier shelving unit with adjustable shelves, durable, easy assembly, excellent organization', 79.99, 120, 120, NULL, NULL, NULL, NULL, FALSE),
('Storage Bins Set of 12', 'Set of 12 storage bins with lids, various sizes, stackable, durable, excellent organization', 69.99, 120, 140, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit 4-Tier', '4-tier shelving unit with adjustable shelves, durable, easy assembly, excellent organization', 59.99, 120, 130, NULL, NULL, NULL, NULL, FALSE),
('Storage Bins Set of 18', 'Set of 18 storage bins with lids, various sizes, stackable, durable, excellent organization', 99.99, 120, 130, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit 6-Tier', '6-tier shelving unit with adjustable shelves, durable, easy assembly, excellent organization', 99.99, 120, 110, NULL, NULL, NULL, NULL, FALSE),
('Storage Bins Premium Set of 6', 'Premium set of 6 storage bins with lids, various sizes, stackable, durable, excellent organization', 59.99, 120, 145, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit Premium 5-Tier', 'Premium 5-tier shelving unit with adjustable shelves, durable, easy assembly, excellent organization', 119.99, 120, 115, NULL, NULL, NULL, NULL, FALSE),
('Storage Bins Premium Set of 12', 'Premium set of 12 storage bins with lids, various sizes, stackable, durable, excellent organization', 99.99, 120, 135, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit Premium 4-Tier', 'Premium 4-tier shelving unit with adjustable shelves, durable, easy assembly, excellent organization', 89.99, 120, 125, NULL, NULL, NULL, NULL, FALSE),
('Storage Bins Deluxe Set of 6', 'Deluxe set of 6 storage bins with lids, various sizes, stackable, durable, excellent organization', 79.99, 120, 140, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit Deluxe 5-Tier', 'Deluxe 5-tier shelving unit with adjustable shelves, durable, easy assembly, excellent organization', 139.99, 120, 108, NULL, NULL, NULL, NULL, FALSE),
('Storage Bins Deluxe Set of 12', 'Deluxe set of 12 storage bins with lids, various sizes, stackable, durable, excellent organization', 129.99, 120, 128, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit Deluxe 4-Tier', 'Deluxe 4-tier shelving unit with adjustable shelves, durable, easy assembly, excellent organization', 109.99, 120, 118, NULL, NULL, NULL, NULL, FALSE),
('Storage Bins Ultimate Set of 6', 'Ultimate set of 6 storage bins with lids, various sizes, stackable, durable, excellent organization', 99.99, 120, 135, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit Ultimate 5-Tier', 'Ultimate 5-tier shelving unit with adjustable shelves, durable, easy assembly, excellent organization', 159.99, 120, 102, NULL, NULL, NULL, NULL, FALSE),
('Storage Bins Ultimate Set of 12', 'Ultimate set of 12 storage bins with lids, various sizes, stackable, durable, excellent organization', 159.99, 120, 123, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit Ultimate 4-Tier', 'Ultimate 4-tier shelving unit with adjustable shelves, durable, easy assembly, excellent organization', 129.99, 120, 112, NULL, NULL, NULL, NULL, FALSE),
('Storage Bins Complete Set', 'Complete storage bin set with lids, various sizes, stackable, durable, excellent organization, 24-piece', 199.99, 120, 115, NULL, NULL, NULL, NULL, FALSE),
('Shelving Unit Complete', 'Complete shelving unit with adjustable shelves, durable, easy assembly, excellent organization, 7-tier', 179.99, 120, 98, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 121: Bedding Sets (subcategory_id: 25, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Bedding Set Queen 7-Piece', '7-piece queen bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 89.99, 121, 100, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set King 7-Piece', '7-piece king bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 109.99, 121, 90, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Full 7-Piece', '7-piece full bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 79.99, 121, 110, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Twin 7-Piece', '7-piece twin bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 69.99, 121, 120, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Queen 9-Piece', '9-piece queen bedding set with comforter, sheets, pillowcases, shams, excellent quality, comfortable', 119.99, 121, 95, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set King 9-Piece', '9-piece king bedding set with comforter, sheets, pillowcases, shams, excellent quality, comfortable', 139.99, 121, 85, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Full 9-Piece', '9-piece full bedding set with comforter, sheets, pillowcases, shams, excellent quality, comfortable', 109.99, 121, 105, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Twin 9-Piece', '9-piece twin bedding set with comforter, sheets, pillowcases, shams, excellent quality, comfortable', 99.99, 121, 115, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Queen Premium 7-Piece', 'Premium 7-piece queen bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 129.99, 121, 88, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set King Premium 7-Piece', 'Premium 7-piece king bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 149.99, 121, 78, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Full Premium 7-Piece', 'Premium 7-piece full bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 119.99, 121, 98, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Twin Premium 7-Piece', 'Premium 7-piece twin bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 109.99, 121, 108, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Queen Premium 9-Piece', 'Premium 9-piece queen bedding set with comforter, sheets, pillowcases, shams, excellent quality, comfortable', 159.99, 121, 82, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set King Premium 9-Piece', 'Premium 9-piece king bedding set with comforter, sheets, pillowcases, shams, excellent quality, comfortable', 179.99, 121, 72, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Full Premium 9-Piece', 'Premium 9-piece full bedding set with comforter, sheets, pillowcases, shams, excellent quality, comfortable', 149.99, 121, 92, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Twin Premium 9-Piece', 'Premium 9-piece twin bedding set with comforter, sheets, pillowcases, shams, excellent quality, comfortable', 139.99, 121, 102, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Queen Deluxe 7-Piece', 'Deluxe 7-piece queen bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 169.99, 121, 75, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set King Deluxe 7-Piece', 'Deluxe 7-piece king bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 189.99, 121, 65, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Full Deluxe 7-Piece', 'Deluxe 7-piece full bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 159.99, 121, 85, NULL, NULL, NULL, NULL, FALSE),
('Bedding Set Twin Deluxe 7-Piece', 'Deluxe 7-piece twin bedding set with comforter, sheets, pillowcases, excellent quality, comfortable', 149.99, 121, 95, NULL, NULL, NULL, NULL, FALSE);

