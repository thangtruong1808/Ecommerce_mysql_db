-- Product Data for Ecommerce Database
-- This file contains products for child categories 72-81 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 72-81
-- ============================================

-- Child Category 72: Headlamps & Flashlights (subcategory_id: 15, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Black Diamond Spot 400', 'Headlamp with 400 lumens, rechargeable battery, excellent brightness, 3.2oz', 49.99, 72, 90),
('Petzl Actik Core', 'Headlamp with 450 lumens, rechargeable battery, excellent brightness, 2.9oz', 59.99, 72, 85),
('BioLite HeadLamp 800', 'Headlamp with 800 lumens, rechargeable battery, excellent brightness, 2.8oz', 79.99, 72, 80),
('Fenix HM65R', 'Headlamp with 1400 lumens, rechargeable battery, excellent brightness, 4.2oz', 99.99, 72, 75),
('Nitecore NU25', 'Ultralight headlamp with 360 lumens, rechargeable battery, excellent brightness, 1.2oz', 39.99, 72, 95),
('Black Diamond Storm 450', 'Headlamp with 450 lumens, waterproof, excellent brightness, 3.8oz', 69.99, 72, 82),
('Petzl Tikka', 'Headlamp with 300 lumens, excellent brightness, affordable, 2.6oz', 29.99, 72, 100),
('BioLite HeadLamp 330', 'Headlamp with 330 lumens, rechargeable battery, excellent brightness, 2.1oz', 49.99, 72, 88),
('Fenix HM50R', 'Headlamp with 500 lumens, rechargeable battery, excellent brightness, 1.9oz', 59.99, 72, 86),
('Nitecore HC65', 'Headlamp with 1000 lumens, rechargeable battery, excellent brightness, 3.2oz', 89.99, 72, 78),
('Black Diamond Spot 350', 'Headlamp with 350 lumens, rechargeable battery, excellent brightness, 3.1oz', 39.99, 72, 92),
('Petzl Reactik+', 'Headlamp with 450 lumens, rechargeable battery, excellent brightness, 3.4oz', 69.99, 72, 83),
('BioLite HeadLamp 200', 'Headlamp with 200 lumens, rechargeable battery, excellent brightness, 1.8oz', 34.99, 72, 97),
('Fenix HM70R', 'Headlamp with 1600 lumens, rechargeable battery, excellent brightness, 4.8oz', 119.99, 72, 70),
('Nitecore NU20', 'Ultralight headlamp with 360 lumens, rechargeable battery, excellent brightness, 1.0oz', 29.99, 72, 98),
('Black Diamond Icon 700', 'Headlamp with 700 lumens, rechargeable battery, excellent brightness, 4.1oz', 79.99, 72, 79),
('Petzl Swift RL', 'Headlamp with 900 lumens, rechargeable battery, excellent brightness, 3.6oz', 89.99, 72, 77),
('BioLite HeadLamp 425', 'Headlamp with 425 lumens, rechargeable battery, excellent brightness, 2.5oz', 64.99, 72, 84),
('Fenix HM61R', 'Headlamp with 1400 lumens, rechargeable battery, excellent brightness, 3.9oz', 94.99, 72, 81),
('Nitecore HC60', 'Headlamp with 1000 lumens, rechargeable battery, excellent brightness, 3.5oz', 84.99, 72, 82);

-- Child Category 73: Water Bottles & Filters (subcategory_id: 15, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Nalgene Wide Mouth 32oz', 'Water bottle with BPA-free plastic, durable construction, leak-proof, 32oz capacity', 14.99, 73, 150),
('Hydro Flask 32oz', 'Insulated water bottle with excellent temperature retention, durable construction, 32oz', 39.99, 73, 120),
('CamelBak Chute Mag 32oz', 'Water bottle with magnetic cap, durable construction, leak-proof, 32oz capacity', 24.99, 73, 135),
('Sawyer Squeeze', 'Water filter with excellent filtration, lightweight, easy to use, 1 million gallon capacity', 39.99, 73, 110),
('LifeStraw Personal', 'Water filter with excellent filtration, lightweight, easy to use, 1000L capacity', 19.99, 73, 130),
('Katadyn BeFree', 'Water filter with excellent filtration, lightweight, easy to use, 1000L capacity', 44.99, 73, 105),
('MSR Trail Shot', 'Water filter with excellent filtration, lightweight, easy to use, 1000L capacity', 49.99, 73, 100),
('Platypus GravityWorks', 'Water filter system with excellent filtration, gravity-fed, 1000L capacity', 89.99, 73, 85),
('Nalgene Narrow Mouth 32oz', 'Water bottle with BPA-free plastic, durable construction, leak-proof, 32oz capacity', 12.99, 73, 155),
('Hydro Flask 40oz', 'Insulated water bottle with excellent temperature retention, durable construction, 40oz', 44.99, 73, 115),
('CamelBak Podium 21oz', 'Water bottle with self-sealing valve, durable construction, leak-proof, 21oz capacity', 19.99, 73, 140),
('Sawyer Mini', 'Water filter with excellent filtration, lightweight, easy to use, 100,000 gallon capacity', 24.99, 73, 125),
('LifeStraw Go', 'Water filter bottle with excellent filtration, lightweight, easy to use, 1000L capacity', 29.99, 73, 120),
('Katadyn Hiker Pro', 'Water filter with excellent filtration, lightweight, easy to use, 1000L capacity', 79.99, 73, 90),
('MSR Guardian', 'Water filter with excellent filtration, lightweight, easy to use, 10,000L capacity', 349.99, 73, 50),
('Platypus QuickDraw', 'Water filter with excellent filtration, lightweight, easy to use, 1000L capacity', 34.99, 73, 115),
('Nalgene Wide Mouth 48oz', 'Water bottle with BPA-free plastic, durable construction, leak-proof, 48oz capacity', 16.99, 73, 148),
('Hydro Flask 24oz', 'Insulated water bottle with excellent temperature retention, durable construction, 24oz', 34.99, 73, 125),
('CamelBak Eddy+ 25oz', 'Water bottle with bite valve, durable construction, leak-proof, 25oz capacity', 22.99, 73, 138),
('Sawyer Select', 'Water filter with excellent filtration, lightweight, easy to use, 1 million gallon capacity', 49.99, 73, 108);

-- Child Category 74: First Aid Kits (subcategory_id: 15, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Adventure Medical Kits Ultralight', 'First aid kit with essential supplies, lightweight, compact design, 0.3lbs', 24.99, 74, 120),
('REI Co-op Backpacker', 'First aid kit with comprehensive supplies, excellent organization, 0.8lbs', 34.99, 74, 110),
('SOL Survival Kit', 'Emergency kit with essential supplies, compact design, lightweight, 0.2lbs', 19.99, 74, 130),
('Adventure Medical Kits Mountain', 'First aid kit with comprehensive supplies, excellent organization, 0.6lbs', 39.99, 74, 105),
('REI Co-op Day Hiker', 'First aid kit with essential supplies, compact design, affordable, 0.4lbs', 19.99, 74, 125),
('SOL Survival Kit Plus', 'Emergency kit with comprehensive supplies, compact design, lightweight, 0.3lbs', 29.99, 74, 115),
('Adventure Medical Kits Day Tripper', 'First aid kit with essential supplies, compact design, lightweight, 0.2lbs', 14.99, 74, 135),
('REI Co-op Ultralight', 'First aid kit with essential supplies, lightweight, compact design, 0.2lbs', 24.99, 74, 120),
('SOL Survival Kit Pro', 'Emergency kit with comprehensive supplies, compact design, lightweight, 0.4lbs', 39.99, 74, 100),
('Adventure Medical Kits Weekender', 'First aid kit with comprehensive supplies, excellent organization, 0.5lbs', 29.99, 74, 112),
('REI Co-op Explorer', 'First aid kit with comprehensive supplies, excellent organization, 1.2lbs', 49.99, 74, 95),
('SOL Survival Kit Deluxe', 'Emergency kit with comprehensive supplies, compact design, lightweight, 0.5lbs', 49.99, 74, 98),
('Adventure Medical Kits Explorer', 'First aid kit with comprehensive supplies, excellent organization, 0.7lbs', 44.99, 74, 102),
('REI Co-op Comprehensive', 'First aid kit with comprehensive supplies, excellent organization, 1.5lbs', 59.99, 74, 88),
('SOL Survival Kit Ultimate', 'Emergency kit with comprehensive supplies, compact design, lightweight, 0.6lbs', 59.99, 74, 92),
('Adventure Medical Kits Comprehensive', 'First aid kit with comprehensive supplies, excellent organization, 1.0lbs', 54.99, 74, 96),
('REI Co-op Professional', 'First aid kit with comprehensive supplies, excellent organization, 2.0lbs', 79.99, 74, 80),
('SOL Survival Kit Expedition', 'Emergency kit with comprehensive supplies, compact design, lightweight, 0.7lbs', 69.99, 74, 90),
('Adventure Medical Kits Professional', 'First aid kit with comprehensive supplies, excellent organization, 1.5lbs', 69.99, 74, 94),
('REI Co-op Expedition', 'First aid kit with comprehensive supplies, excellent organization, 2.5lbs', 99.99, 74, 75);

-- Child Category 75: Hiking Gear (subcategory_id: 15, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Black Diamond Positron Screwgate', 'Carabiner with screwgate, excellent strength, durable construction, 3.2oz', 14.99, 75, 150),
('Petzl Attache', 'Carabiner with screwgate, excellent strength, durable construction, 2.8oz', 12.99, 75, 160),
('Metolius FS Mini', 'Carabiner with screwgate, excellent strength, lightweight, 1.8oz', 9.99, 75, 170),
('Black Diamond Dynex Runner', 'Runner with excellent strength, durable construction, lightweight, 0.5oz', 8.99, 75, 180),
('Petzl Tibloc', 'Ascender with excellent grip, durable construction, lightweight, 1.2oz', 24.99, 75, 140),
('Metolius Personal Anchor', 'Anchor with excellent strength, durable construction, lightweight, 2.1oz', 19.99, 75, 145),
('Black Diamond ATC-XP', 'Belay device with excellent control, durable construction, lightweight, 2.8oz', 29.99, 75, 130),
('Petzl Grigri+', 'Belay device with assisted braking, excellent control, durable construction, 6.3oz', 99.99, 75, 100),
('Metolius Master Cam', 'Camming device with excellent holding power, durable construction, various sizes', 79.99, 75, 110),
('Black Diamond Camalot', 'Camming device with excellent holding power, durable construction, various sizes', 89.99, 75, 105),
('Petzl Reverso', 'Belay device with excellent control, durable construction, lightweight, 2.1oz', 34.99, 75, 125),
('Metolius Ultralight Master Cam', 'Camming device with excellent holding power, lightweight, various sizes', 69.99, 75, 115),
('Black Diamond Positron Wiregate', 'Carabiner with wiregate, excellent strength, durable construction, 2.1oz', 11.99, 75, 165),
('Petzl Ange S', 'Carabiner with wiregate, excellent strength, lightweight, 1.5oz', 9.99, 75, 175),
('Metolius FS Mini Wiregate', 'Carabiner with wiregate, excellent strength, lightweight, 1.2oz', 7.99, 75, 185),
('Black Diamond Dynex Quickdraw', 'Quickdraw with excellent strength, durable construction, lightweight, 3.2oz', 24.99, 75, 135),
('Petzl Djinn Axess', 'Quickdraw with excellent strength, durable construction, lightweight, 3.1oz', 22.99, 75, 140),
('Metolius Draw', 'Quickdraw with excellent strength, durable construction, lightweight, 3.0oz', 19.99, 75, 145),
('Black Diamond ATC Guide', 'Belay device with guide mode, excellent control, durable construction, 3.2oz', 34.99, 75, 128),
('Petzl Verso', 'Belay device with excellent control, durable construction, lightweight, 1.9oz', 24.99, 75, 138);

-- Child Category 76: Engine Parts (subcategory_id: 16, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Fram Oil Filter XG10060', 'Engine oil filter with excellent filtration, durable construction, easy installation', 12.99, 76, 200),
('Bosch Spark Plug 4504', 'Spark plug with excellent performance, durable construction, easy installation', 4.99, 76, 300),
('ACDelco Air Filter A1163C', 'Engine air filter with excellent filtration, durable construction, easy installation', 24.99, 76, 180),
('Mobil 1 Engine Oil 5W-30', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 29.99, 76, 250),
('NGK Spark Plug 5464', 'Spark plug with excellent performance, durable construction, easy installation', 5.99, 76, 280),
('K&N Air Filter 33-2304', 'High-performance air filter with excellent filtration, reusable, easy installation', 54.99, 76, 150),
('Fram Fuel Filter G3727', 'Fuel filter with excellent filtration, durable construction, easy installation', 14.99, 76, 190),
('Bosch Oxygen Sensor 15730', 'Oxygen sensor with excellent accuracy, durable construction, easy installation', 89.99, 76, 120),
('ACDelco PCV Valve CV892C', 'PCV valve with excellent performance, durable construction, easy installation', 12.99, 76, 210),
('Castrol GTX Engine Oil 5W-30', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 19.99, 76, 270),
('Fram Oil Filter PH8A', 'Engine oil filter with excellent filtration, durable construction, easy installation', 10.99, 76, 220),
('Bosch Spark Plug 4417', 'Spark plug with excellent performance, durable construction, easy installation', 6.99, 76, 260),
('ACDelco Air Filter A1237C', 'Engine air filter with excellent filtration, durable construction, easy installation', 22.99, 76, 195),
('Mobil 1 Engine Oil 0W-20', 'Synthetic engine oil with excellent protection, 5-quart bottle, high performance', 31.99, 76, 240),
('NGK Spark Plug 5465', 'Spark plug with excellent performance, durable construction, easy installation', 7.99, 76, 250),
('K&N Air Filter 33-2038', 'High-performance air filter with excellent filtration, reusable, easy installation', 49.99, 76, 160),
('Fram Fuel Filter G8016', 'Fuel filter with excellent filtration, durable construction, easy installation', 16.99, 76, 175),
('Bosch Oxygen Sensor 15733', 'Oxygen sensor with excellent accuracy, durable construction, easy installation', 94.99, 76, 115),
('ACDelco PCV Valve CV774C', 'PCV valve with excellent performance, durable construction, easy installation', 14.99, 76, 200),
('Castrol GTX Engine Oil 10W-30', 'Conventional engine oil with excellent protection, 5-quart bottle, reliable', 18.99, 76, 280);

-- Child Category 77: Brake Components (subcategory_id: 16, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Bosch QuietCast Brake Pads', 'Brake pads with excellent stopping power, quiet operation, durable, front set', 49.99, 77, 150),
('ACDelco Brake Rotor 18A1071', 'Brake rotor with excellent performance, durable construction, easy installation', 79.99, 77, 120),
('Wagner ThermoQuiet Brake Pads', 'Brake pads with excellent stopping power, quiet operation, durable, front set', 44.99, 77, 160),
('PowerStop Brake Rotor KOE1720', 'Brake rotor with excellent performance, durable construction, easy installation', 89.99, 77, 110),
('Raybestos Brake Pads EHT1680H', 'Brake pads with excellent stopping power, quiet operation, durable, front set', 39.99, 77, 170),
('ACDelco Brake Rotor 18A1072', 'Brake rotor with excellent performance, durable construction, easy installation', 84.99, 77, 115),
('Bosch QuietCast Premium', 'Brake pads with excellent stopping power, quiet operation, premium quality, front set', 59.99, 77, 140),
('PowerStop Brake Rotor KOE1721', 'Brake rotor with excellent performance, durable construction, easy installation', 94.99, 77, 105),
('Wagner ThermoQuiet Premium', 'Brake pads with excellent stopping power, quiet operation, premium quality, front set', 54.99, 77, 145),
('Raybestos Brake Rotor 680063R', 'Brake rotor with excellent performance, durable construction, easy installation', 74.99, 77, 125),
('Bosch QuietCast Rear', 'Brake pads with excellent stopping power, quiet operation, durable, rear set', 44.99, 77, 155),
('ACDelco Brake Rotor 18A1073', 'Brake rotor with excellent performance, durable construction, easy installation', 69.99, 77, 130),
('Wagner ThermoQuiet Rear', 'Brake pads with excellent stopping power, quiet operation, durable, rear set', 39.99, 77, 165),
('PowerStop Brake Rotor KOE1722', 'Brake rotor with excellent performance, durable construction, easy installation', 79.99, 77, 120),
('Raybestos Brake Pads EHT1681H', 'Brake pads with excellent stopping power, quiet operation, durable, rear set', 34.99, 77, 175),
('ACDelco Brake Rotor 18A1074', 'Brake rotor with excellent performance, durable construction, easy installation', 74.99, 77, 125),
('Bosch QuietCast Complete Set', 'Brake pads with excellent stopping power, quiet operation, complete set', 99.99, 77, 135),
('PowerStop Brake Rotor Complete Set', 'Brake rotors with excellent performance, durable construction, complete set', 179.99, 77, 100),
('Wagner ThermoQuiet Complete Set', 'Brake pads with excellent stopping power, quiet operation, complete set', 89.99, 77, 140),
('Raybestos Brake Rotor Complete Set', 'Brake rotors with excellent performance, durable construction, complete set', 149.99, 77, 110);

-- Child Category 78: Suspension Parts (subcategory_id: 16, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Monroe Shock Absorber 555001', 'Shock absorber with excellent performance, durable construction, easy installation', 49.99, 78, 130),
('KYB Gas-a-Just Shock 343134', 'Shock absorber with excellent performance, durable construction, easy installation', 54.99, 78, 125),
('Bilstein Shock Absorber 24-186643', 'Premium shock absorber with excellent performance, durable construction, easy installation', 129.99, 78, 90),
('ACDelco Strut 530-435', 'Strut assembly with excellent performance, durable construction, easy installation', 149.99, 78, 85),
('Monroe Quick-Strut 171780', 'Complete strut assembly with excellent performance, easy installation, all-in-one', 199.99, 78, 75),
('KYB Excel-G Shock 343135', 'Shock absorber with excellent performance, durable construction, easy installation', 49.99, 78, 128),
('Bilstein Shock Absorber 24-186644', 'Premium shock absorber with excellent performance, durable construction, easy installation', 134.99, 78, 88),
('ACDelco Strut 530-436', 'Strut assembly with excellent performance, durable construction, easy installation', 154.99, 78, 82),
('Monroe Quick-Strut 171781', 'Complete strut assembly with excellent performance, easy installation, all-in-one', 204.99, 78, 72),
('KYB Gas-a-Just Shock 343136', 'Shock absorber with excellent performance, durable construction, easy installation', 59.99, 78, 120),
('Bilstein Shock Absorber 24-186645', 'Premium shock absorber with excellent performance, durable construction, easy installation', 139.99, 78, 86),
('ACDelco Strut 530-437', 'Strut assembly with excellent performance, durable construction, easy installation', 159.99, 78, 80),
('Monroe Quick-Strut 171782', 'Complete strut assembly with excellent performance, easy installation, all-in-one', 209.99, 78, 70),
('KYB Excel-G Shock 343137', 'Shock absorber with excellent performance, durable construction, easy installation', 52.99, 78, 123),
('Bilstein Shock Absorber 24-186646', 'Premium shock absorber with excellent performance, durable construction, easy installation', 144.99, 78, 84),
('ACDelco Strut 530-438', 'Strut assembly with excellent performance, durable construction, easy installation', 164.99, 78, 78),
('Monroe Quick-Strut 171783', 'Complete strut assembly with excellent performance, easy installation, all-in-one', 214.99, 78, 68),
('KYB Gas-a-Just Shock 343138', 'Shock absorber with excellent performance, durable construction, easy installation', 64.99, 78, 118),
('Bilstein Shock Absorber 24-186647', 'Premium shock absorber with excellent performance, durable construction, easy installation', 149.99, 78, 82),
('ACDelco Strut 530-439', 'Strut assembly with excellent performance, durable construction, easy installation', 169.99, 78, 76);

-- Child Category 79: Exhaust Systems (subcategory_id: 16, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Flowmaster Super 40 Muffler', 'Muffler with excellent sound, durable construction, easy installation', 89.99, 79, 100),
('Magnaflow Exhaust Muffler 11216', 'Muffler with excellent sound, durable construction, easy installation', 119.99, 79, 90),
('Borla Exhaust System 140369', 'Complete exhaust system with excellent sound, durable construction, easy installation', 899.99, 79, 40),
('Walker Exhaust Muffler 21466', 'Muffler with excellent sound, durable construction, affordable, easy installation', 69.99, 79, 110),
('Flowmaster Super 44 Muffler', 'Muffler with excellent sound, durable construction, easy installation', 94.99, 79, 95),
('Magnaflow Exhaust Muffler 11217', 'Muffler with excellent sound, durable construction, easy installation', 124.99, 79, 88),
('Borla Exhaust System 140370', 'Complete exhaust system with excellent sound, durable construction, easy installation', 949.99, 79, 38),
('Walker Exhaust Muffler 21467', 'Muffler with excellent sound, durable construction, affordable, easy installation', 74.99, 79, 105),
('Flowmaster Super 50 Muffler', 'Muffler with excellent sound, durable construction, easy installation', 99.99, 79, 92),
('Magnaflow Exhaust Muffler 11218', 'Muffler with excellent sound, durable construction, easy installation', 129.99, 79, 85),
('Borla Exhaust System 140371', 'Complete exhaust system with excellent sound, durable construction, easy installation', 999.99, 79, 35),
('Walker Exhaust Muffler 21468', 'Muffler with excellent sound, durable construction, affordable, easy installation', 79.99, 79, 100),
('Flowmaster Super 10 Muffler', 'Muffler with excellent sound, durable construction, easy installation', 84.99, 79, 98),
('Magnaflow Exhaust Muffler 11219', 'Muffler with excellent sound, durable construction, easy installation', 134.99, 79, 82),
('Borla Exhaust System 140372', 'Complete exhaust system with excellent sound, durable construction, easy installation', 1049.99, 79, 33),
('Walker Exhaust Muffler 21469', 'Muffler with excellent sound, durable construction, affordable, easy installation', 84.99, 79, 95),
('Flowmaster Super 70 Muffler', 'Muffler with excellent sound, durable construction, easy installation', 104.99, 79, 90),
('Magnaflow Exhaust Muffler 11220', 'Muffler with excellent sound, durable construction, easy installation', 139.99, 79, 80),
('Borla Exhaust System 140373', 'Complete exhaust system with excellent sound, durable construction, easy installation', 1099.99, 79, 30),
('Walker Exhaust Muffler 21470', 'Muffler with excellent sound, durable construction, affordable, easy installation', 89.99, 79, 90);

-- Child Category 80: Electrical Parts (subcategory_id: 16, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('ACDelco Battery 24F', 'Car battery with excellent performance, durable construction, 12V, 650 CCA', 129.99, 80, 120),
('Optima RedTop Battery 8020-164', 'Premium car battery with excellent performance, durable construction, 12V, 720 CCA', 199.99, 80, 90),
('Bosch Alternator AL7547X', 'Alternator with excellent performance, durable construction, easy installation', 249.99, 80, 80),
('ACDelco Starter 336-1890', 'Starter motor with excellent performance, durable construction, easy installation', 179.99, 80, 85),
('Denso Alternator 210-0625', 'Alternator with excellent performance, durable construction, easy installation', 229.99, 80, 82),
('ACDelco Battery 24R', 'Car battery with excellent performance, durable construction, 12V, 600 CCA', 119.99, 80, 125),
('Optima YellowTop Battery 8014-045', 'Premium car battery with excellent performance, durable construction, 12V, 750 CCA', 219.99, 80, 88),
('Bosch Alternator AL7548X', 'Alternator with excellent performance, durable construction, easy installation', 254.99, 80, 78),
('ACDelco Starter 336-1891', 'Starter motor with excellent performance, durable construction, easy installation', 184.99, 80, 83),
('Denso Alternator 210-0626', 'Alternator with excellent performance, durable construction, easy installation', 234.99, 80, 80),
('ACDelco Battery 24', 'Car battery with excellent performance, durable construction, 12V, 700 CCA', 134.99, 80, 118),
('Optima BlueTop Battery 8014-218', 'Premium car battery with excellent performance, durable construction, 12V, 800 CCA', 239.99, 80, 85),
('Bosch Alternator AL7549X', 'Alternator with excellent performance, durable construction, easy installation', 259.99, 80, 76),
('ACDelco Starter 336-1892', 'Starter motor with excellent performance, durable construction, easy installation', 189.99, 80, 81),
('Denso Alternator 210-0627', 'Alternator with excellent performance, durable construction, easy installation', 239.99, 80, 78),
('ACDelco Battery 27F', 'Car battery with excellent performance, durable construction, 12V, 750 CCA', 144.99, 80, 115),
('Optima RedTop Battery 8020-165', 'Premium car battery with excellent performance, durable construction, 12V, 800 CCA', 209.99, 80, 87),
('Bosch Alternator AL7550X', 'Alternator with excellent performance, durable construction, easy installation', 264.99, 80, 74),
('ACDelco Starter 336-1893', 'Starter motor with excellent performance, durable construction, easy installation', 194.99, 80, 79),
('Denso Alternator 210-0628', 'Alternator with excellent performance, durable construction, easy installation', 244.99, 80, 76);

-- Child Category 81: Phone Mounts (subcategory_id: 17, category_id: 4)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('iOttie Easy One Touch 5', 'Car phone mount with one-touch release, strong suction, adjustable, universal fit', 24.99, 81, 180),
('Spigen MagSafe Car Mount', 'Car phone mount with MagSafe technology, strong magnetic hold, adjustable, universal fit', 34.99, 81, 170),
('ESR HaloLock Car Mount', 'Car phone mount with MagSafe compatibility, strong magnetic hold, adjustable, universal fit', 29.99, 81, 175),
('Belkin Car Vent Mount Pro', 'Car phone mount with vent clip, strong grip, adjustable, universal fit', 39.99, 81, 165),
('Anker PowerWave Car Mount', 'Car phone mount with wireless charging, strong grip, adjustable, universal fit', 49.99, 81, 155),
('iOttie Easy One Touch 4', 'Car phone mount with one-touch release, strong suction, adjustable, universal fit', 19.99, 81, 185),
('Spigen MagSafe Vent Mount', 'Car phone mount with MagSafe technology, vent clip, strong magnetic hold, universal fit', 29.99, 81, 178),
('ESR HaloLock Vent Mount', 'Car phone mount with MagSafe compatibility, vent clip, strong magnetic hold, universal fit', 24.99, 81, 182),
('Belkin Car Dashboard Mount', 'Car phone mount with dashboard clip, strong grip, adjustable, universal fit', 34.99, 81, 172),
('Anker PowerWave Stand', 'Car phone mount with wireless charging, strong grip, adjustable, universal fit', 44.99, 81, 162),
('iOttie Easy One Touch 3', 'Car phone mount with one-touch release, strong suction, adjustable, universal fit', 14.99, 81, 190),
('Spigen MagSafe Dashboard Mount', 'Car phone mount with MagSafe technology, dashboard clip, strong magnetic hold, universal fit', 39.99, 81, 168),
('ESR HaloLock Dashboard Mount', 'Car phone mount with MagSafe compatibility, dashboard clip, strong magnetic hold, universal fit', 34.99, 81, 170),
('Belkin Car Cup Holder Mount', 'Car phone mount with cup holder clip, strong grip, adjustable, universal fit', 29.99, 81, 176),
('Anker PowerWave Magnetic', 'Car phone mount with wireless charging, magnetic hold, adjustable, universal fit', 54.99, 81, 150),
('iOttie Easy One Touch 2', 'Car phone mount with one-touch release, strong suction, adjustable, universal fit', 9.99, 81, 195),
('Spigen MagSafe Cup Holder Mount', 'Car phone mount with MagSafe technology, cup holder clip, strong magnetic hold, universal fit', 24.99, 81, 180),
('ESR HaloLock Cup Holder Mount', 'Car phone mount with MagSafe compatibility, cup holder clip, strong magnetic hold, universal fit', 19.99, 81, 184),
('Belkin Car CD Slot Mount', 'Car phone mount with CD slot clip, strong grip, adjustable, universal fit', 19.99, 81, 186),
('Anker PowerWave Pro', 'Car phone mount with wireless charging, strong grip, adjustable, universal fit', 59.99, 81, 148);

