-- Product Data for Ecommerce Database
-- This file contains products for child categories 82-91 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 82-91
-- ============================================

-- Child Category 82: Dash Cams (subcategory_id: 17, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Garmin Dash Cam 67W', 'Dash cam with 1440p video, GPS, Wi-Fi, excellent quality, easy installation', 199.99, 82, 90),
('Vantrue N4', 'Dash cam with 4K video, front and rear cameras, GPS, Wi-Fi, excellent quality', 299.99, 82, 75),
('Rexing V1P Pro', 'Dash cam with 1080p video, front and rear cameras, GPS, Wi-Fi, affordable', 129.99, 82, 110),
('Thinkware U1000', 'Dash cam with 4K video, GPS, Wi-Fi, excellent quality, cloud connectivity', 349.99, 82, 65),
('BlackVue DR900X Plus', 'Dash cam with 4K video, GPS, Wi-Fi, excellent quality, cloud connectivity', 399.99, 82, 60),
('Garmin Dash Cam Mini 2', 'Compact dash cam with 1080p video, Wi-Fi, excellent quality, easy installation', 149.99, 82, 100),
('Vantrue N2 Pro', 'Dash cam with 1440p video, front and rear cameras, GPS, Wi-Fi, excellent quality', 249.99, 82, 80),
('Rexing V1', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, affordable', 99.99, 82, 120),
('Thinkware F200 Pro', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 199.99, 82, 85),
('BlackVue DR750X Plus', 'Dash cam with 1440p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 299.99, 82, 70),
('Garmin Dash Cam 57', 'Dash cam with 1440p video, GPS, Wi-Fi, excellent quality, easy installation', 179.99, 82, 95),
('Vantrue X4', 'Dash cam with 4K video, front and rear cameras, GPS, Wi-Fi, excellent quality', 279.99, 82, 78),
('Rexing V1P', 'Dash cam with 1080p video, front and rear cameras, GPS, Wi-Fi, affordable', 119.99, 82, 115),
('Thinkware Q800 Pro', 'Dash cam with 1440p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 249.99, 82, 72),
('BlackVue DR590X', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 199.99, 82, 88),
('Garmin Dash Cam 47', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, easy installation', 159.99, 82, 98),
('Vantrue N1 Pro', 'Dash cam with 1080p video, front and rear cameras, GPS, Wi-Fi, excellent quality', 229.99, 82, 82),
('Rexing V1LG', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, affordable', 89.99, 82, 125),
('Thinkware F800 Pro', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 179.99, 82, 92),
('BlackVue DR650S', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 149.99, 82, 102);

-- Child Category 83: Seat Covers (subcategory_id: 17, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Coverking Custom Seat Covers', 'Custom seat covers with excellent fit, durable material, easy installation, front and rear', 199.99, 83, 100),
('Wet Okole Seat Covers', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 149.99, 83, 110),
('Carhartt SeatSavers', 'Canvas seat covers with excellent fit, durable material, easy installation, front and rear', 89.99, 83, 130),
('Covercraft SeatSavers', 'Custom seat covers with excellent fit, durable material, easy installation, front and rear', 179.99, 83, 105),
('Sheepskin Seat Covers', 'Sheepskin seat covers with excellent comfort, durable material, easy installation, front and rear', 249.99, 83, 85),
('Coverking Neosupreme', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 129.99, 83, 115),
('Wet Okole Premium', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 169.99, 83, 100),
('Carhartt Front Seat Covers', 'Canvas seat covers with excellent fit, durable material, easy installation, front only', 59.99, 83, 140),
('Covercraft Carhartt', 'Canvas seat covers with excellent fit, durable material, easy installation, front and rear', 99.99, 83, 125),
('Sheepskin Front Seat Covers', 'Sheepskin seat covers with excellent comfort, durable material, easy installation, front only', 149.99, 83, 95),
('Coverking Satin Stretch', 'Stretch seat covers with excellent fit, durable material, easy installation, front and rear', 109.99, 83, 120),
('Wet Okole Classic', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 119.99, 83, 112),
('Carhartt Rear Seat Covers', 'Canvas seat covers with excellent fit, durable material, easy installation, rear only', 49.99, 83, 145),
('Covercraft Neosupreme', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 139.99, 83, 108),
('Sheepskin Rear Seat Covers', 'Sheepskin seat covers with excellent comfort, durable material, easy installation, rear only', 119.99, 83, 100),
('Coverking Velour', 'Velour seat covers with excellent fit, comfortable material, easy installation, front and rear', 94.99, 83, 125),
('Wet Okole Deluxe', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 159.99, 83, 102),
('Carhartt Complete Set', 'Canvas seat covers with excellent fit, durable material, easy installation, complete set', 139.99, 83, 118),
('Covercraft Complete Set', 'Custom seat covers with excellent fit, durable material, easy installation, complete set', 219.99, 83, 90),
('Sheepskin Complete Set', 'Sheepskin seat covers with excellent comfort, durable material, easy installation, complete set', 299.99, 83, 80);

-- Child Category 84: Car Organizers (subcategory_id: 17, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('WeatherTech Cargo Liner', 'Cargo organizer with excellent fit, durable material, easy installation, universal fit', 99.99, 84, 120),
('Husky Liners Cargo Liner', 'Cargo organizer with excellent fit, durable material, easy installation, universal fit', 79.99, 84, 130),
('Car Organizer Seat Back', 'Seat back organizer with multiple pockets, durable material, easy installation, universal fit', 24.99, 84, 180),
('Trunk Organizer Storage', 'Trunk organizer with multiple compartments, durable material, collapsible, universal fit', 39.99, 84, 150),
('Car Console Organizer', 'Console organizer with multiple compartments, durable material, easy installation, universal fit', 19.99, 84, 200),
('WeatherTech Cargo Mat', 'Cargo mat with excellent fit, durable material, easy installation, custom fit', 89.99, 84, 125),
('Husky Liners Cargo Mat', 'Cargo mat with excellent fit, durable material, easy installation, universal fit', 69.99, 84, 135),
('Car Organizer Seat Gap', 'Seat gap organizer with storage pockets, durable material, easy installation, universal fit', 14.99, 84, 190),
('Trunk Organizer Box', 'Trunk organizer with multiple compartments, durable material, collapsible, universal fit', 34.99, 84, 160),
('Car Console Tray', 'Console tray with multiple compartments, durable material, easy installation, universal fit', 16.99, 84, 205),
('WeatherTech Cargo Box', 'Cargo box with excellent fit, durable material, easy installation, custom fit', 109.99, 84, 115),
('Husky Liners Cargo Box', 'Cargo box with excellent fit, durable material, easy installation, universal fit', 89.99, 84, 128),
('Car Organizer Headrest', 'Headrest organizer with multiple pockets, durable material, easy installation, universal fit', 21.99, 84, 185),
('Trunk Organizer Bag', 'Trunk organizer bag with multiple compartments, durable material, collapsible, universal fit', 29.99, 84, 170),
('Car Console Divider', 'Console divider with multiple compartments, durable material, easy installation, universal fit', 12.99, 84, 210),
('WeatherTech Cargo Tray', 'Cargo tray with excellent fit, durable material, easy installation, custom fit', 94.99, 84, 122),
('Husky Liners Cargo Tray', 'Cargo tray with excellent fit, durable material, easy installation, universal fit', 74.99, 84, 132),
('Car Organizer Door', 'Door organizer with multiple pockets, durable material, easy installation, universal fit', 18.99, 84, 195),
('Trunk Organizer Net', 'Trunk organizer net with elastic straps, durable material, collapsible, universal fit', 19.99, 84, 188),
('Car Console Insert', 'Console insert with multiple compartments, durable material, easy installation, universal fit', 14.99, 84, 208);

-- Child Category 85: Car Safety (subcategory_id: 17, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('First Aid Kit Car', 'Car first aid kit with comprehensive supplies, excellent organization, compact design', 29.99, 85, 150),
('Emergency Roadside Kit', 'Emergency kit with jumper cables, tire repair, tools, excellent organization, comprehensive', 79.99, 85, 120),
('Jumper Cables Heavy Duty', 'Jumper cables with excellent quality, heavy-duty construction, 20-foot length, 4-gauge', 39.99, 85, 140),
('Tire Repair Kit', 'Tire repair kit with plugs, tools, excellent quality, easy to use, comprehensive', 19.99, 85, 160),
('Emergency Flare Kit', 'Emergency flare kit with flares, reflective triangle, excellent visibility, comprehensive', 24.99, 85, 155),
('First Aid Kit Deluxe', 'Car first aid kit with comprehensive supplies, excellent organization, deluxe design', 49.99, 85, 130),
('Emergency Roadside Kit Pro', 'Emergency kit with jumper cables, tire repair, tools, excellent organization, professional', 119.99, 85, 100),
('Jumper Cables Professional', 'Jumper cables with excellent quality, professional construction, 25-foot length, 2-gauge', 59.99, 85, 125),
('Tire Repair Kit Pro', 'Tire repair kit with plugs, tools, excellent quality, easy to use, professional', 34.99, 85, 145),
('Emergency Flare Kit Deluxe', 'Emergency flare kit with flares, reflective triangle, excellent visibility, deluxe', 39.99, 85, 135),
('First Aid Kit Premium', 'Car first aid kit with comprehensive supplies, excellent organization, premium design', 69.99, 85, 115),
('Emergency Roadside Kit Ultimate', 'Emergency kit with jumper cables, tire repair, tools, excellent organization, ultimate', 149.99, 85, 90),
('Jumper Cables Ultra', 'Jumper cables with excellent quality, ultra construction, 30-foot length, 1-gauge', 79.99, 85, 110),
('Tire Repair Kit Ultimate', 'Tire repair kit with plugs, tools, excellent quality, easy to use, ultimate', 49.99, 85, 128),
('Emergency Flare Kit Premium', 'Emergency flare kit with flares, reflective triangle, excellent visibility, premium', 54.99, 85, 120),
('First Aid Kit Complete', 'Car first aid kit with comprehensive supplies, excellent organization, complete design', 89.99, 85, 105),
('Emergency Roadside Kit Complete', 'Emergency kit with jumper cables, tire repair, tools, excellent organization, complete', 179.99, 85, 80),
('Jumper Cables Complete', 'Jumper cables with excellent quality, complete construction, 35-foot length, 0-gauge', 99.99, 85, 100),
('Tire Repair Kit Complete', 'Tire repair kit with plugs, tools, excellent quality, easy to use, complete', 64.99, 85, 118),
('Emergency Flare Kit Complete', 'Emergency flare kit with flares, reflective triangle, excellent visibility, complete', 69.99, 85, 112);

-- Child Category 86: Car Wash Supplies (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Meguiar\'s Gold Class Car Wash', 'Car wash soap with excellent cleaning, gentle on paint, 64-ounce bottle', 14.99, 86, 200),
('Chemical Guys Mr. Pink', 'Car wash soap with excellent cleaning, pH-balanced, 16-ounce bottle', 19.99, 86, 180),
('Turtle Wax Car Wash', 'Car wash soap with excellent cleaning, affordable, 64-ounce bottle', 9.99, 86, 220),
('Meguiar\'s Wash Mitt', 'Car wash mitt with excellent cleaning, microfiber material, gentle on paint', 12.99, 86, 190),
('Chemical Guys Microfiber Towels', 'Microfiber towels with excellent cleaning, soft material, 6-pack, 16x16 inches', 24.99, 86, 170),
('Turtle Wax Wash Sponge', 'Car wash sponge with excellent cleaning, durable material, gentle on paint', 7.99, 86, 210),
('Meguiar\'s Car Wash Bucket', 'Car wash bucket with grit guard, excellent organization, 5-gallon capacity', 19.99, 86, 185),
('Chemical Guys Wash Pad', 'Car wash pad with excellent cleaning, microfiber material, gentle on paint', 16.99, 86, 195),
('Turtle Wax Wash Mitt', 'Car wash mitt with excellent cleaning, microfiber material, gentle on paint', 10.99, 86, 205),
('Meguiar\'s Microfiber Towels', 'Microfiber towels with excellent cleaning, soft material, 12-pack, 16x16 inches', 29.99, 86, 165),
('Chemical Guys Car Wash Soap', 'Car wash soap with excellent cleaning, pH-balanced, 64-ounce bottle', 17.99, 86, 188),
('Turtle Wax Microfiber Towels', 'Microfiber towels with excellent cleaning, soft material, 4-pack, 16x16 inches', 14.99, 86, 200),
('Meguiar\'s Wash Pad', 'Car wash pad with excellent cleaning, microfiber material, gentle on paint', 14.99, 86, 192),
('Chemical Guys Wash Bucket', 'Car wash bucket with grit guard, excellent organization, 5-gallon capacity', 24.99, 86, 178),
('Turtle Wax Wash Bucket', 'Car wash bucket with grit guard, excellent organization, 5-gallon capacity', 12.99, 86, 208),
('Meguiar\'s Car Wash Complete Kit', 'Car wash kit with soap, mitt, towels, bucket, excellent organization, comprehensive', 49.99, 86, 150),
('Chemical Guys Car Wash Complete Kit', 'Car wash kit with soap, pad, towels, bucket, excellent organization, comprehensive', 59.99, 86, 145),
('Turtle Wax Car Wash Complete Kit', 'Car wash kit with soap, sponge, towels, bucket, excellent organization, comprehensive', 34.99, 86, 175),
('Meguiar\'s Premium Car Wash', 'Premium car wash soap with excellent cleaning, gentle on paint, 128-ounce bottle', 24.99, 86, 180),
('Chemical Guys Premium Car Wash', 'Premium car wash soap with excellent cleaning, pH-balanced, 128-ounce bottle', 29.99, 86, 172);

-- Child Category 87: Wax & Polish (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Meguiar\'s Ultimate Liquid Wax', 'Car wax with excellent protection, easy application, long-lasting shine, 16-ounce bottle', 19.99, 87, 180),
('Chemical Guys Butter Wet Wax', 'Car wax with excellent protection, easy application, wet look shine, 16-ounce bottle', 24.99, 87, 170),
('Turtle Wax Hybrid Solutions', 'Car wax with excellent protection, easy application, ceramic technology, 16-ounce bottle', 16.99, 87, 190),
('Meguiar\'s Ultimate Polish', 'Car polish with excellent shine, easy application, removes swirls, 16-ounce bottle', 17.99, 87, 185),
('Chemical Guys V36 Polish', 'Car polish with excellent shine, easy application, removes swirls, 16-ounce bottle', 22.99, 87, 175),
('Turtle Wax Polish', 'Car polish with excellent shine, easy application, removes swirls, 16-ounce bottle', 12.99, 87, 195),
('Meguiar\'s Ultimate Compound', 'Car compound with excellent cutting, easy application, removes scratches, 16-ounce bottle', 18.99, 87, 182),
('Chemical Guys V34 Compound', 'Car compound with excellent cutting, easy application, removes scratches, 16-ounce bottle', 23.99, 87, 172),
('Turtle Wax Compound', 'Car compound with excellent cutting, easy application, removes scratches, 16-ounce bottle', 13.99, 87, 192),
('Meguiar\'s Ultimate Wax Paste', 'Car wax paste with excellent protection, easy application, long-lasting shine, 11-ounce container', 21.99, 87, 178),
('Chemical Guys Butter Wet Wax Paste', 'Car wax paste with excellent protection, easy application, wet look shine, 11-ounce container', 26.99, 87, 168),
('Turtle Wax Hybrid Solutions Paste', 'Car wax paste with excellent protection, easy application, ceramic technology, 11-ounce container', 18.99, 87, 188),
('Meguiar\'s Ultimate Polish Paste', 'Car polish paste with excellent shine, easy application, removes swirls, 11-ounce container', 19.99, 87, 183),
('Chemical Guys V36 Polish Paste', 'Car polish paste with excellent shine, easy application, removes swirls, 11-ounce container', 24.99, 87, 173),
('Turtle Wax Polish Paste', 'Car polish paste with excellent shine, easy application, removes swirls, 11-ounce container', 14.99, 87, 193),
('Meguiar\'s Ultimate Compound Paste', 'Car compound paste with excellent cutting, easy application, removes scratches, 11-ounce container', 20.99, 87, 180),
('Chemical Guys V34 Compound Paste', 'Car compound paste with excellent cutting, easy application, removes scratches, 11-ounce container', 25.99, 87, 170),
('Turtle Wax Compound Paste', 'Car compound paste with excellent cutting, easy application, removes scratches, 11-ounce container', 15.99, 87, 190),
('Meguiar\'s Ultimate Complete Kit', 'Car wax and polish kit with wax, polish, compound, excellent organization, comprehensive', 54.99, 87, 150),
('Chemical Guys Complete Kit', 'Car wax and polish kit with wax, polish, compound, excellent organization, comprehensive', 64.99, 87, 145);

-- Child Category 88: Engine Maintenance (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Mobil 1 Engine Oil 5W-30', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 29.99, 88, 250),
('Castrol GTX Engine Oil 5W-30', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 19.99, 88, 270),
('Valvoline Engine Oil 5W-30', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 27.99, 88, 255),
('STP Oil Treatment', 'Engine oil treatment with excellent protection, additive, 15-ounce bottle', 8.99, 88, 300),
('Lucas Oil Stabilizer', 'Engine oil stabilizer with excellent protection, additive, 32-ounce bottle', 14.99, 88, 280),
('Mobil 1 Engine Oil 0W-20', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 31.99, 88, 240),
('Castrol GTX Engine Oil 10W-30', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 18.99, 88, 275),
('Valvoline Engine Oil 0W-20', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 29.99, 88, 250),
('STP Fuel Injector Cleaner', 'Fuel injector cleaner with excellent cleaning, additive, 12-ounce bottle', 6.99, 88, 310),
('Lucas Fuel Treatment', 'Fuel treatment with excellent cleaning, additive, 16-ounce bottle', 9.99, 88, 290),
('Mobil 1 Engine Oil 10W-30', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 28.99, 88, 248),
('Castrol GTX Engine Oil 5W-20', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 20.99, 88, 268),
('Valvoline Engine Oil 10W-30', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 26.99, 88, 258),
('STP Engine Flush', 'Engine flush with excellent cleaning, additive, 16-ounce bottle', 7.99, 88, 305),
('Lucas Transmission Fix', 'Transmission treatment with excellent protection, additive, 32-ounce bottle', 16.99, 88, 275),
('Mobil 1 Engine Oil 5W-20', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 30.99, 88, 242),
('Castrol GTX Engine Oil 0W-20', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 21.99, 88, 266),
('Valvoline Engine Oil 5W-20', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 28.99, 88, 252),
('STP Complete Fuel System', 'Fuel system cleaner with excellent cleaning, additive, 20-ounce bottle', 11.99, 88, 295),
('Lucas Complete Engine', 'Engine treatment with excellent protection, additive, 32-ounce bottle', 17.99, 88, 270);

-- Child Category 89: Tire Care (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Meguiar\'s Endurance Tire Gel', 'Tire shine with excellent protection, gel formula, long-lasting shine, 16-ounce bottle', 12.99, 89, 200),
('Chemical Guys Tire Shine', 'Tire shine with excellent protection, spray formula, wet look shine, 16-ounce bottle', 14.99, 89, 190),
('Turtle Wax Tire Shine', 'Tire shine with excellent protection, spray formula, affordable, 16-ounce bottle', 8.99, 89, 220),
('Meguiar\'s Hot Shine Tire Spray', 'Tire shine with excellent protection, spray formula, long-lasting shine, 16-ounce bottle', 11.99, 89, 205),
('Chemical Guys VRP', 'Tire shine with excellent protection, gel formula, wet look shine, 16-ounce bottle', 16.99, 89, 185),
('Turtle Wax Tire Foam', 'Tire shine with excellent protection, foam formula, affordable, 16-ounce bottle', 9.99, 89, 215),
('Meguiar\'s Tire Cleaner', 'Tire cleaner with excellent cleaning, spray formula, easy application, 16-ounce bottle', 10.99, 89, 210),
('Chemical Guys Tire Cleaner', 'Tire cleaner with excellent cleaning, spray formula, easy application, 16-ounce bottle', 13.99, 89, 195),
('Turtle Wax Tire Cleaner', 'Tire cleaner with excellent cleaning, spray formula, affordable, 16-ounce bottle', 7.99, 89, 225),
('Meguiar\'s Tire Dressing', 'Tire dressing with excellent protection, gel formula, long-lasting shine, 16-ounce bottle', 13.99, 89, 198),
('Chemical Guys Tire Dressing', 'Tire dressing with excellent protection, gel formula, wet look shine, 16-ounce bottle', 17.99, 89, 188),
('Turtle Wax Tire Dressing', 'Tire dressing with excellent protection, gel formula, affordable, 16-ounce bottle', 10.99, 89, 218),
('Meguiar\'s Tire Shine Complete', 'Tire care kit with cleaner, shine, excellent organization, comprehensive', 24.99, 89, 175),
('Chemical Guys Tire Care Complete', 'Tire care kit with cleaner, shine, excellent organization, comprehensive', 29.99, 89, 170),
('Turtle Wax Tire Care Complete', 'Tire care kit with cleaner, shine, excellent organization, comprehensive', 18.99, 89, 200),
('Meguiar\'s Tire Shine Premium', 'Premium tire shine with excellent protection, gel formula, long-lasting shine, 32-ounce bottle', 19.99, 89, 180),
('Chemical Guys Tire Shine Premium', 'Premium tire shine with excellent protection, gel formula, wet look shine, 32-ounce bottle', 24.99, 89, 175),
('Turtle Wax Tire Shine Premium', 'Premium tire shine with excellent protection, gel formula, affordable, 32-ounce bottle', 14.99, 89, 205),
('Meguiar\'s Tire Shine Ultimate', 'Ultimate tire shine with excellent protection, gel formula, long-lasting shine, 64-ounce bottle', 34.99, 89, 160),
('Chemical Guys Tire Shine Ultimate', 'Ultimate tire shine with excellent protection, gel formula, wet look shine, 64-ounce bottle', 39.99, 89, 155);

-- Child Category 90: Interior Care (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Meguiar\'s Interior Cleaner', 'Interior cleaner with excellent cleaning, spray formula, safe on all surfaces, 16-ounce bottle', 9.99, 90, 220),
('Chemical Guys Interior Cleaner', 'Interior cleaner with excellent cleaning, spray formula, safe on all surfaces, 16-ounce bottle', 12.99, 90, 200),
('Turtle Wax Interior Cleaner', 'Interior cleaner with excellent cleaning, spray formula, affordable, 16-ounce bottle', 6.99, 90, 240),
('Meguiar\'s Leather Cleaner', 'Leather cleaner with excellent cleaning, spray formula, conditions leather, 16-ounce bottle', 14.99, 90, 190),
('Chemical Guys Leather Cleaner', 'Leather cleaner with excellent cleaning, spray formula, conditions leather, 16-ounce bottle', 17.99, 90, 180),
('Turtle Wax Leather Cleaner', 'Leather cleaner with excellent cleaning, spray formula, affordable, 16-ounce bottle', 9.99, 90, 210),
('Meguiar\'s Dashboard Protectant', 'Dashboard protectant with excellent protection, spray formula, UV protection, 16-ounce bottle', 11.99, 90, 205),
('Chemical Guys Dashboard Protectant', 'Dashboard protectant with excellent protection, spray formula, UV protection, 16-ounce bottle', 14.99, 90, 195),
('Turtle Wax Dashboard Protectant', 'Dashboard protectant with excellent protection, spray formula, affordable, 16-ounce bottle', 7.99, 90, 225),
('Meguiar\'s Carpet Cleaner', 'Carpet cleaner with excellent cleaning, spray formula, removes stains, 16-ounce bottle', 10.99, 90, 215),
('Chemical Guys Carpet Cleaner', 'Carpet cleaner with excellent cleaning, spray formula, removes stains, 16-ounce bottle', 13.99, 90, 200),
('Turtle Wax Carpet Cleaner', 'Carpet cleaner with excellent cleaning, spray formula, affordable, 16-ounce bottle', 8.99, 90, 230),
('Meguiar\'s Interior Complete Kit', 'Interior care kit with cleaner, protectant, excellent organization, comprehensive', 29.99, 90, 180),
('Chemical Guys Interior Complete Kit', 'Interior care kit with cleaner, protectant, excellent organization, comprehensive', 34.99, 90, 175),
('Turtle Wax Interior Complete Kit', 'Interior care kit with cleaner, protectant, excellent organization, comprehensive', 19.99, 90, 200),
('Meguiar\'s Leather Complete Kit', 'Leather care kit with cleaner, conditioner, excellent organization, comprehensive', 24.99, 90, 185),
('Chemical Guys Leather Complete Kit', 'Leather care kit with cleaner, conditioner, excellent organization, comprehensive', 29.99, 90, 180),
('Turtle Wax Leather Complete Kit', 'Leather care kit with cleaner, conditioner, excellent organization, comprehensive', 16.99, 90, 205),
('Meguiar\'s Interior Premium', 'Premium interior cleaner with excellent cleaning, spray formula, safe on all surfaces, 32-ounce bottle', 16.99, 90, 195),
('Chemical Guys Interior Premium', 'Premium interior cleaner with excellent cleaning, spray formula, safe on all surfaces, 32-ounce bottle', 19.99, 90, 188);

