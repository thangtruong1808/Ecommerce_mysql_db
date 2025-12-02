-- Product Data for Ecommerce Database
-- This file contains products for child categories 92-101 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 92-101
-- ============================================

-- Child Category 92: Car Audio Systems (subcategory_id: 19, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Pioneer DMH-1500NEX', 'Car stereo with 6.2" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 299.99, 92, 80),
('Sony XAV-AX5500', 'Car stereo with 6.95" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 349.99, 92, 75),
('Kenwood DMX4707S', 'Car stereo with 6.8" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 279.99, 92, 85),
('Alpine ILX-W650', 'Car stereo with 7" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 399.99, 92, 70),
('JVC KW-M865BW', 'Car stereo with 6.8" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 329.99, 92, 78),
('Pioneer DMH-1770NEX', 'Car stereo with 6.2" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 249.99, 92, 88),
('Sony XAV-AX1000', 'Car stereo with 6.2" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 299.99, 92, 82),
('Kenwood DMX7706S', 'Car stereo with 6.95" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 379.99, 92, 72),
('Alpine ILX-407', 'Car stereo with 7" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 449.99, 92, 65),
('JVC KW-M750BT', 'Car stereo with 6.8" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 269.99, 92, 90),
('Pioneer DMH-220EX', 'Car stereo with 6.2" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 199.99, 92, 95),
('Sony XAV-AX5000', 'Car stereo with 6.95" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 319.99, 92, 80),
('Kenwood DMX4707S Pro', 'Car stereo with 6.8" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 299.99, 92, 83),
('Alpine ILX-W650 Pro', 'Car stereo with 7" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 419.99, 92, 68),
('JVC KW-M865BW Pro', 'Car stereo with 6.8" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 349.99, 92, 76),
('Pioneer DMH-1500NEX Pro', 'Car stereo with 6.2" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 329.99, 92, 79),
('Sony XAV-AX5500 Pro', 'Car stereo with 6.95" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 369.99, 92, 74),
('Kenwood DMX7706S Pro', 'Car stereo with 6.95" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 399.99, 92, 71),
('Alpine ILX-407 Pro', 'Car stereo with 7" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 469.99, 92, 63),
('JVC KW-M750BT Pro', 'Car stereo with 6.8" touchscreen, Apple CarPlay, Android Auto, Bluetooth, excellent sound', 289.99, 92, 87);

-- Child Category 93: GPS Navigation (subcategory_id: 19, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Garmin DriveSmart 65', 'GPS navigation with 6.95" display, lifetime maps, traffic alerts, excellent navigation', 199.99, 93, 100),
('TomTom Go Comfort', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 179.99, 93, 105),
('Garmin Drive 52', 'GPS navigation with 5" display, lifetime maps, traffic alerts, excellent navigation', 119.99, 93, 120),
('TomTom Go Essential', 'GPS navigation with 5" display, lifetime maps, traffic alerts, excellent navigation', 99.99, 93, 125),
('Garmin DriveSmart 55', 'GPS navigation with 5.5" display, lifetime maps, traffic alerts, excellent navigation', 149.99, 93, 110),
('TomTom Go Premium', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 199.99, 93, 100),
('Garmin Drive 62', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 169.99, 93, 108),
('TomTom Go Expert', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 219.99, 93, 95),
('Garmin DriveSmart 86', 'GPS navigation with 8" display, lifetime maps, traffic alerts, excellent navigation', 299.99, 93, 85),
('TomTom Go Ultimate', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 249.99, 93, 90),
('Garmin Drive 52 Plus', 'GPS navigation with 5" display, lifetime maps, traffic alerts, excellent navigation', 129.99, 93, 115),
('TomTom Go Essential Plus', 'GPS navigation with 5" display, lifetime maps, traffic alerts, excellent navigation', 109.99, 93, 118),
('Garmin DriveSmart 55 Plus', 'GPS navigation with 5.5" display, lifetime maps, traffic alerts, excellent navigation', 159.99, 93, 112),
('TomTom Go Premium Plus', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 209.99, 93, 98),
('Garmin Drive 62 Plus', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 179.99, 93, 106),
('TomTom Go Expert Plus', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 229.99, 93, 93),
('Garmin DriveSmart 86 Plus', 'GPS navigation with 8" display, lifetime maps, traffic alerts, excellent navigation', 309.99, 93, 83),
('TomTom Go Ultimate Plus', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 259.99, 93, 88),
('Garmin DriveSmart 65 Plus', 'GPS navigation with 6.95" display, lifetime maps, traffic alerts, excellent navigation', 209.99, 93, 102),
('TomTom Go Comfort Plus', 'GPS navigation with 6" display, lifetime maps, traffic alerts, excellent navigation', 189.99, 93, 104);

-- Child Category 94: Car Chargers (subcategory_id: 19, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Anker PowerDrive 2', 'Car charger with 2 USB ports, 24W total output, fast charging, excellent quality', 12.99, 94, 200),
('Belkin Car Charger', 'Car charger with 2 USB ports, 24W total output, fast charging, excellent quality', 19.99, 94, 180),
('Aukey Car Charger', 'Car charger with 2 USB ports, 24W total output, fast charging, excellent quality', 14.99, 94, 190),
('Anker PowerDrive 3', 'Car charger with 3 USB ports, 36W total output, fast charging, excellent quality', 18.99, 94, 185),
('Belkin Car Charger Pro', 'Car charger with 2 USB-C ports, 60W total output, fast charging, excellent quality', 29.99, 94, 170),
('Aukey Car Charger Pro', 'Car charger with 2 USB-C ports, 60W total output, fast charging, excellent quality', 24.99, 94, 175),
('Anker PowerDrive 4', 'Car charger with 4 USB ports, 48W total output, fast charging, excellent quality', 24.99, 94, 178),
('Belkin Car Charger Ultra', 'Car charger with 2 USB-C ports, 100W total output, fast charging, excellent quality', 39.99, 94, 165),
('Aukey Car Charger Ultra', 'Car charger with 2 USB-C ports, 100W total output, fast charging, excellent quality', 34.99, 94, 168),
('Anker PowerDrive 5', 'Car charger with 5 USB ports, 60W total output, fast charging, excellent quality', 29.99, 94, 172),
('Belkin Car Charger Plus', 'Car charger with 2 USB ports, 36W total output, fast charging, excellent quality', 24.99, 94, 182),
('Aukey Car Charger Plus', 'Car charger with 2 USB ports, 36W total output, fast charging, excellent quality', 19.99, 94, 188),
('Anker PowerDrive 6', 'Car charger with 6 USB ports, 72W total output, fast charging, excellent quality', 34.99, 94, 170),
('Belkin Car Charger Max', 'Car charger with 2 USB-C ports, 120W total output, fast charging, excellent quality', 49.99, 94, 160),
('Aukey Car Charger Max', 'Car charger with 2 USB-C ports, 120W total output, fast charging, excellent quality', 44.99, 94, 163),
('Anker PowerDrive 7', 'Car charger with 7 USB ports, 84W total output, fast charging, excellent quality', 39.99, 94, 168),
('Belkin Car Charger Elite', 'Car charger with 2 USB-C ports, 140W total output, fast charging, excellent quality', 59.99, 94, 155),
('Aukey Car Charger Elite', 'Car charger with 2 USB-C ports, 140W total output, fast charging, excellent quality', 54.99, 94, 158),
('Anker PowerDrive 8', 'Car charger with 8 USB ports, 96W total output, fast charging, excellent quality', 44.99, 94, 166),
('Belkin Car Charger Ultimate', 'Car charger with 2 USB-C ports, 160W total output, fast charging, excellent quality', 69.99, 94, 150);

-- Child Category 95: Bluetooth Devices (subcategory_id: 19, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Anker Roav Bluetooth Adapter', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling', 24.99, 95, 180),
('Mpow Bluetooth Car Adapter', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling', 19.99, 95, 190),
('Jabra Freeway', 'Bluetooth speakerphone with excellent sound quality, easy installation, hands-free calling', 79.99, 95, 140),
('Anker Roav Bluetooth Pro', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, dual device', 34.99, 95, 175),
('Mpow Bluetooth Car Adapter Pro', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, dual device', 29.99, 95, 185),
('Jabra Freeway Pro', 'Bluetooth speakerphone with excellent sound quality, easy installation, hands-free calling, dual device', 89.99, 95, 135),
('Anker Roav Bluetooth Ultra', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, triple device', 44.99, 95, 170),
('Mpow Bluetooth Car Adapter Ultra', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, triple device', 39.99, 95, 178),
('Jabra Freeway Ultra', 'Bluetooth speakerphone with excellent sound quality, easy installation, hands-free calling, triple device', 99.99, 95, 130),
('Anker Roav Bluetooth Elite', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, quad device', 54.99, 95, 165),
('Mpow Bluetooth Car Adapter Elite', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, quad device', 49.99, 95, 172),
('Jabra Freeway Elite', 'Bluetooth speakerphone with excellent sound quality, easy installation, hands-free calling, quad device', 109.99, 95, 125),
('Anker Roav Bluetooth Plus', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, dual device', 29.99, 95, 180),
('Mpow Bluetooth Car Adapter Plus', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, dual device', 24.99, 95, 188),
('Jabra Freeway Plus', 'Bluetooth speakerphone with excellent sound quality, easy installation, hands-free calling, dual device', 84.99, 95, 138),
('Anker Roav Bluetooth Max', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, quint device', 64.99, 95, 160),
('Mpow Bluetooth Car Adapter Max', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, quint device', 59.99, 95, 168),
('Jabra Freeway Max', 'Bluetooth speakerphone with excellent sound quality, easy installation, hands-free calling, quint device', 119.99, 95, 120),
('Anker Roav Bluetooth Complete', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, complete set', 74.99, 95, 155),
('Mpow Bluetooth Car Adapter Complete', 'Bluetooth adapter with excellent sound quality, easy installation, hands-free calling, complete set', 69.99, 95, 162);

-- Child Category 96: Car Electronics (subcategory_id: 19, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Cobra RAD 480i', 'Radar detector with excellent detection, GPS, smartphone app, excellent quality', 199.99, 96, 100),
('Uniden R7', 'Radar detector with excellent detection, GPS, directional arrows, excellent quality', 399.99, 96, 80),
('Valentine One Gen2', 'Radar detector with excellent detection, GPS, directional arrows, premium quality', 499.99, 96, 70),
('Garmin BC 40', 'Backup camera with excellent image quality, easy installation, wireless, excellent quality', 149.99, 96, 120),
('Pyle PLCM7200', 'Backup camera with excellent image quality, easy installation, wired, excellent quality', 49.99, 96, 150),
('Cobra RAD 450', 'Radar detector with excellent detection, GPS, excellent quality, affordable', 149.99, 96, 110),
('Uniden R3', 'Radar detector with excellent detection, GPS, directional arrows, excellent quality', 299.99, 96, 90),
('Valentine One Gen1', 'Radar detector with excellent detection, GPS, directional arrows, premium quality', 399.99, 96, 75),
('Garmin BC 30', 'Backup camera with excellent image quality, easy installation, wireless, excellent quality', 129.99, 96, 125),
('Pyle PLCM7200 Pro', 'Backup camera with excellent image quality, easy installation, wired, excellent quality', 59.99, 96, 145),
('Cobra RAD 480i Pro', 'Radar detector with excellent detection, GPS, smartphone app, excellent quality', 219.99, 96, 95),
('Uniden R7 Pro', 'Radar detector with excellent detection, GPS, directional arrows, excellent quality', 429.99, 96, 78),
('Valentine One Gen2 Pro', 'Radar detector with excellent detection, GPS, directional arrows, premium quality', 529.99, 96, 68),
('Garmin BC 40 Pro', 'Backup camera with excellent image quality, easy installation, wireless, excellent quality', 169.99, 96, 115),
('Pyle PLCM7200 Ultra', 'Backup camera with excellent image quality, easy installation, wired, excellent quality', 69.99, 96, 140),
('Cobra RAD 450 Pro', 'Radar detector with excellent detection, GPS, excellent quality, affordable', 169.99, 96, 105),
('Uniden R3 Pro', 'Radar detector with excellent detection, GPS, directional arrows, excellent quality', 329.99, 96, 88),
('Valentine One Gen1 Pro', 'Radar detector with excellent detection, GPS, directional arrows, premium quality', 429.99, 96, 73),
('Garmin BC 30 Pro', 'Backup camera with excellent image quality, easy installation, wireless, excellent quality', 149.99, 96, 122),
('Pyle PLCM7200 Elite', 'Backup camera with excellent image quality, easy installation, wired, excellent quality', 79.99, 96, 135);

-- Child Category 97: Floor Mats (subcategory_id: 20, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('WeatherTech FloorLiner', 'Custom floor mats with excellent fit, durable material, easy installation, front and rear', 199.99, 97, 110),
('Husky Liners X-act Contour', 'Custom floor mats with excellent fit, durable material, easy installation, front and rear', 149.99, 97, 120),
('3D MAXpider Floor Mats', 'Custom floor mats with excellent fit, durable material, easy installation, front and rear', 129.99, 97, 130),
('WeatherTech All-Weather Floor Mats', 'Universal floor mats with excellent fit, durable material, easy installation, front and rear', 99.99, 97, 140),
('Husky Liners Weatherbeater', 'Universal floor mats with excellent fit, durable material, easy installation, front and rear', 79.99, 97, 150),
('3D MAXpider Universal', 'Universal floor mats with excellent fit, durable material, easy installation, front and rear', 69.99, 97, 155),
('WeatherTech FloorLiner Pro', 'Custom floor mats with excellent fit, durable material, easy installation, front and rear', 219.99, 97, 105),
('Husky Liners X-act Contour Pro', 'Custom floor mats with excellent fit, durable material, easy installation, front and rear', 169.99, 97, 115),
('3D MAXpider Floor Mats Pro', 'Custom floor mats with excellent fit, durable material, easy installation, front and rear', 149.99, 97, 125),
('WeatherTech All-Weather Pro', 'Universal floor mats with excellent fit, durable material, easy installation, front and rear', 109.99, 97, 135),
('Husky Liners Weatherbeater Pro', 'Universal floor mats with excellent fit, durable material, easy installation, front and rear', 89.99, 97, 145),
('3D MAXpider Universal Pro', 'Universal floor mats with excellent fit, durable material, easy installation, front and rear', 79.99, 97, 150),
('WeatherTech FloorLiner Ultra', 'Custom floor mats with excellent fit, durable material, easy installation, front and rear', 239.99, 97, 100),
('Husky Liners X-act Contour Ultra', 'Custom floor mats with excellent fit, durable material, easy installation, front and rear', 189.99, 97, 110),
('3D MAXpider Floor Mats Ultra', 'Custom floor mats with excellent fit, durable material, easy installation, front and rear', 169.99, 97, 120),
('WeatherTech All-Weather Ultra', 'Universal floor mats with excellent fit, durable material, easy installation, front and rear', 119.99, 97, 130),
('Husky Liners Weatherbeater Ultra', 'Universal floor mats with excellent fit, durable material, easy installation, front and rear', 99.99, 97, 140),
('3D MAXpider Universal Ultra', 'Universal floor mats with excellent fit, durable material, easy installation, front and rear', 89.99, 97, 145),
('WeatherTech FloorLiner Complete', 'Custom floor mats with excellent fit, durable material, easy installation, complete set', 259.99, 97, 95),
('Husky Liners X-act Contour Complete', 'Custom floor mats with excellent fit, durable material, easy installation, complete set', 209.99, 97, 105);

-- Child Category 98: Cargo Organizers (subcategory_id: 20, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('WeatherTech Cargo Liner', 'Cargo organizer with excellent fit, durable material, easy installation, custom fit', 99.99, 98, 120),
('Husky Liners Cargo Liner', 'Cargo organizer with excellent fit, durable material, easy installation, universal fit', 79.99, 98, 130),
('Trunk Organizer Storage', 'Trunk organizer with multiple compartments, durable material, collapsible, universal fit', 39.99, 98, 150),
('Cargo Net Organizer', 'Cargo net organizer with elastic straps, durable material, collapsible, universal fit', 19.99, 98, 180),
('Trunk Organizer Box', 'Trunk organizer box with multiple compartments, durable material, collapsible, universal fit', 34.99, 98, 155),
('WeatherTech Cargo Mat', 'Cargo mat with excellent fit, durable material, easy installation, custom fit', 89.99, 98, 125),
('Husky Liners Cargo Mat', 'Cargo mat with excellent fit, durable material, easy installation, universal fit', 69.99, 98, 135),
('Trunk Organizer Bag', 'Trunk organizer bag with multiple compartments, durable material, collapsible, universal fit', 29.99, 98, 160),
('Cargo Net Organizer Pro', 'Cargo net organizer with elastic straps, durable material, collapsible, universal fit', 24.99, 98, 175),
('Trunk Organizer Box Pro', 'Trunk organizer box with multiple compartments, durable material, collapsible, universal fit', 39.99, 98, 150),
('WeatherTech Cargo Box', 'Cargo box with excellent fit, durable material, easy installation, custom fit', 109.99, 98, 115),
('Husky Liners Cargo Box', 'Cargo box with excellent fit, durable material, easy installation, universal fit', 89.99, 98, 128),
('Trunk Organizer Storage Pro', 'Trunk organizer with multiple compartments, durable material, collapsible, universal fit', 44.99, 98, 145),
('Cargo Net Organizer Ultra', 'Cargo net organizer with elastic straps, durable material, collapsible, universal fit', 29.99, 98, 170),
('Trunk Organizer Bag Pro', 'Trunk organizer bag with multiple compartments, durable material, collapsible, universal fit', 34.99, 98, 152),
('WeatherTech Cargo Tray', 'Cargo tray with excellent fit, durable material, easy installation, custom fit', 94.99, 98, 122),
('Husky Liners Cargo Tray', 'Cargo tray with excellent fit, durable material, easy installation, universal fit', 74.99, 98, 132),
('Trunk Organizer Complete', 'Trunk organizer with multiple compartments, durable material, collapsible, complete set', 49.99, 98, 140),
('Cargo Net Organizer Complete', 'Cargo net organizer with elastic straps, durable material, collapsible, complete set', 34.99, 98, 165),
('Trunk Organizer Ultimate', 'Trunk organizer with multiple compartments, durable material, collapsible, ultimate set', 59.99, 98, 135);

-- Child Category 99: Exterior Styling (subcategory_id: 20, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Body Kit Front Bumper', 'Front bumper body kit with excellent fit, durable material, easy installation, universal fit', 299.99, 99, 80),
('Spoiler Rear Wing', 'Rear spoiler with excellent fit, durable material, easy installation, universal fit', 149.99, 99, 100),
('Side Skirts', 'Side skirts with excellent fit, durable material, easy installation, universal fit', 199.99, 99, 90),
('Body Kit Rear Bumper', 'Rear bumper body kit with excellent fit, durable material, easy installation, universal fit', 279.99, 99, 85),
('Spoiler Trunk', 'Trunk spoiler with excellent fit, durable material, easy installation, universal fit', 129.99, 99, 105),
('Side Skirts Pro', 'Side skirts with excellent fit, durable material, easy installation, universal fit', 219.99, 99, 88),
('Body Kit Complete', 'Complete body kit with front bumper, rear bumper, side skirts, excellent fit, universal fit', 799.99, 99, 60),
('Spoiler Complete Set', 'Complete spoiler set with front and rear spoilers, excellent fit, universal fit', 249.99, 99, 95),
('Side Skirts Complete', 'Complete side skirts set with front and rear, excellent fit, universal fit', 179.99, 99, 92),
('Body Kit Front Bumper Pro', 'Front bumper body kit with excellent fit, durable material, easy installation, universal fit', 329.99, 99, 78),
('Spoiler Rear Wing Pro', 'Rear spoiler with excellent fit, durable material, easy installation, universal fit', 169.99, 99, 98),
('Side Skirts Ultra', 'Side skirts with excellent fit, durable material, easy installation, universal fit', 239.99, 99, 86),
('Body Kit Rear Bumper Pro', 'Rear bumper body kit with excellent fit, durable material, easy installation, universal fit', 309.99, 99, 83),
('Spoiler Trunk Pro', 'Trunk spoiler with excellent fit, durable material, easy installation, universal fit', 149.99, 99, 103),
('Side Skirts Elite', 'Side skirts with excellent fit, durable material, easy installation, universal fit', 259.99, 99, 84),
('Body Kit Complete Pro', 'Complete body kit with front bumper, rear bumper, side skirts, excellent fit, universal fit', 849.99, 99, 58),
('Spoiler Complete Set Pro', 'Complete spoiler set with front and rear spoilers, excellent fit, universal fit', 279.99, 99, 93),
('Side Skirts Complete Pro', 'Complete side skirts set with front and rear, excellent fit, universal fit', 199.99, 99, 90),
('Body Kit Ultimate', 'Ultimate body kit with front bumper, rear bumper, side skirts, excellent fit, universal fit', 899.99, 99, 55),
('Spoiler Ultimate Set', 'Ultimate spoiler set with front and rear spoilers, excellent fit, universal fit', 299.99, 99, 91);

-- Child Category 100: Car Decor (subcategory_id: 20, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Car Decals Stickers', 'Car decals with various designs, durable material, easy application, 10-pack', 9.99, 100, 250),
('Car Stickers Pack', 'Car stickers with various designs, durable material, easy application, 20-pack', 14.99, 100, 240),
('Car Emblem Badge', 'Car emblem badge with various designs, durable material, easy application, single', 12.99, 100, 230),
('Car Decals Custom', 'Custom car decals with various designs, durable material, easy application, 5-pack', 19.99, 100, 220),
('Car Stickers Custom', 'Custom car stickers with various designs, durable material, easy application, 10-pack', 24.99, 100, 210),
('Car Emblem Badge Pro', 'Car emblem badge with various designs, durable material, easy application, single', 17.99, 100, 225),
('Car Decals Premium', 'Premium car decals with various designs, durable material, easy application, 15-pack', 29.99, 100, 200),
('Car Stickers Premium', 'Premium car stickers with various designs, durable material, easy application, 30-pack', 34.99, 100, 195),
('Car Emblem Badge Premium', 'Premium car emblem badge with various designs, durable material, easy application, single', 22.99, 100, 218),
('Car Decals Ultimate', 'Ultimate car decals with various designs, durable material, easy application, 20-pack', 39.99, 100, 190),
('Car Stickers Ultimate', 'Ultimate car stickers with various designs, durable material, easy application, 40-pack', 44.99, 100, 185),
('Car Emblem Badge Ultimate', 'Ultimate car emblem badge with various designs, durable material, easy application, single', 27.99, 100, 212),
('Car Decals Complete', 'Complete car decals with various designs, durable material, easy application, 25-pack', 49.99, 100, 180),
('Car Stickers Complete', 'Complete car stickers with various designs, durable material, easy application, 50-pack', 54.99, 100, 175),
('Car Emblem Badge Complete', 'Complete car emblem badge with various designs, durable material, easy application, single', 32.99, 100, 208),
('Car Decals Pro', 'Pro car decals with various designs, durable material, easy application, 12-pack', 24.99, 100, 205),
('Car Stickers Pro', 'Pro car stickers with various designs, durable material, easy application, 25-pack', 29.99, 100, 200),
('Car Emblem Badge Elite', 'Elite car emblem badge with various designs, durable material, easy application, single', 19.99, 100, 222),
('Car Decals Elite', 'Elite car decals with various designs, durable material, easy application, 18-pack', 34.99, 100, 195),
('Car Stickers Elite', 'Elite car stickers with various designs, durable material, easy application, 35-pack', 39.99, 100, 190);

-- Child Category 101: Car Lighting (subcategory_id: 20, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('LED Headlight Bulbs', 'LED headlight bulbs with excellent brightness, easy installation, H11 size, 2-pack', 49.99, 101, 150),
('LED Fog Light Bulbs', 'LED fog light bulbs with excellent brightness, easy installation, H11 size, 2-pack', 39.99, 101, 160),
('LED Interior Lights', 'LED interior lights with excellent brightness, easy installation, universal fit, 10-pack', 24.99, 101, 180),
('LED Tail Light Bulbs', 'LED tail light bulbs with excellent brightness, easy installation, 3157 size, 2-pack', 34.99, 101, 170),
('LED Turn Signal Bulbs', 'LED turn signal bulbs with excellent brightness, easy installation, 7440 size, 2-pack', 29.99, 101, 175),
('LED Headlight Bulbs Pro', 'LED headlight bulbs with excellent brightness, easy installation, H11 size, 2-pack', 59.99, 101, 145),
('LED Fog Light Bulbs Pro', 'LED fog light bulbs with excellent brightness, easy installation, H11 size, 2-pack', 49.99, 101, 155),
('LED Interior Lights Pro', 'LED interior lights with excellent brightness, easy installation, universal fit, 15-pack', 34.99, 101, 175),
('LED Tail Light Bulbs Pro', 'LED tail light bulbs with excellent brightness, easy installation, 3157 size, 2-pack', 44.99, 101, 165),
('LED Turn Signal Bulbs Pro', 'LED turn signal bulbs with excellent brightness, easy installation, 7440 size, 2-pack', 39.99, 101, 170),
('LED Headlight Bulbs Ultra', 'LED headlight bulbs with excellent brightness, easy installation, H11 size, 2-pack', 69.99, 101, 140),
('LED Fog Light Bulbs Ultra', 'LED fog light bulbs with excellent brightness, easy installation, H11 size, 2-pack', 59.99, 101, 150),
('LED Interior Lights Ultra', 'LED interior lights with excellent brightness, easy installation, universal fit, 20-pack', 44.99, 101, 170),
('LED Tail Light Bulbs Ultra', 'LED tail light bulbs with excellent brightness, easy installation, 3157 size, 2-pack', 54.99, 101, 160),
('LED Turn Signal Bulbs Ultra', 'LED turn signal bulbs with excellent brightness, easy installation, 7440 size, 2-pack', 49.99, 101, 165),
('LED Headlight Bulbs Complete', 'LED headlight bulbs with excellent brightness, easy installation, H11 size, complete set', 79.99, 101, 135),
('LED Fog Light Bulbs Complete', 'LED fog light bulbs with excellent brightness, easy installation, H11 size, complete set', 69.99, 101, 145),
('LED Interior Lights Complete', 'LED interior lights with excellent brightness, easy installation, universal fit, complete set', 54.99, 101, 165),
('LED Tail Light Bulbs Complete', 'LED tail light bulbs with excellent brightness, easy installation, 3157 size, complete set', 64.99, 101, 155),
('LED Turn Signal Bulbs Complete', 'LED turn signal bulbs with excellent brightness, easy installation, 7440 size, complete set', 59.99, 101, 160);

