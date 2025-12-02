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
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Garmin Dash Cam 67W', 'Dash cam with 1440p video, GPS, Wi-Fi, excellent quality, easy installation', 199.99, 82, 90, NULL, NULL, NULL, NULL, FALSE),
('Vantrue N4', 'Dash cam with 4K video, front and rear cameras, GPS, Wi-Fi, excellent quality', 299.99, 82, 75, NULL, NULL, NULL, NULL, FALSE),
('Rexing V1P Pro', 'Dash cam with 1080p video, front and rear cameras, GPS, Wi-Fi, affordable', 129.99, 82, 110, NULL, NULL, NULL, NULL, FALSE),
('Thinkware U1000', 'Dash cam with 4K video, GPS, Wi-Fi, excellent quality, cloud connectivity', 349.99, 82, 65, NULL, NULL, NULL, NULL, FALSE),
('BlackVue DR900X Plus', 'Dash cam with 4K video, GPS, Wi-Fi, excellent quality, cloud connectivity', 399.99, 82, 60, NULL, NULL, NULL, NULL, FALSE),
('Garmin Dash Cam Mini 2', 'Compact dash cam with 1080p video, Wi-Fi, excellent quality, easy installation', 149.99, 82, 100, NULL, NULL, NULL, NULL, FALSE),
('Vantrue N2 Pro', 'Dash cam with 1440p video, front and rear cameras, GPS, Wi-Fi, excellent quality', 249.99, 82, 80, NULL, NULL, NULL, NULL, FALSE),
('Rexing V1', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, affordable', 99.99, 82, 120, NULL, NULL, NULL, NULL, FALSE),
('Thinkware F200 Pro', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 199.99, 82, 85, NULL, NULL, NULL, NULL, FALSE),
('BlackVue DR750X Plus', 'Dash cam with 1440p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 299.99, 82, 70, NULL, NULL, NULL, NULL, FALSE),
('Garmin Dash Cam 57', 'Dash cam with 1440p video, GPS, Wi-Fi, excellent quality, easy installation', 179.99, 82, 95, NULL, NULL, NULL, NULL, FALSE),
('Vantrue X4', 'Dash cam with 4K video, front and rear cameras, GPS, Wi-Fi, excellent quality', 279.99, 82, 78, NULL, NULL, NULL, NULL, FALSE),
('Rexing V1P', 'Dash cam with 1080p video, front and rear cameras, GPS, Wi-Fi, affordable', 119.99, 82, 115, NULL, NULL, NULL, NULL, FALSE),
('Thinkware Q800 Pro', 'Dash cam with 1440p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 249.99, 82, 72, NULL, NULL, NULL, NULL, FALSE),
('BlackVue DR590X', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 199.99, 82, 88, NULL, NULL, NULL, NULL, FALSE),
('Garmin Dash Cam 47', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, easy installation', 159.99, 82, 98, NULL, NULL, NULL, NULL, FALSE),
('Vantrue N1 Pro', 'Dash cam with 1080p video, front and rear cameras, GPS, Wi-Fi, excellent quality', 229.99, 82, 82, NULL, NULL, NULL, NULL, FALSE),
('Rexing V1LG', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, affordable', 89.99, 82, 125, NULL, NULL, NULL, NULL, FALSE),
('Thinkware F800 Pro', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 179.99, 82, 92, NULL, NULL, NULL, NULL, FALSE),
('BlackVue DR650S', 'Dash cam with 1080p video, GPS, Wi-Fi, excellent quality, cloud connectivity', 149.99, 82, 102, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 83: Seat Covers (subcategory_id: 17, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Coverking Custom Seat Covers', 'Custom seat covers with excellent fit, durable material, easy installation, front and rear', 199.99, 83, 100, NULL, NULL, NULL, NULL, FALSE),
('Wet Okole Seat Covers', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 149.99, 83, 110, NULL, NULL, NULL, NULL, FALSE),
('Carhartt SeatSavers', 'Canvas seat covers with excellent fit, durable material, easy installation, front and rear', 89.99, 83, 130, NULL, NULL, NULL, NULL, FALSE),
('Covercraft SeatSavers', 'Custom seat covers with excellent fit, durable material, easy installation, front and rear', 179.99, 83, 105, NULL, NULL, NULL, NULL, FALSE),
('Sheepskin Seat Covers', 'Sheepskin seat covers with excellent comfort, durable material, easy installation, front and rear', 249.99, 83, 85, NULL, NULL, NULL, NULL, FALSE),
('Coverking Neosupreme', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 129.99, 83, 115, NULL, NULL, NULL, NULL, FALSE),
('Wet Okole Premium', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 169.99, 83, 100, NULL, NULL, NULL, NULL, FALSE),
('Carhartt Front Seat Covers', 'Canvas seat covers with excellent fit, durable material, easy installation, front only', 59.99, 83, 140, NULL, NULL, NULL, NULL, FALSE),
('Covercraft Carhartt', 'Canvas seat covers with excellent fit, durable material, easy installation, front and rear', 99.99, 83, 125, NULL, NULL, NULL, NULL, FALSE),
('Sheepskin Front Seat Covers', 'Sheepskin seat covers with excellent comfort, durable material, easy installation, front only', 149.99, 83, 95, NULL, NULL, NULL, NULL, FALSE),
('Coverking Satin Stretch', 'Stretch seat covers with excellent fit, durable material, easy installation, front and rear', 109.99, 83, 120, NULL, NULL, NULL, NULL, FALSE),
('Wet Okole Classic', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 119.99, 83, 112, NULL, NULL, NULL, NULL, FALSE),
('Carhartt Rear Seat Covers', 'Canvas seat covers with excellent fit, durable material, easy installation, rear only', 49.99, 83, 145, NULL, NULL, NULL, NULL, FALSE),
('Covercraft Neosupreme', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 139.99, 83, 108, NULL, NULL, NULL, NULL, FALSE),
('Sheepskin Rear Seat Covers', 'Sheepskin seat covers with excellent comfort, durable material, easy installation, rear only', 119.99, 83, 100, NULL, NULL, NULL, NULL, FALSE),
('Coverking Velour', 'Velour seat covers with excellent fit, comfortable material, easy installation, front and rear', 94.99, 83, 125, NULL, NULL, NULL, NULL, FALSE),
('Wet Okole Deluxe', 'Neoprene seat covers with excellent fit, waterproof, durable, front and rear', 159.99, 83, 102, NULL, NULL, NULL, NULL, FALSE),
('Carhartt Complete Set', 'Canvas seat covers with excellent fit, durable material, easy installation, complete set', 139.99, 83, 118, NULL, NULL, NULL, NULL, FALSE),
('Covercraft Complete Set', 'Custom seat covers with excellent fit, durable material, easy installation, complete set', 219.99, 83, 90, NULL, NULL, NULL, NULL, FALSE),
('Sheepskin Complete Set', 'Sheepskin seat covers with excellent comfort, durable material, easy installation, complete set', 299.99, 83, 80, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 84: Car Organizers (subcategory_id: 17, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('WeatherTech Cargo Liner', 'Cargo organizer with excellent fit, durable material, easy installation, universal fit', 99.99, 84, 120, NULL, NULL, NULL, NULL, FALSE),
('Husky Liners Cargo Liner', 'Cargo organizer with excellent fit, durable material, easy installation, universal fit', 79.99, 84, 130, NULL, NULL, NULL, NULL, FALSE),
('Car Organizer Seat Back', 'Seat back organizer with multiple pockets, durable material, easy installation, universal fit', 24.99, 84, 180, NULL, NULL, NULL, NULL, FALSE),
('Trunk Organizer Storage', 'Trunk organizer with multiple compartments, durable material, collapsible, universal fit', 39.99, 84, 150, NULL, NULL, NULL, NULL, FALSE),
('Car Console Organizer', 'Console organizer with multiple compartments, durable material, easy installation, universal fit', 19.99, 84, 200, NULL, NULL, NULL, NULL, FALSE),
('WeatherTech Cargo Mat', 'Cargo mat with excellent fit, durable material, easy installation, custom fit', 89.99, 84, 125, NULL, NULL, NULL, NULL, FALSE),
('Husky Liners Cargo Mat', 'Cargo mat with excellent fit, durable material, easy installation, universal fit', 69.99, 84, 135, NULL, NULL, NULL, NULL, FALSE),
('Car Organizer Seat Gap', 'Seat gap organizer with storage pockets, durable material, easy installation, universal fit', 14.99, 84, 190, NULL, NULL, NULL, NULL, FALSE),
('Trunk Organizer Box', 'Trunk organizer with multiple compartments, durable material, collapsible, universal fit', 34.99, 84, 160, NULL, NULL, NULL, NULL, FALSE),
('Car Console Tray', 'Console tray with multiple compartments, durable material, easy installation, universal fit', 16.99, 84, 205, NULL, NULL, NULL, NULL, FALSE),
('WeatherTech Cargo Box', 'Cargo box with excellent fit, durable material, easy installation, custom fit', 109.99, 84, 115, NULL, NULL, NULL, NULL, FALSE),
('Husky Liners Cargo Box', 'Cargo box with excellent fit, durable material, easy installation, universal fit', 89.99, 84, 128, NULL, NULL, NULL, NULL, FALSE),
('Car Organizer Headrest', 'Headrest organizer with multiple pockets, durable material, easy installation, universal fit', 21.99, 84, 185, NULL, NULL, NULL, NULL, FALSE),
('Trunk Organizer Bag', 'Trunk organizer bag with multiple compartments, durable material, collapsible, universal fit', 29.99, 84, 170, NULL, NULL, NULL, NULL, FALSE),
('Car Console Divider', 'Console divider with multiple compartments, durable material, easy installation, universal fit', 12.99, 84, 210, NULL, NULL, NULL, NULL, FALSE),
('WeatherTech Cargo Tray', 'Cargo tray with excellent fit, durable material, easy installation, custom fit', 94.99, 84, 122, NULL, NULL, NULL, NULL, FALSE),
('Husky Liners Cargo Tray', 'Cargo tray with excellent fit, durable material, easy installation, universal fit', 74.99, 84, 132, NULL, NULL, NULL, NULL, FALSE),
('Car Organizer Door', 'Door organizer with multiple pockets, durable material, easy installation, universal fit', 18.99, 84, 195, NULL, NULL, NULL, NULL, FALSE),
('Trunk Organizer Net', 'Trunk organizer net with elastic straps, durable material, collapsible, universal fit', 19.99, 84, 188, NULL, NULL, NULL, NULL, FALSE),
('Car Console Insert', 'Console insert with multiple compartments, durable material, easy installation, universal fit', 14.99, 84, 208, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 85: Car Safety (subcategory_id: 17, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('First Aid Kit Car', 'Car first aid kit with comprehensive supplies, excellent organization, compact design', 29.99, 85, 150, NULL, NULL, NULL, NULL, FALSE),
('Emergency Roadside Kit', 'Emergency kit with jumper cables, tire repair, tools, excellent organization, comprehensive', 79.99, 85, 120, NULL, NULL, NULL, NULL, FALSE),
('Jumper Cables Heavy Duty', 'Jumper cables with excellent quality, heavy-duty construction, 20-foot length, 4-gauge', 39.99, 85, 140, NULL, NULL, NULL, NULL, FALSE),
('Tire Repair Kit', 'Tire repair kit with plugs, tools, excellent quality, easy to use, comprehensive', 19.99, 85, 160, NULL, NULL, NULL, NULL, FALSE),
('Emergency Flare Kit', 'Emergency flare kit with flares, reflective triangle, excellent visibility, comprehensive', 24.99, 85, 155, NULL, NULL, NULL, NULL, FALSE),
('First Aid Kit Deluxe', 'Car first aid kit with comprehensive supplies, excellent organization, deluxe design', 49.99, 85, 130, NULL, NULL, NULL, NULL, FALSE),
('Emergency Roadside Kit Pro', 'Emergency kit with jumper cables, tire repair, tools, excellent organization, professional', 119.99, 85, 100, NULL, NULL, NULL, NULL, FALSE),
('Jumper Cables Professional', 'Jumper cables with excellent quality, professional construction, 25-foot length, 2-gauge', 59.99, 85, 125, NULL, NULL, NULL, NULL, FALSE),
('Tire Repair Kit Pro', 'Tire repair kit with plugs, tools, excellent quality, easy to use, professional', 34.99, 85, 145, NULL, NULL, NULL, NULL, FALSE),
('Emergency Flare Kit Deluxe', 'Emergency flare kit with flares, reflective triangle, excellent visibility, deluxe', 39.99, 85, 135, NULL, NULL, NULL, NULL, FALSE),
('First Aid Kit Premium', 'Car first aid kit with comprehensive supplies, excellent organization, premium design', 69.99, 85, 115, NULL, NULL, NULL, NULL, FALSE),
('Emergency Roadside Kit Ultimate', 'Emergency kit with jumper cables, tire repair, tools, excellent organization, ultimate', 149.99, 85, 90, NULL, NULL, NULL, NULL, FALSE),
('Jumper Cables Ultra', 'Jumper cables with excellent quality, ultra construction, 30-foot length, 1-gauge', 79.99, 85, 110, NULL, NULL, NULL, NULL, FALSE),
('Tire Repair Kit Ultimate', 'Tire repair kit with plugs, tools, excellent quality, easy to use, ultimate', 49.99, 85, 128, NULL, NULL, NULL, NULL, FALSE),
('Emergency Flare Kit Premium', 'Emergency flare kit with flares, reflective triangle, excellent visibility, premium', 54.99, 85, 120, NULL, NULL, NULL, NULL, FALSE),
('First Aid Kit Complete', 'Car first aid kit with comprehensive supplies, excellent organization, complete design', 89.99, 85, 105, NULL, NULL, NULL, NULL, FALSE),
('Emergency Roadside Kit Complete', 'Emergency kit with jumper cables, tire repair, tools, excellent organization, complete', 179.99, 85, 80, NULL, NULL, NULL, NULL, FALSE),
('Jumper Cables Complete', 'Jumper cables with excellent quality, complete construction, 35-foot length, 0-gauge', 99.99, 85, 100, NULL, NULL, NULL, NULL, FALSE),
('Tire Repair Kit Complete', 'Tire repair kit with plugs, tools, excellent quality, easy to use, complete', 64.99, 85, 118, NULL, NULL, NULL, NULL, FALSE),
('Emergency Flare Kit Complete', 'Emergency flare kit with flares, reflective triangle, excellent visibility, complete', 69.99, 85, 112, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 86: Car Wash Supplies (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Meguiar\'s Gold Class Car Wash', 'Car wash soap with excellent cleaning, gentle on paint, 64-ounce bottle', 14.99, 86, 200, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Mr. Pink', 'Car wash soap with excellent cleaning, pH-balanced, 16-ounce bottle', 19.99, 86, 180, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Car Wash', 'Car wash soap with excellent cleaning, affordable, 64-ounce bottle', 9.99, 86, 220, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Wash Mitt', 'Car wash mitt with excellent cleaning, microfiber material, gentle on paint', 12.99, 86, 190, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Microfiber Towels', 'Microfiber towels with excellent cleaning, soft material, 6-pack, 16x16 inches', 24.99, 86, 170, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Wash Sponge', 'Car wash sponge with excellent cleaning, durable material, gentle on paint', 7.99, 86, 210, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Car Wash Bucket', 'Car wash bucket with grit guard, excellent organization, 5-gallon capacity', 19.99, 86, 185, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Wash Pad', 'Car wash pad with excellent cleaning, microfiber material, gentle on paint', 16.99, 86, 195, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Wash Mitt', 'Car wash mitt with excellent cleaning, microfiber material, gentle on paint', 10.99, 86, 205, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Microfiber Towels', 'Microfiber towels with excellent cleaning, soft material, 12-pack, 16x16 inches', 29.99, 86, 165, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Car Wash Soap', 'Car wash soap with excellent cleaning, pH-balanced, 64-ounce bottle', 17.99, 86, 188, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Microfiber Towels', 'Microfiber towels with excellent cleaning, soft material, 4-pack, 16x16 inches', 14.99, 86, 200, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Wash Pad', 'Car wash pad with excellent cleaning, microfiber material, gentle on paint', 14.99, 86, 192, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Wash Bucket', 'Car wash bucket with grit guard, excellent organization, 5-gallon capacity', 24.99, 86, 178, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Wash Bucket', 'Car wash bucket with grit guard, excellent organization, 5-gallon capacity', 12.99, 86, 208, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Car Wash Complete Kit', 'Car wash kit with soap, mitt, towels, bucket, excellent organization, comprehensive', 49.99, 86, 150, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Car Wash Complete Kit', 'Car wash kit with soap, pad, towels, bucket, excellent organization, comprehensive', 59.99, 86, 145, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Car Wash Complete Kit', 'Car wash kit with soap, sponge, towels, bucket, excellent organization, comprehensive', 34.99, 86, 175, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Premium Car Wash', 'Premium car wash soap with excellent cleaning, gentle on paint, 128-ounce bottle', 24.99, 86, 180, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Premium Car Wash', 'Premium car wash soap with excellent cleaning, pH-balanced, 128-ounce bottle', 29.99, 86, 172, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 87: Wax & Polish (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Meguiar\'s Ultimate Liquid Wax', 'Car wax with excellent protection, easy application, long-lasting shine, 16-ounce bottle', 19.99, 87, 180, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Butter Wet Wax', 'Car wax with excellent protection, easy application, wet look shine, 16-ounce bottle', 24.99, 87, 170, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Hybrid Solutions', 'Car wax with excellent protection, easy application, ceramic technology, 16-ounce bottle', 16.99, 87, 190, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Ultimate Polish', 'Car polish with excellent shine, easy application, removes swirls, 16-ounce bottle', 17.99, 87, 185, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys V36 Polish', 'Car polish with excellent shine, easy application, removes swirls, 16-ounce bottle', 22.99, 87, 175, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Polish', 'Car polish with excellent shine, easy application, removes swirls, 16-ounce bottle', 12.99, 87, 195, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Ultimate Compound', 'Car compound with excellent cutting, easy application, removes scratches, 16-ounce bottle', 18.99, 87, 182, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys V34 Compound', 'Car compound with excellent cutting, easy application, removes scratches, 16-ounce bottle', 23.99, 87, 172, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Compound', 'Car compound with excellent cutting, easy application, removes scratches, 16-ounce bottle', 13.99, 87, 192, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Ultimate Wax Paste', 'Car wax paste with excellent protection, easy application, long-lasting shine, 11-ounce container', 21.99, 87, 178, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Butter Wet Wax Paste', 'Car wax paste with excellent protection, easy application, wet look shine, 11-ounce container', 26.99, 87, 168, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Hybrid Solutions Paste', 'Car wax paste with excellent protection, easy application, ceramic technology, 11-ounce container', 18.99, 87, 188, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Ultimate Polish Paste', 'Car polish paste with excellent shine, easy application, removes swirls, 11-ounce container', 19.99, 87, 183, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys V36 Polish Paste', 'Car polish paste with excellent shine, easy application, removes swirls, 11-ounce container', 24.99, 87, 173, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Polish Paste', 'Car polish paste with excellent shine, easy application, removes swirls, 11-ounce container', 14.99, 87, 193, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Ultimate Compound Paste', 'Car compound paste with excellent cutting, easy application, removes scratches, 11-ounce container', 20.99, 87, 180, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys V34 Compound Paste', 'Car compound paste with excellent cutting, easy application, removes scratches, 11-ounce container', 25.99, 87, 170, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Compound Paste', 'Car compound paste with excellent cutting, easy application, removes scratches, 11-ounce container', 15.99, 87, 190, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Ultimate Complete Kit', 'Car wax and polish kit with wax, polish, compound, excellent organization, comprehensive', 54.99, 87, 150, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Complete Kit', 'Car wax and polish kit with wax, polish, compound, excellent organization, comprehensive', 64.99, 87, 145, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 88: Engine Maintenance (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Mobil 1 Engine Oil 5W-30', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 29.99, 88, 250, NULL, NULL, NULL, NULL, FALSE),
('Castrol GTX Engine Oil 5W-30', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 19.99, 88, 270, NULL, NULL, NULL, NULL, FALSE),
('Valvoline Engine Oil 5W-30', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 27.99, 88, 255, NULL, NULL, NULL, NULL, FALSE),
('STP Oil Treatment', 'Engine oil treatment with excellent protection, additive, 15-ounce bottle', 8.99, 88, 300, NULL, NULL, NULL, NULL, FALSE),
('Lucas Oil Stabilizer', 'Engine oil stabilizer with excellent protection, additive, 32-ounce bottle', 14.99, 88, 280, NULL, NULL, NULL, NULL, FALSE),
('Mobil 1 Engine Oil 0W-20', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 31.99, 88, 240, NULL, NULL, NULL, NULL, FALSE),
('Castrol GTX Engine Oil 10W-30', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 18.99, 88, 275, NULL, NULL, NULL, NULL, FALSE),
('Valvoline Engine Oil 0W-20', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 29.99, 88, 250, NULL, NULL, NULL, NULL, FALSE),
('STP Fuel Injector Cleaner', 'Fuel injector cleaner with excellent cleaning, additive, 12-ounce bottle', 6.99, 88, 310, NULL, NULL, NULL, NULL, FALSE),
('Lucas Fuel Treatment', 'Fuel treatment with excellent cleaning, additive, 16-ounce bottle', 9.99, 88, 290, NULL, NULL, NULL, NULL, FALSE),
('Mobil 1 Engine Oil 10W-30', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 28.99, 88, 248, NULL, NULL, NULL, NULL, FALSE),
('Castrol GTX Engine Oil 5W-20', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 20.99, 88, 268, NULL, NULL, NULL, NULL, FALSE),
('Valvoline Engine Oil 10W-30', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 26.99, 88, 258, NULL, NULL, NULL, NULL, FALSE),
('STP Engine Flush', 'Engine flush with excellent cleaning, additive, 16-ounce bottle', 7.99, 88, 305, NULL, NULL, NULL, NULL, FALSE),
('Lucas Transmission Fix', 'Transmission treatment with excellent protection, additive, 32-ounce bottle', 16.99, 88, 275, NULL, NULL, NULL, NULL, FALSE),
('Mobil 1 Engine Oil 5W-20', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 30.99, 88, 242, NULL, NULL, NULL, NULL, FALSE),
('Castrol GTX Engine Oil 0W-20', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 21.99, 88, 266, NULL, NULL, NULL, NULL, FALSE),
('Valvoline Engine Oil 5W-20', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 28.99, 88, 252, NULL, NULL, NULL, NULL, FALSE),
('STP Complete Fuel System', 'Fuel system cleaner with excellent cleaning, additive, 20-ounce bottle', 11.99, 88, 295, NULL, NULL, NULL, NULL, FALSE),
('Lucas Complete Engine', 'Engine treatment with excellent protection, additive, 32-ounce bottle', 17.99, 88, 270, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 89: Tire Care (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Meguiar\'s Endurance Tire Gel', 'Tire shine with excellent protection, gel formula, long-lasting shine, 16-ounce bottle', 12.99, 89, 200, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Tire Shine', 'Tire shine with excellent protection, spray formula, wet look shine, 16-ounce bottle', 14.99, 89, 190, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Tire Shine', 'Tire shine with excellent protection, spray formula, affordable, 16-ounce bottle', 8.99, 89, 220, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Hot Shine Tire Spray', 'Tire shine with excellent protection, spray formula, long-lasting shine, 16-ounce bottle', 11.99, 89, 205, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys VRP', 'Tire shine with excellent protection, gel formula, wet look shine, 16-ounce bottle', 16.99, 89, 185, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Tire Foam', 'Tire shine with excellent protection, foam formula, affordable, 16-ounce bottle', 9.99, 89, 215, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Tire Cleaner', 'Tire cleaner with excellent cleaning, spray formula, easy application, 16-ounce bottle', 10.99, 89, 210, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Tire Cleaner', 'Tire cleaner with excellent cleaning, spray formula, easy application, 16-ounce bottle', 13.99, 89, 195, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Tire Cleaner', 'Tire cleaner with excellent cleaning, spray formula, affordable, 16-ounce bottle', 7.99, 89, 225, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Tire Dressing', 'Tire dressing with excellent protection, gel formula, long-lasting shine, 16-ounce bottle', 13.99, 89, 198, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Tire Dressing', 'Tire dressing with excellent protection, gel formula, wet look shine, 16-ounce bottle', 17.99, 89, 188, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Tire Dressing', 'Tire dressing with excellent protection, gel formula, affordable, 16-ounce bottle', 10.99, 89, 218, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Tire Shine Complete', 'Tire care kit with cleaner, shine, excellent organization, comprehensive', 24.99, 89, 175, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Tire Care Complete', 'Tire care kit with cleaner, shine, excellent organization, comprehensive', 29.99, 89, 170, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Tire Care Complete', 'Tire care kit with cleaner, shine, excellent organization, comprehensive', 18.99, 89, 200, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Tire Shine Premium', 'Premium tire shine with excellent protection, gel formula, long-lasting shine, 32-ounce bottle', 19.99, 89, 180, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Tire Shine Premium', 'Premium tire shine with excellent protection, gel formula, wet look shine, 32-ounce bottle', 24.99, 89, 175, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Tire Shine Premium', 'Premium tire shine with excellent protection, gel formula, affordable, 32-ounce bottle', 14.99, 89, 205, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Tire Shine Ultimate', 'Ultimate tire shine with excellent protection, gel formula, long-lasting shine, 64-ounce bottle', 34.99, 89, 160, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Tire Shine Ultimate', 'Ultimate tire shine with excellent protection, gel formula, wet look shine, 64-ounce bottle', 39.99, 89, 155, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 90: Interior Care (subcategory_id: 18, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Meguiar\'s Interior Cleaner', 'Interior cleaner with excellent cleaning, spray formula, safe on all surfaces, 16-ounce bottle', 9.99, 90, 220, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Interior Cleaner', 'Interior cleaner with excellent cleaning, spray formula, safe on all surfaces, 16-ounce bottle', 12.99, 90, 200, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Interior Cleaner', 'Interior cleaner with excellent cleaning, spray formula, affordable, 16-ounce bottle', 6.99, 90, 240, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Leather Cleaner', 'Leather cleaner with excellent cleaning, spray formula, conditions leather, 16-ounce bottle', 14.99, 90, 190, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Leather Cleaner', 'Leather cleaner with excellent cleaning, spray formula, conditions leather, 16-ounce bottle', 17.99, 90, 180, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Leather Cleaner', 'Leather cleaner with excellent cleaning, spray formula, affordable, 16-ounce bottle', 9.99, 90, 210, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Dashboard Protectant', 'Dashboard protectant with excellent protection, spray formula, UV protection, 16-ounce bottle', 11.99, 90, 205, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Dashboard Protectant', 'Dashboard protectant with excellent protection, spray formula, UV protection, 16-ounce bottle', 14.99, 90, 195, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Dashboard Protectant', 'Dashboard protectant with excellent protection, spray formula, affordable, 16-ounce bottle', 7.99, 90, 225, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Carpet Cleaner', 'Carpet cleaner with excellent cleaning, spray formula, removes stains, 16-ounce bottle', 10.99, 90, 215, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Carpet Cleaner', 'Carpet cleaner with excellent cleaning, spray formula, removes stains, 16-ounce bottle', 13.99, 90, 200, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Carpet Cleaner', 'Carpet cleaner with excellent cleaning, spray formula, affordable, 16-ounce bottle', 8.99, 90, 230, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Interior Complete Kit', 'Interior care kit with cleaner, protectant, excellent organization, comprehensive', 29.99, 90, 180, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Interior Complete Kit', 'Interior care kit with cleaner, protectant, excellent organization, comprehensive', 34.99, 90, 175, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Interior Complete Kit', 'Interior care kit with cleaner, protectant, excellent organization, comprehensive', 19.99, 90, 200, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Leather Complete Kit', 'Leather care kit with cleaner, conditioner, excellent organization, comprehensive', 24.99, 90, 185, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Leather Complete Kit', 'Leather care kit with cleaner, conditioner, excellent organization, comprehensive', 29.99, 90, 180, NULL, NULL, NULL, NULL, FALSE),
('Turtle Wax Leather Complete Kit', 'Leather care kit with cleaner, conditioner, excellent organization, comprehensive', 16.99, 90, 205, NULL, NULL, NULL, NULL, FALSE),
('Meguiar\'s Interior Premium', 'Premium interior cleaner with excellent cleaning, spray formula, safe on all surfaces, 32-ounce bottle', 16.99, 90, 195, NULL, NULL, NULL, NULL, FALSE),
('Chemical Guys Interior Premium', 'Premium interior cleaner with excellent cleaning, spray formula, safe on all surfaces, 32-ounce bottle', 19.99, 90, 188, NULL, NULL, NULL, NULL, FALSE);

