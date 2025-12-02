-- Product Data for Ecommerce Database
-- This file contains products for child categories 102-111 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 102-111
-- ============================================

-- Child Category 102: Bedroom Furniture (subcategory_id: 21, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Platform Bed Frame Queen', 'Queen size platform bed frame with slats, sturdy construction, easy assembly, modern design', 299.99, 102, 60),
('Dresser with Mirror 6-Drawer', '6-drawer dresser with mirror, solid wood construction, spacious storage, elegant design', 449.99, 102, 50),
('Nightstand with Drawer', 'Bedside nightstand with drawer and shelf, solid wood construction, compact design, easy assembly', 129.99, 102, 80),
('Wardrobe Closet 4-Door', '4-door wardrobe closet with shelves and hanging rod, spacious storage, modern design, easy assembly', 599.99, 102, 40),
('Storage Bed Frame Full', 'Full size storage bed frame with drawers, spacious storage, sturdy construction, easy assembly', 399.99, 102, 55),
('Dresser 5-Drawer', '5-drawer dresser with solid wood construction, spacious storage, elegant design, easy assembly', 349.99, 102, 58),
('Nightstand Set of 2', 'Set of 2 bedside nightstands with drawers, solid wood construction, compact design, easy assembly', 229.99, 102, 70),
('Wardrobe Closet 3-Door', '3-door wardrobe closet with shelves and hanging rod, spacious storage, modern design, easy assembly', 499.99, 102, 45),
('Platform Bed Frame King', 'King size platform bed frame with slats, sturdy construction, easy assembly, modern design', 399.99, 102, 52),
('Dresser with Mirror 7-Drawer', '7-drawer dresser with mirror, solid wood construction, spacious storage, elegant design', 499.99, 102, 48),
('Nightstand with 2 Drawers', 'Bedside nightstand with 2 drawers, solid wood construction, compact design, easy assembly', 149.99, 102, 75),
('Wardrobe Closet 5-Door', '5-door wardrobe closet with shelves and hanging rod, spacious storage, modern design, easy assembly', 699.99, 102, 35),
('Storage Bed Frame Queen', 'Queen size storage bed frame with drawers, spacious storage, sturdy construction, easy assembly', 449.99, 102, 50),
('Dresser 4-Drawer', '4-drawer dresser with solid wood construction, spacious storage, elegant design, easy assembly', 299.99, 102, 62),
('Nightstand with Shelf', 'Bedside nightstand with shelf, solid wood construction, compact design, easy assembly', 99.99, 102, 85),
('Wardrobe Closet 2-Door', '2-door wardrobe closet with shelves and hanging rod, spacious storage, modern design, easy assembly', 399.99, 102, 50),
('Platform Bed Frame Full', 'Full size platform bed frame with slats, sturdy construction, easy assembly, modern design', 249.99, 102, 65),
('Dresser with Mirror 8-Drawer', '8-drawer dresser with mirror, solid wood construction, spacious storage, elegant design', 549.99, 102, 42),
('Nightstand Set of 2 Premium', 'Set of 2 bedside nightstands with drawers, solid wood construction, premium design, easy assembly', 279.99, 102, 68),
('Wardrobe Closet 6-Door', '6-door wardrobe closet with shelves and hanging rod, spacious storage, modern design, easy assembly', 799.99, 102, 30);

-- Child Category 103: Dining Room Furniture (subcategory_id: 21, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Dining Table 6-Person', 'Dining table with 6-person capacity, solid wood construction, elegant design, easy assembly', 499.99, 103, 55),
('Dining Chairs Set of 4', 'Set of 4 dining chairs with upholstered seats, sturdy construction, comfortable, easy assembly', 299.99, 103, 70),
('Dining Table 8-Person', 'Dining table with 8-person capacity, solid wood construction, elegant design, easy assembly', 699.99, 103, 45),
('Dining Chairs Set of 6', 'Set of 6 dining chairs with upholstered seats, sturdy construction, comfortable, easy assembly', 449.99, 103, 60),
('Dining Table Extendable', 'Extendable dining table with 6-10 person capacity, solid wood construction, elegant design', 799.99, 103, 40),
('Dining Chairs Set of 8', 'Set of 8 dining chairs with upholstered seats, sturdy construction, comfortable, easy assembly', 599.99, 103, 50),
('Dining Table 4-Person', 'Dining table with 4-person capacity, solid wood construction, elegant design, easy assembly', 349.99, 103, 65),
('Dining Chairs Set of 2', 'Set of 2 dining chairs with upholstered seats, sturdy construction, comfortable, easy assembly', 149.99, 103, 80),
('Dining Table Round', 'Round dining table with 6-person capacity, solid wood construction, elegant design, easy assembly', 449.99, 103, 58),
('Dining Chairs Armchair', 'Dining armchairs with upholstered seats, sturdy construction, comfortable, easy assembly, set of 2', 199.99, 103, 72),
('Dining Table Rectangular', 'Rectangular dining table with 8-person capacity, solid wood construction, elegant design, easy assembly', 599.99, 103, 48),
('Dining Chairs Side Chair', 'Dining side chairs with upholstered seats, sturdy construction, comfortable, easy assembly, set of 4', 249.99, 103, 68),
('Dining Table Square', 'Square dining table with 4-person capacity, solid wood construction, elegant design, easy assembly', 399.99, 103, 62),
('Dining Chairs Bench', 'Dining bench with upholstered seat, sturdy construction, comfortable, easy assembly, seats 3', 179.99, 103, 75),
('Dining Table Oval', 'Oval dining table with 6-person capacity, solid wood construction, elegant design, easy assembly', 549.99, 103, 52),
('Dining Chairs Set of 4 Premium', 'Set of 4 premium dining chairs with upholstered seats, sturdy construction, comfortable, easy assembly', 349.99, 103, 64),
('Dining Table 10-Person', 'Dining table with 10-person capacity, solid wood construction, elegant design, easy assembly', 899.99, 103, 38),
('Dining Chairs Set of 6 Premium', 'Set of 6 premium dining chairs with upholstered seats, sturdy construction, comfortable, easy assembly', 499.99, 103, 56),
('Dining Table Extendable Premium', 'Extendable dining table with 8-12 person capacity, solid wood construction, elegant design', 999.99, 103, 35),
('Dining Chairs Set of 8 Premium', 'Set of 8 premium dining chairs with upholstered seats, sturdy construction, comfortable, easy assembly', 699.99, 103, 46);

-- Child Category 104: Home Decor (subcategory_id: 21, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Wall Art Canvas Print', 'Canvas wall art print with modern design, ready to hang, various sizes, excellent quality', 49.99, 104, 120),
('Decorative Vase Set of 3', 'Set of 3 decorative vases with modern design, various sizes, excellent quality, versatile', 39.99, 104, 140),
('Scented Candles Set', 'Set of 3 scented candles with various fragrances, long-lasting, excellent quality, decorative', 24.99, 104, 160),
('Wall Mirror Decorative', 'Decorative wall mirror with modern frame, various sizes, excellent quality, easy installation', 79.99, 104, 100),
('Throw Pillows Set of 4', 'Set of 4 decorative throw pillows with various designs, comfortable, excellent quality', 59.99, 104, 130),
('Wall Art Framed Print', 'Framed wall art print with modern design, ready to hang, various sizes, excellent quality', 69.99, 104, 110),
('Decorative Vase Large', 'Large decorative vase with modern design, excellent quality, versatile, elegant', 54.99, 104, 125),
('Scented Candles Premium', 'Premium scented candles with various fragrances, long-lasting, excellent quality, decorative, set of 2', 34.99, 104, 150),
('Wall Mirror Round', 'Round decorative wall mirror with modern frame, various sizes, excellent quality, easy installation', 89.99, 104, 95),
('Throw Pillows Set of 6', 'Set of 6 decorative throw pillows with various designs, comfortable, excellent quality', 79.99, 104, 120),
('Wall Art Metal Print', 'Metal wall art print with modern design, ready to hang, various sizes, excellent quality', 99.99, 104, 105),
('Decorative Vase Set of 2', 'Set of 2 decorative vases with modern design, various sizes, excellent quality, versatile', 29.99, 104, 145),
('Scented Candles Luxury', 'Luxury scented candles with various fragrances, long-lasting, excellent quality, decorative, set of 4', 49.99, 104, 135),
('Wall Mirror Rectangular', 'Rectangular decorative wall mirror with modern frame, various sizes, excellent quality, easy installation', 94.99, 104, 90),
('Throw Pillows Set of 8', 'Set of 8 decorative throw pillows with various designs, comfortable, excellent quality', 99.99, 104, 115),
('Wall Art Wood Print', 'Wood wall art print with modern design, ready to hang, various sizes, excellent quality', 119.99, 104, 100),
('Decorative Vase Medium', 'Medium decorative vase with modern design, excellent quality, versatile, elegant', 44.99, 104, 130),
('Scented Candles Deluxe', 'Deluxe scented candles with various fragrances, long-lasting, excellent quality, decorative, set of 6', 64.99, 104, 128),
('Wall Mirror Square', 'Square decorative wall mirror with modern frame, various sizes, excellent quality, easy installation', 84.99, 104, 98),
('Throw Pillows Premium Set', 'Premium set of decorative throw pillows with various designs, comfortable, excellent quality, set of 4', 89.99, 104, 122);

-- Child Category 105: Lighting (subcategory_id: 21, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Table Lamp LED', 'LED table lamp with adjustable brightness, modern design, energy-efficient, easy installation', 39.99, 105, 130),
('Floor Lamp Standing', 'Standing floor lamp with adjustable height, modern design, energy-efficient, easy installation', 79.99, 105, 100),
('Ceiling Light Fixture', 'Ceiling light fixture with modern design, energy-efficient, easy installation, various sizes', 99.99, 105, 90),
('Desk Lamp LED', 'LED desk lamp with adjustable brightness and angle, modern design, energy-efficient, easy installation', 49.99, 105, 120),
('Pendant Light Fixture', 'Pendant light fixture with modern design, energy-efficient, easy installation, various sizes', 119.99, 105, 85),
('Table Lamp Traditional', 'Traditional table lamp with classic design, energy-efficient, easy installation, elegant', 54.99, 105, 115),
('Floor Lamp Arc', 'Arc floor lamp with adjustable height, modern design, energy-efficient, easy installation', 89.99, 105, 95),
('Ceiling Light Chandelier', 'Chandelier ceiling light with elegant design, energy-efficient, easy installation, various sizes', 199.99, 105, 70),
('Desk Lamp Traditional', 'Traditional desk lamp with adjustable brightness and angle, classic design, energy-efficient, easy installation', 44.99, 105, 125),
('Pendant Light Set of 3', 'Set of 3 pendant lights with modern design, energy-efficient, easy installation, various sizes', 149.99, 105, 80),
('Table Lamp Modern', 'Modern table lamp with sleek design, energy-efficient, easy installation, elegant', 59.99, 105, 112),
('Floor Lamp Tripod', 'Tripod floor lamp with adjustable height, modern design, energy-efficient, easy installation', 94.99, 105, 92),
('Ceiling Light Flush Mount', 'Flush mount ceiling light with modern design, energy-efficient, easy installation, various sizes', 84.99, 105, 98),
('Desk Lamp Modern', 'Modern desk lamp with adjustable brightness and angle, sleek design, energy-efficient, easy installation', 54.99, 105, 118),
('Pendant Light Industrial', 'Industrial pendant light with modern design, energy-efficient, easy installation, various sizes', 129.99, 105, 88),
('Table Lamp Vintage', 'Vintage table lamp with classic design, energy-efficient, easy installation, elegant', 64.99, 105, 110),
('Floor Lamp Modern', 'Modern floor lamp with adjustable height, sleek design, energy-efficient, easy installation', 99.99, 105, 90),
('Ceiling Light Semi-Flush', 'Semi-flush ceiling light with modern design, energy-efficient, easy installation, various sizes', 109.99, 105, 86),
('Desk Lamp Vintage', 'Vintage desk lamp with adjustable brightness and angle, classic design, energy-efficient, easy installation', 49.99, 105, 122),
('Pendant Light Modern', 'Modern pendant light with sleek design, energy-efficient, easy installation, various sizes', 139.99, 105, 83);

-- Child Category 106: Kitchen Appliances (subcategory_id: 22, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Refrigerator 18 cu ft', '18 cubic foot refrigerator with freezer, energy-efficient, spacious storage, modern design', 699.99, 106, 50),
('Electric Range 30"', '30-inch electric range with 4 burners and oven, energy-efficient, easy to use, modern design', 599.99, 106, 55),
('Microwave Oven 1.2 cu ft', '1.2 cubic foot microwave oven with various cooking modes, energy-efficient, easy to use, modern design', 149.99, 106, 80),
('Dishwasher 24"', '24-inch dishwasher with various wash cycles, energy-efficient, quiet operation, modern design', 549.99, 106, 60),
('Refrigerator 20 cu ft', '20 cubic foot refrigerator with freezer, energy-efficient, spacious storage, modern design', 799.99, 106, 48),
('Electric Range 36"', '36-inch electric range with 5 burners and oven, energy-efficient, easy to use, modern design', 699.99, 106, 52),
('Microwave Oven 1.5 cu ft', '1.5 cubic foot microwave oven with various cooking modes, energy-efficient, easy to use, modern design', 179.99, 106, 75),
('Dishwasher 18"', '18-inch dishwasher with various wash cycles, energy-efficient, quiet operation, modern design', 449.99, 106, 65),
('Refrigerator 22 cu ft', '22 cubic foot refrigerator with freezer, energy-efficient, spacious storage, modern design', 899.99, 106, 45),
('Gas Range 30"', '30-inch gas range with 4 burners and oven, energy-efficient, easy to use, modern design', 649.99, 106, 53),
('Microwave Oven 2.0 cu ft', '2.0 cubic foot microwave oven with various cooking modes, energy-efficient, easy to use, modern design', 199.99, 106, 72),
('Dishwasher Portable', 'Portable dishwasher with various wash cycles, energy-efficient, quiet operation, modern design', 399.99, 106, 68),
('Refrigerator 24 cu ft', '24 cubic foot refrigerator with freezer, energy-efficient, spacious storage, modern design', 999.99, 106, 42),
('Gas Range 36"', '36-inch gas range with 5 burners and oven, energy-efficient, easy to use, modern design', 749.99, 106, 50),
('Microwave Oven Built-in', 'Built-in microwave oven with various cooking modes, energy-efficient, easy to use, modern design', 299.99, 106, 70),
('Dishwasher Drawer', 'Drawer dishwasher with various wash cycles, energy-efficient, quiet operation, modern design', 599.99, 106, 58),
('Refrigerator French Door', 'French door refrigerator with freezer, energy-efficient, spacious storage, modern design, 25 cu ft', 1199.99, 106, 40),
('Induction Range 30"', '30-inch induction range with 4 burners and oven, energy-efficient, easy to use, modern design', 799.99, 106, 47),
('Microwave Oven Convection', 'Convection microwave oven with various cooking modes, energy-efficient, easy to use, modern design', 249.99, 106, 73),
('Dishwasher Countertop', 'Countertop dishwasher with various wash cycles, energy-efficient, quiet operation, modern design', 349.99, 106, 70);

-- Child Category 107: Cookware & Bakeware (subcategory_id: 22, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Non-Stick Cookware Set 10-Piece', '10-piece non-stick cookware set with pots and pans, excellent quality, easy to clean, durable', 149.99, 107, 100),
('Stainless Steel Cookware Set 12-Piece', '12-piece stainless steel cookware set with pots and pans, excellent quality, durable, easy to clean', 199.99, 107, 90),
('Baking Sheet Set of 3', 'Set of 3 baking sheets with non-stick coating, excellent quality, easy to clean, various sizes', 39.99, 107, 150),
('Cast Iron Skillet 10"', '10-inch cast iron skillet with excellent heat retention, durable, easy to clean, versatile', 49.99, 107, 120),
('Ceramic Cookware Set 8-Piece', '8-piece ceramic cookware set with pots and pans, excellent quality, easy to clean, durable', 129.99, 107, 105),
('Non-Stick Frying Pan Set of 3', 'Set of 3 non-stick frying pans with various sizes, excellent quality, easy to clean, durable', 79.99, 107, 110),
('Stainless Steel Saucepan Set of 3', 'Set of 3 stainless steel saucepans with various sizes, excellent quality, durable, easy to clean', 89.99, 107, 108),
('Baking Dish Set of 4', 'Set of 4 baking dishes with various sizes, excellent quality, easy to clean, versatile', 49.99, 107, 130),
('Cast Iron Dutch Oven 6 qt', '6-quart cast iron Dutch oven with excellent heat retention, durable, easy to clean, versatile', 99.99, 107, 95),
('Ceramic Frying Pan Set of 2', 'Set of 2 ceramic frying pans with various sizes, excellent quality, easy to clean, durable', 59.99, 107, 115),
('Non-Stick Cookware Set 14-Piece', '14-piece non-stick cookware set with pots and pans, excellent quality, easy to clean, durable', 179.99, 107, 88),
('Stainless Steel Cookware Set 15-Piece', '15-piece stainless steel cookware set with pots and pans, excellent quality, durable, easy to clean', 229.99, 107, 82),
('Baking Sheet Set of 5', 'Set of 5 baking sheets with non-stick coating, excellent quality, easy to clean, various sizes', 59.99, 107, 140),
('Cast Iron Skillet 12"', '12-inch cast iron skillet with excellent heat retention, durable, easy to clean, versatile', 59.99, 107, 112),
('Ceramic Cookware Set 10-Piece', '10-piece ceramic cookware set with pots and pans, excellent quality, easy to clean, durable', 149.99, 107, 98),
('Non-Stick Frying Pan Set of 4', 'Set of 4 non-stick frying pans with various sizes, excellent quality, easy to clean, durable', 99.99, 107, 102),
('Stainless Steel Saucepan Set of 4', 'Set of 4 stainless steel saucepans with various sizes, excellent quality, durable, easy to clean', 109.99, 107, 100),
('Baking Dish Set of 6', 'Set of 6 baking dishes with various sizes, excellent quality, easy to clean, versatile', 69.99, 107, 125),
('Cast Iron Dutch Oven 8 qt', '8-quart cast iron Dutch oven with excellent heat retention, durable, easy to clean, versatile', 119.99, 107, 90),
('Ceramic Frying Pan Set of 3', 'Set of 3 ceramic frying pans with various sizes, excellent quality, easy to clean, durable', 79.99, 107, 108);

-- Child Category 108: Dinnerware & Serveware (subcategory_id: 22, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Dinnerware Set 16-Piece', '16-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 79.99, 108, 120),
('Serving Platter Set of 3', 'Set of 3 serving platters with various sizes, excellent quality, dishwasher safe, elegant', 49.99, 108, 140),
('Dinnerware Set 20-Piece', '20-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 99.99, 108, 110),
('Serving Bowl Set of 4', 'Set of 4 serving bowls with various sizes, excellent quality, dishwasher safe, elegant', 39.99, 108, 150),
('Dinnerware Set 32-Piece', '32-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 149.99, 108, 100),
('Serving Platter Large', 'Large serving platter with excellent quality, dishwasher safe, elegant, versatile', 34.99, 108, 145),
('Dinnerware Set 40-Piece', '40-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 179.99, 108, 95),
('Serving Bowl Set of 6', 'Set of 6 serving bowls with various sizes, excellent quality, dishwasher safe, elegant', 59.99, 108, 135),
('Dinnerware Set Premium 16-Piece', 'Premium 16-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 119.99, 108, 105),
('Serving Platter Set of 4', 'Set of 4 serving platters with various sizes, excellent quality, dishwasher safe, elegant', 69.99, 108, 130),
('Dinnerware Set Premium 20-Piece', 'Premium 20-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 139.99, 108, 102),
('Serving Bowl Large', 'Large serving bowl with excellent quality, dishwasher safe, elegant, versatile', 44.99, 108, 142),
('Dinnerware Set Premium 32-Piece', 'Premium 32-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 199.99, 108, 92),
('Serving Platter Premium', 'Premium serving platter with excellent quality, dishwasher safe, elegant, versatile', 54.99, 108, 138),
('Dinnerware Set Premium 40-Piece', 'Premium 40-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 229.99, 108, 88),
('Serving Bowl Set of 8', 'Set of 8 serving bowls with various sizes, excellent quality, dishwasher safe, elegant', 79.99, 108, 128),
('Dinnerware Set Deluxe 16-Piece', 'Deluxe 16-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 149.99, 108, 98),
('Serving Platter Deluxe', 'Deluxe serving platter with excellent quality, dishwasher safe, elegant, versatile', 64.99, 108, 136),
('Dinnerware Set Deluxe 20-Piece', 'Deluxe 20-piece dinnerware set with plates, bowls, and mugs, excellent quality, dishwasher safe, durable', 169.99, 108, 96),
('Serving Bowl Deluxe', 'Deluxe serving bowl with excellent quality, dishwasher safe, elegant, versatile', 49.99, 108, 140);

-- Child Category 109: Kitchen Tools & Gadgets (subcategory_id: 22, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Kitchen Utensil Set 15-Piece', '15-piece kitchen utensil set with various tools, excellent quality, dishwasher safe, durable', 39.99, 109, 150),
('Cutting Board Set of 3', 'Set of 3 cutting boards with various sizes, excellent quality, easy to clean, durable', 29.99, 109, 160),
('Kitchen Knife Set 8-Piece', '8-piece kitchen knife set with various knives, excellent quality, sharp, durable', 89.99, 109, 120),
('Kitchen Utensil Set 20-Piece', '20-piece kitchen utensil set with various tools, excellent quality, dishwasher safe, durable', 49.99, 109, 145),
('Cutting Board Large', 'Large cutting board with excellent quality, easy to clean, durable, versatile', 24.99, 109, 165),
('Kitchen Knife Set 12-Piece', '12-piece kitchen knife set with various knives, excellent quality, sharp, durable', 119.99, 109, 110),
('Kitchen Utensil Set 25-Piece', '25-piece kitchen utensil set with various tools, excellent quality, dishwasher safe, durable', 59.99, 109, 140),
('Cutting Board Set of 4', 'Set of 4 cutting boards with various sizes, excellent quality, easy to clean, durable', 39.99, 109, 155),
('Kitchen Knife Set 15-Piece', '15-piece kitchen knife set with various knives, excellent quality, sharp, durable', 149.99, 109, 105),
('Kitchen Utensil Set Premium 15-Piece', 'Premium 15-piece kitchen utensil set with various tools, excellent quality, dishwasher safe, durable', 59.99, 109, 138),
('Cutting Board Premium', 'Premium cutting board with excellent quality, easy to clean, durable, versatile', 34.99, 109, 162),
('Kitchen Knife Set Premium 8-Piece', 'Premium 8-piece kitchen knife set with various knives, excellent quality, sharp, durable', 129.99, 109, 115),
('Kitchen Utensil Set Premium 20-Piece', 'Premium 20-piece kitchen utensil set with various tools, excellent quality, dishwasher safe, durable', 69.99, 109, 133),
('Cutting Board Set Premium', 'Premium set of cutting boards with various sizes, excellent quality, easy to clean, durable', 49.99, 109, 150),
('Kitchen Knife Set Premium 12-Piece', 'Premium 12-piece kitchen knife set with various knives, excellent quality, sharp, durable', 159.99, 109, 100),
('Kitchen Utensil Set Deluxe 15-Piece', 'Deluxe 15-piece kitchen utensil set with various tools, excellent quality, dishwasher safe, durable', 79.99, 109, 128),
('Cutting Board Deluxe', 'Deluxe cutting board with excellent quality, easy to clean, durable, versatile', 44.99, 109, 158),
('Kitchen Knife Set Deluxe 8-Piece', 'Deluxe 8-piece kitchen knife set with various knives, excellent quality, sharp, durable', 139.99, 109, 108),
('Kitchen Utensil Set Deluxe 20-Piece', 'Deluxe 20-piece kitchen utensil set with various tools, excellent quality, dishwasher safe, durable', 89.99, 109, 125),
('Cutting Board Set Deluxe', 'Deluxe set of cutting boards with various sizes, excellent quality, easy to clean, durable', 59.99, 109, 145);

-- Child Category 110: Small Appliances (subcategory_id: 22, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Coffee Maker Drip', 'Drip coffee maker with 12-cup capacity, programmable, easy to use, excellent quality', 79.99, 110, 100),
('Blender 48 oz', '48-ounce blender with various speeds, easy to use, excellent quality, durable', 59.99, 110, 110),
('Toaster 2-Slice', '2-slice toaster with various settings, easy to use, excellent quality, durable', 39.99, 110, 130),
('Coffee Maker Single Serve', 'Single serve coffee maker with various cup sizes, easy to use, excellent quality', 99.99, 110, 95),
('Blender 64 oz', '64-ounce blender with various speeds, easy to use, excellent quality, durable', 79.99, 110, 105),
('Toaster 4-Slice', '4-slice toaster with various settings, easy to use, excellent quality, durable', 59.99, 110, 120),
('Coffee Maker Espresso', 'Espresso coffee maker with various settings, easy to use, excellent quality', 149.99, 110, 85),
('Blender Professional', 'Professional blender with various speeds, easy to use, excellent quality, durable', 129.99, 110, 90),
('Toaster Oven', 'Toaster oven with various settings, easy to use, excellent quality, durable', 89.99, 110, 100),
('Coffee Maker French Press', 'French press coffee maker with various sizes, easy to use, excellent quality', 34.99, 110, 140),
('Blender Personal', 'Personal blender with various speeds, easy to use, excellent quality, durable', 49.99, 110, 115),
('Toaster Convection', 'Convection toaster with various settings, easy to use, excellent quality, durable', 109.99, 110, 92),
('Coffee Maker Cold Brew', 'Cold brew coffee maker with various sizes, easy to use, excellent quality', 44.99, 110, 135),
('Blender Immersion', 'Immersion blender with various speeds, easy to use, excellent quality, durable', 39.99, 110, 125),
('Toaster Air Fryer', 'Air fryer toaster with various settings, easy to use, excellent quality, durable', 119.99, 110, 88),
('Coffee Maker Premium', 'Premium drip coffee maker with 12-cup capacity, programmable, easy to use, excellent quality', 129.99, 110, 82),
('Blender Premium', 'Premium blender with various speeds, easy to use, excellent quality, durable', 149.99, 110, 80),
('Toaster Premium', 'Premium toaster with various settings, easy to use, excellent quality, durable', 79.99, 110, 98),
('Coffee Maker Deluxe', 'Deluxe drip coffee maker with 12-cup capacity, programmable, easy to use, excellent quality', 159.99, 110, 78),
('Blender Deluxe', 'Deluxe blender with various speeds, easy to use, excellent quality, durable', 179.99, 110, 75);

-- Child Category 111: Garden Tools (subcategory_id: 23, category_id: 5)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Garden Shovel', 'Garden shovel with sturdy construction, comfortable grip, durable, versatile', 24.99, 111, 150),
('Garden Rake', 'Garden rake with sturdy construction, comfortable grip, durable, versatile', 19.99, 111, 160),
('Pruning Shears', 'Pruning shears with sharp blades, comfortable grip, durable, easy to use', 29.99, 111, 140),
('Garden Trowel', 'Garden trowel with sturdy construction, comfortable grip, durable, versatile', 12.99, 111, 170),
('Garden Hoe', 'Garden hoe with sturdy construction, comfortable grip, durable, versatile', 22.99, 111, 155),
('Garden Fork', 'Garden fork with sturdy construction, comfortable grip, durable, versatile', 27.99, 111, 145),
('Pruning Saw', 'Pruning saw with sharp blade, comfortable grip, durable, easy to use', 34.99, 111, 135),
('Garden Spade', 'Garden spade with sturdy construction, comfortable grip, durable, versatile', 26.99, 111, 148),
('Garden Cultivator', 'Garden cultivator with sturdy construction, comfortable grip, durable, versatile', 18.99, 111, 162),
('Pruning Loppers', 'Pruning loppers with sharp blades, comfortable grip, durable, easy to use', 39.99, 111, 130),
('Garden Shovel Premium', 'Premium garden shovel with sturdy construction, comfortable grip, durable, versatile', 34.99, 111, 142),
('Garden Rake Premium', 'Premium garden rake with sturdy construction, comfortable grip, durable, versatile', 29.99, 111, 152),
('Pruning Shears Premium', 'Premium pruning shears with sharp blades, comfortable grip, durable, easy to use', 44.99, 111, 132),
('Garden Trowel Premium', 'Premium garden trowel with sturdy construction, comfortable grip, durable, versatile', 19.99, 111, 165),
('Garden Hoe Premium', 'Premium garden hoe with sturdy construction, comfortable grip, durable, versatile', 32.99, 111, 150),
('Garden Fork Premium', 'Premium garden fork with sturdy construction, comfortable grip, durable, versatile', 37.99, 111, 140),
('Pruning Saw Premium', 'Premium pruning saw with sharp blade, comfortable grip, durable, easy to use', 49.99, 111, 128),
('Garden Spade Premium', 'Premium garden spade with sturdy construction, comfortable grip, durable, versatile', 36.99, 111, 143),
('Garden Cultivator Premium', 'Premium garden cultivator with sturdy construction, comfortable grip, durable, versatile', 28.99, 111, 157),
('Pruning Loppers Premium', 'Premium pruning loppers with sharp blades, comfortable grip, durable, easy to use', 54.99, 111, 125);

