-- Product Data for Ecommerce Database
-- This file contains products for child categories 62-71 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 62-71
-- ============================================

-- Child Category 62: Hiking Jackets (subcategory_id: 13, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Arc\'teryx Beta AR', 'Hiking jacket with Gore-Tex Pro, excellent weather protection, durable construction', 449.99, 62, 50),
('Patagonia Houdini', 'Lightweight hiking jacket with wind protection, packable design, breathable', 99.99, 62, 80),
('The North Face Venture 2', 'Waterproof hiking jacket with DryVent, excellent weather protection, affordable', 129.99, 62, 75),
('Columbia OutDry Extreme', 'Waterproof hiking jacket with OutDry technology, excellent weather protection', 149.99, 62, 70),
('REI Co-op Rainier', 'Waterproof hiking jacket with excellent weather protection, good value', 89.99, 62, 85),
('Marmot PreCip Eco', 'Waterproof hiking jacket with NanoPro, excellent weather protection, sustainable', 119.99, 62, 78),
('Outdoor Research Helium', 'Ultralight waterproof hiking jacket with Pertex Shield, packable design', 159.99, 62, 68),
('Rab Downpour Plus', 'Waterproof hiking jacket with Pertex Shield, excellent weather protection', 179.99, 62, 65),
('Fjällräven Keb', 'Hiking jacket with G-1000 fabric, excellent weather resistance, durable', 249.99, 62, 58),
('Mountain Hardwear Stretch Ozonic', 'Waterproof hiking jacket with Dry.Q Elite, stretch fabric, comfortable', 199.99, 62, 72),
('Arc\'teryx Zeta SL', 'Lightweight waterproof hiking jacket with Gore-Tex, packable design', 299.99, 62, 55),
('Patagonia Torrentshell 3L', 'Waterproof hiking jacket with H2No, excellent weather protection, sustainable', 149.99, 62, 73),
('The North Face Apex Flex', 'Softshell hiking jacket with excellent weather resistance, stretch fabric', 179.99, 62, 67),
('Columbia Watertight II', 'Waterproof hiking jacket with Omni-Tech, excellent weather protection, affordable', 79.99, 62, 88),
('REI Co-op XeroDry GTX', 'Waterproof hiking jacket with Gore-Tex, excellent weather protection', 199.99, 62, 64),
('Marmot Minimalist', 'Waterproof hiking jacket with Gore-Tex, excellent weather protection, packable', 229.99, 62, 60),
('Outdoor Research Foray', 'Waterproof hiking jacket with Gore-Tex, excellent weather protection, pit zips', 249.99, 62, 57),
('Rab Kinetic Plus', 'Waterproof hiking jacket with Pertex Shield, stretch fabric, comfortable', 199.99, 62, 69),
('Fjällräven Keb Eco-Shell', 'Waterproof hiking jacket with Eco-Shell, excellent weather protection, sustainable', 279.99, 62, 52),
('Mountain Hardwear Exposure/2', 'Waterproof hiking jacket with Dry.Q Elite, excellent weather protection', 219.99, 62, 61);

-- Child Category 63: Base Layers (subcategory_id: 13, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Smartwool Merino 250', 'Base layer with merino wool, excellent moisture-wicking, odor-resistant, comfortable', 89.99, 63, 90),
('Icebreaker Tech Lite', 'Base layer with merino wool, excellent moisture-wicking, odor-resistant, lightweight', 79.99, 63, 95),
('Patagonia Capilene Midweight', 'Base layer with synthetic fabric, excellent moisture-wicking, quick-dry', 69.99, 63, 100),
('Arc\'teryx Phase AR', 'Base layer with synthetic fabric, excellent moisture-wicking, comfortable', 99.99, 63, 85),
('The North Face Warm', 'Base layer with synthetic fabric, excellent moisture-wicking, warm, comfortable', 59.99, 63, 105),
('Columbia Omni-Heat', 'Base layer with reflective technology, excellent warmth, moisture-wicking', 64.99, 63, 102),
('REI Co-op Merino 185', 'Base layer with merino wool, excellent moisture-wicking, affordable', 49.99, 63, 110),
('Marmot Midweight', 'Base layer with synthetic fabric, excellent moisture-wicking, comfortable', 54.99, 63, 108),
('Outdoor Research Echo', 'Base layer with synthetic fabric, excellent moisture-wicking, lightweight', 44.99, 63, 112),
('Rab Merino+ 200', 'Base layer with merino wool, excellent moisture-wicking, odor-resistant', 84.99, 63, 92),
('Smartwool Merino 150', 'Lightweight base layer with merino wool, excellent moisture-wicking, comfortable', 79.99, 63, 94),
('Icebreaker Oasis', 'Base layer with merino wool, excellent moisture-wicking, odor-resistant', 89.99, 63, 88),
('Patagonia Capilene Lightweight', 'Lightweight base layer with synthetic fabric, excellent moisture-wicking', 59.99, 63, 103),
('Arc\'teryx Phase SL', 'Ultralight base layer with synthetic fabric, excellent moisture-wicking', 79.99, 63, 96),
('The North Face Warm 2', 'Base layer with synthetic fabric, excellent moisture-wicking, warm', 64.99, 63, 101),
('Columbia Omni-Heat Midweight', 'Base layer with reflective technology, excellent warmth, moisture-wicking', 69.99, 63, 98),
('REI Co-op Merino 250', 'Base layer with merino wool, excellent moisture-wicking, good value', 59.99, 63, 104),
('Marmot Midweight Crew', 'Base layer with synthetic fabric, excellent moisture-wicking, comfortable', 64.99, 63, 99),
('Outdoor Research Echo Tee', 'Base layer with synthetic fabric, excellent moisture-wicking, lightweight', 49.99, 63, 106),
('Rab Merino+ 160', 'Lightweight base layer with merino wool, excellent moisture-wicking', 74.99, 63, 97);

-- Child Category 64: Hiking Shirts (subcategory_id: 13, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Patagonia Capilene Cool Daily', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, UPF protection', 39.99, 64, 120),
('Arc\'teryx Cormac', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, lightweight', 69.99, 64, 100),
('The North Face DryVent', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, UPF protection', 49.99, 64, 115),
('Columbia Silver Ridge', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, UPF protection, affordable', 34.99, 64, 130),
('REI Co-op Sahara', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, UPF protection', 29.99, 64, 135),
('Marmot Aegis', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, UPF protection', 44.99, 64, 125),
('Outdoor Research Echo', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, lightweight', 39.99, 64, 128),
('Rab Force', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, UPF protection', 54.99, 64, 118),
('Fjällräven Abisko', 'Hiking shirt with durable fabric, excellent breathability, comfortable', 79.99, 64, 105),
('Mountain Hardwear Canyon', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, UPF protection', 49.99, 64, 122),
('Patagonia Capilene Cool Trail', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, UPF protection', 44.99, 64, 123),
('Arc\'teryx Cormac Crew', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, lightweight', 64.99, 64, 108),
('The North Face Paramount', 'Hiking shirt with synthetic fabric, excellent moisture-wicking, UPF protection', 54.99, 64, 112),
('Columbia Silver Ridge Lite', 'Lightweight hiking shirt with synthetic fabric, excellent moisture-wicking, UPF', 29.99, 64, 138),
('REI Co-op Sahara T-Shirt', 'Hiking t-shirt with synthetic fabric, excellent moisture-wicking, UPF protection', 24.99, 64, 140),
('Marmot Aegis Long Sleeve', 'Long sleeve hiking shirt with synthetic fabric, excellent moisture-wicking, UPF', 49.99, 64, 120),
('Outdoor Research Echo Long Sleeve', 'Long sleeve hiking shirt with synthetic fabric, excellent moisture-wicking', 44.99, 64, 124),
('Rab Force Long Sleeve', 'Long sleeve hiking shirt with synthetic fabric, excellent moisture-wicking, UPF', 59.99, 64, 115),
('Fjällräven Abisko Lite', 'Lightweight hiking shirt with durable fabric, excellent breathability', 69.99, 64, 110),
('Mountain Hardwear Canyon Long Sleeve', 'Long sleeve hiking shirt with synthetic fabric, excellent moisture-wicking, UPF', 54.99, 64, 117);

-- Child Category 65: Hiking Accessories (subcategory_id: 13, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Outdoor Research Sun Runner Cap', 'Hiking cap with UPF protection, adjustable fit, moisture-wicking, 2-pack', 24.99, 65, 150),
('Buff Original', 'Multifunctional headwear with moisture-wicking, UV protection, versatile', 19.99, 65, 180),
('Black Diamond Spot 400', 'Headlamp with 400 lumens, rechargeable battery, excellent brightness', 49.99, 65, 120),
('Smartwool Hiking Socks', 'Hiking socks with merino wool, excellent cushioning, moisture-wicking, 3-pack', 29.99, 65, 200),
('Darn Tough Hiking Socks', 'Hiking socks with merino wool, excellent cushioning, lifetime guarantee, 3-pack', 34.99, 65, 190),
('Outdoor Research ActiveIce Bandana', 'Cooling bandana with moisture-wicking, UV protection, versatile', 14.99, 65, 220),
('Patagonia Capilene Beanie', 'Hiking beanie with synthetic fabric, excellent warmth, moisture-wicking', 29.99, 65, 170),
('Arc\'teryx Rho Beanie', 'Hiking beanie with synthetic fabric, excellent warmth, lightweight', 39.99, 65, 160),
('The North Face Etip Gloves', 'Hiking gloves with touchscreen compatibility, excellent warmth, comfortable', 34.99, 65, 175),
('Columbia Omni-Heat Gloves', 'Hiking gloves with reflective technology, excellent warmth, touchscreen compatible', 39.99, 65, 170),
('REI Co-op Merino Gloves', 'Hiking gloves with merino wool, excellent warmth, comfortable', 24.99, 65, 185),
('Marmot Windstopper Gloves', 'Hiking gloves with wind protection, excellent warmth, comfortable', 44.99, 65, 165),
('Outdoor Research PL 400 Sensor', 'Hiking gloves with touchscreen compatibility, excellent warmth, waterproof', 49.99, 65, 155),
('Rab Power Stretch Gloves', 'Hiking gloves with stretch fabric, excellent warmth, comfortable', 34.99, 65, 175),
('Fjällräven Abisko Gloves', 'Hiking gloves with durable fabric, excellent warmth, comfortable', 54.99, 65, 150),
('Mountain Hardwear Power Stretch Gloves', 'Hiking gloves with stretch fabric, excellent warmth, comfortable', 39.99, 65, 168),
('Outdoor Research Sun Bucket Hat', 'Hiking hat with UPF protection, wide brim, adjustable fit', 34.99, 65, 165),
('Buff CoolNet UV', 'Multifunctional headwear with cooling technology, UV protection, versatile', 24.99, 65, 190),
('Black Diamond Spot 350', 'Headlamp with 350 lumens, rechargeable battery, excellent brightness', 39.99, 65, 130),
('Smartwool Hiking Crew Socks', 'Hiking socks with merino wool, excellent cushioning, moisture-wicking, 3-pack', 32.99, 65, 195);

-- Child Category 66: Trekking Poles (subcategory_id: 14, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Black Diamond Distance Carbon Z', 'Carbon fiber trekking poles with Z-pole design, lightweight, packable, 2-pack', 169.99, 66, 70),
('Leki Micro Vario Carbon', 'Carbon fiber trekking poles with adjustable length, excellent shock absorption, 2-pack', 199.99, 66, 65),
('REI Co-op Flash Carbon', 'Carbon fiber trekking poles with Z-pole design, lightweight, affordable, 2-pack', 129.99, 66, 80),
('Komperdell Carbon Powerlock', 'Carbon fiber trekking poles with adjustable length, excellent grip, 2-pack', 179.99, 66, 68),
('Cascade Mountain Tech Carbon', 'Carbon fiber trekking poles with adjustable length, excellent value, 2-pack', 49.99, 66, 100),
('Black Diamond Trail Pro', 'Aluminum trekking poles with adjustable length, excellent durability, 2-pack', 99.99, 66, 85),
('Leki Makalu Lite', 'Aluminum trekking poles with adjustable length, excellent shock absorption, 2-pack', 149.99, 66, 75),
('REI Co-op Traverse', 'Aluminum trekking poles with adjustable length, excellent value, 2-pack', 79.99, 66, 90),
('Komperdell Powerlock', 'Aluminum trekking poles with adjustable length, excellent grip, 2-pack', 129.99, 66, 78),
('Cascade Mountain Tech', 'Aluminum trekking poles with adjustable length, excellent value, 2-pack', 29.99, 66, 110),
('Black Diamond Alpine Carbon Cork', 'Carbon fiber trekking poles with cork grips, adjustable length, 2-pack', 189.99, 66, 63),
('Leki Carbonlite', 'Carbon fiber trekking poles with adjustable length, excellent shock absorption, 2-pack', 219.99, 66, 58),
('REI Co-op Flash', 'Aluminum trekking poles with Z-pole design, lightweight, affordable, 2-pack', 99.99, 66, 82),
('Komperdell Carbon Vario', 'Carbon fiber trekking poles with adjustable length, excellent grip, 2-pack', 199.99, 66, 60),
('Cascade Mountain Tech Ultra', 'Aluminum trekking poles with adjustable length, excellent value, 2-pack', 39.99, 66, 105),
('Black Diamond Trail Ergo Cork', 'Aluminum trekking poles with cork grips, adjustable length, 2-pack', 119.99, 66, 72),
('Leki Makalu', 'Aluminum trekking poles with adjustable length, excellent shock absorption, 2-pack', 139.99, 66, 77),
('REI Co-op Traverse Carbon', 'Carbon fiber trekking poles with adjustable length, excellent value, 2-pack', 149.99, 66, 73),
('Komperdell Vario', 'Aluminum trekking poles with adjustable length, excellent grip, 2-pack', 109.99, 66, 80),
('Cascade Mountain Tech Pro', 'Aluminum trekking poles with adjustable length, excellent value, 2-pack', 34.99, 66, 108);

-- Child Category 67: Hiking Tents (subcategory_id: 14, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Big Agnes Copper Spur HV UL2', 'Ultralight 2-person tent with excellent space, easy setup, 3lbs', 449.99, 67, 40),
('MSR Hubba Hubba NX 2', 'Lightweight 2-person tent with excellent space, easy setup, 3.8lbs', 399.99, 67, 45),
('REI Co-op Half Dome SL 2+', '2-person tent with excellent space, easy setup, good value, 4.5lbs', 279.99, 67, 50),
('NEMO Hornet Elite 2P', 'Ultralight 2-person tent with excellent space, easy setup, 2.3lbs', 499.99, 67, 35),
('The North Face Stormbreak 2', '2-person tent with excellent space, easy setup, affordable, 5.2lbs', 199.99, 67, 55),
('Coleman Sundome 2', '2-person tent with excellent space, easy setup, very affordable, 7.2lbs', 79.99, 67, 70),
('Marmot Tungsten UL 2P', 'Lightweight 2-person tent with excellent space, easy setup, 3.5lbs', 349.99, 67, 48),
('Outdoor Research Helium', 'Ultralight 1-person tent with excellent space, easy setup, 1.9lbs', 299.99, 67, 52),
('Black Diamond Firstlight', 'Lightweight 1-person tent with excellent space, easy setup, 2.4lbs', 249.99, 67, 54),
('Sea to Summit Telos TR2', 'Lightweight 2-person tent with excellent space, easy setup, 3.2lbs', 379.99, 67, 42),
('Big Agnes Tiger Wall UL2', 'Ultralight 2-person tent with excellent space, easy setup, 2.5lbs', 429.99, 67, 41),
('MSR Elixir 2', '2-person tent with excellent space, easy setup, good value, 4.8lbs', 249.99, 67, 52),
('REI Co-op Quarter Dome SL 2', 'Lightweight 2-person tent with excellent space, easy setup, 3.2lbs', 329.99, 67, 46),
('NEMO Dagger 2P', 'Lightweight 2-person tent with excellent space, easy setup, 3.8lbs', 449.99, 67, 39),
('The North Face Stormbreak 3', '3-person tent with excellent space, easy setup, affordable, 6.2lbs', 229.99, 67, 48),
('Coleman Sundome 4', '4-person tent with excellent space, easy setup, very affordable, 9.8lbs', 99.99, 67, 65),
('Marmot Limelight 2P', '2-person tent with excellent space, easy setup, good value, 4.8lbs', 279.99, 67, 50),
('Outdoor Research Helium Bivy', 'Ultralight bivy tent with excellent space, easy setup, 1.2lbs', 199.99, 67, 58),
('Black Diamond Beta Light', 'Lightweight 1-person tent with excellent space, easy setup, 2.1lbs', 219.99, 67, 56),
('Sea to Summit Telos TR3', 'Lightweight 3-person tent with excellent space, easy setup, 4.2lbs', 429.99, 67, 38);

-- Child Category 68: Sleeping Bags (subcategory_id: 14, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Western Mountaineering Ultralite', 'Premium sleeping bag with 20°F rating, down fill, excellent warmth, 1.9lbs', 549.99, 68, 35),
('REI Co-op Magma 30', 'Lightweight sleeping bag with 30°F rating, down fill, excellent warmth, 1.8lbs', 299.99, 68, 50),
('NEMO Disco 30', 'Comfortable sleeping bag with 30°F rating, synthetic fill, excellent warmth, 2.8lbs', 249.99, 68, 55),
('The North Face One Bag', 'Versatile sleeping bag with 20°F rating, synthetic fill, excellent warmth, 3.2lbs', 199.99, 68, 60),
('Coleman North Rim', 'Sleeping bag with 0°F rating, synthetic fill, excellent warmth, affordable, 6.5lbs', 79.99, 68, 75),
('Marmot Trestles Elite Eco 30', 'Sleeping bag with 30°F rating, synthetic fill, excellent warmth, sustainable, 2.9lbs', 149.99, 68, 65),
('Outdoor Research Helium', 'Lightweight sleeping bag with 30°F rating, down fill, excellent warmth, 1.7lbs', 349.99, 68, 45),
('Black Diamond Vision', 'Sleeping bag with 20°F rating, down fill, excellent warmth, 2.1lbs', 399.99, 68, 42),
('Sea to Summit Spark SPIII', 'Ultralight sleeping bag with 28°F rating, down fill, excellent warmth, 1.2lbs', 429.99, 68, 40),
('Big Agnes Lost Ranger 15', 'Sleeping bag with 15°F rating, synthetic fill, excellent warmth, 3.5lbs', 279.99, 68, 52),
('Western Mountaineering Alpinlite', 'Premium sleeping bag with 20°F rating, down fill, excellent warmth, 1.8lbs', 519.99, 68, 36),
('REI Co-op Magma 15', 'Lightweight sleeping bag with 15°F rating, down fill, excellent warmth, 2.1lbs', 349.99, 68, 48),
('NEMO Riff 30', 'Comfortable sleeping bag with 30°F rating, synthetic fill, excellent warmth, 2.6lbs', 229.99, 68, 57),
('The North Face Furnace 20', 'Sleeping bag with 20°F rating, synthetic fill, excellent warmth, 3.8lbs', 179.99, 68, 62),
('Coleman Big Basin', 'Sleeping bag with 20°F rating, synthetic fill, excellent warmth, affordable, 5.8lbs', 69.99, 68, 78),
('Marmot Trestles Elite Eco 20', 'Sleeping bag with 20°F rating, synthetic fill, excellent warmth, sustainable, 3.2lbs', 169.99, 68, 58),
('Outdoor Research Helium 800', 'Lightweight sleeping bag with 20°F rating, down fill, excellent warmth, 1.9lbs', 379.99, 68, 44),
('Black Diamond Firstlight', 'Sleeping bag with 15°F rating, down fill, excellent warmth, 2.3lbs', 429.99, 68, 39),
('Sea to Summit Spark SPIV', 'Ultralight sleeping bag with 25°F rating, down fill, excellent warmth, 1.3lbs', 449.99, 68, 38),
('Big Agnes Lost Ranger 30', 'Sleeping bag with 30°F rating, synthetic fill, excellent warmth, 3.2lbs', 249.99, 68, 54);

-- Child Category 69: Hiking Stoves (subcategory_id: 14, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('MSR PocketRocket 2', 'Lightweight backpacking stove with excellent performance, compact design, 2.6oz', 44.99, 69, 80),
('Jetboil Flash', 'Integrated cooking system with excellent performance, fast boil time, 13.1oz', 99.99, 69, 70),
('Soto WindMaster', 'Lightweight backpacking stove with excellent wind resistance, compact, 2.9oz', 59.99, 69, 75),
('Primus Lite+', 'Lightweight backpacking stove with excellent performance, compact design, 3.2oz', 49.99, 69, 78),
('Snow Peak LiteMax', 'Ultralight backpacking stove with excellent performance, minimal design, 1.9oz', 69.99, 69, 72),
('Coleman Classic', 'Backpacking stove with excellent performance, affordable, reliable, 14.1oz', 29.99, 69, 90),
('MSR WhisperLite Universal', 'Versatile backpacking stove with excellent performance, multi-fuel, 12.3oz', 119.99, 69, 65),
('Jetboil MiniMo', 'Integrated cooking system with excellent performance, simmer control, 14.8oz', 119.99, 69, 68),
('Soto Amicus', 'Lightweight backpacking stove with excellent wind resistance, affordable, 3.2oz', 39.99, 69, 82),
('Primus OmniLite Ti', 'Lightweight backpacking stove with excellent performance, titanium construction, 3.5oz', 79.99, 69, 70),
('Snow Peak GigaPower', 'Lightweight backpacking stove with excellent performance, compact design, 3.1oz', 54.99, 69, 76),
('Coleman PowerPack', 'Backpacking stove with excellent performance, affordable, reliable, 16.2oz', 34.99, 69, 88),
('MSR Reactor', 'Backpacking stove with excellent performance, wind-resistant, fast boil, 15.2oz', 149.99, 69, 60),
('Jetboil Zip', 'Integrated cooking system with excellent performance, fast boil time, 11.4oz', 79.99, 69, 74),
('Soto WindMaster Stove', 'Lightweight backpacking stove with excellent wind resistance, compact, 3.1oz', 64.99, 69, 73),
('Primus OmniFuel', 'Versatile backpacking stove with excellent performance, multi-fuel, 15.8oz', 129.99, 69, 63),
('Snow Peak LiteMax Stove', 'Ultralight backpacking stove with excellent performance, minimal design, 2.1oz', 74.99, 69, 71),
('Coleman Dual Fuel', 'Backpacking stove with excellent performance, multi-fuel, affordable, 18.5oz', 44.99, 69, 85),
('MSR DragonFly', 'Backpacking stove with excellent performance, multi-fuel, precise control, 14.1oz', 139.99, 69, 62),
('Jetboil Sumo', 'Integrated cooking system with excellent performance, large capacity, 15.3oz', 109.99, 69, 66);

-- Child Category 70: Hiking Tools (subcategory_id: 14, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Leatherman Wave+', 'Multi-tool with 18 tools, excellent quality, durable construction, 8.5oz', 119.99, 70, 85),
('Gerber Multi-Plier 600', 'Multi-tool with 15 tools, excellent quality, durable construction, 9.2oz', 79.99, 70, 90),
('Victorinox Swiss Army Knife', 'Classic multi-tool with multiple tools, excellent quality, compact, 3.5oz', 49.99, 70, 100),
('Benchmade Griptilian', 'Folding knife with excellent blade, durable construction, comfortable grip', 149.99, 70, 75),
('Spyderco Para 3', 'Folding knife with excellent blade, durable construction, lightweight', 179.99, 70, 70),
('CRKT M16', 'Folding knife with excellent blade, durable construction, affordable', 39.99, 70, 105),
('Leatherman Skeletool', 'Lightweight multi-tool with essential tools, excellent quality, 5oz', 79.99, 70, 92),
('Gerber Suspension', 'Multi-tool with 12 tools, excellent quality, affordable, 9.1oz', 44.99, 70, 98),
('Victorinox Classic SD', 'Compact multi-tool with essential tools, excellent quality, lightweight, 0.7oz', 19.99, 70, 120),
('Benchmade Bugout', 'Ultralight folding knife with excellent blade, durable construction, 1.9oz', 139.99, 70, 78),
('Spyderco Delica 4', 'Folding knife with excellent blade, durable construction, comfortable', 99.99, 70, 88),
('CRKT Pilar', 'Compact folding knife with excellent blade, durable construction, affordable', 29.99, 70, 110),
('Leatherman Charge+ TTi', 'Premium multi-tool with 19 tools, titanium construction, excellent quality, 9.3oz', 199.99, 70, 65),
('Gerber Center-Drive', 'Multi-tool with excellent driver, durable construction, comfortable, 10.2oz', 99.99, 70, 82),
('Victorinox Huntsman', 'Multi-tool with multiple tools, excellent quality, compact, 3.6oz', 39.99, 70, 95),
('Benchmade 940', 'Folding knife with excellent blade, durable construction, lightweight', 199.99, 70, 68),
('Spyderco Endura 4', 'Folding knife with excellent blade, durable construction, comfortable', 89.99, 70, 85),
('CRKT Minimalist', 'Compact fixed blade knife with excellent blade, durable construction, 1.5oz', 24.99, 70, 115),
('Leatherman Free P4', 'Multi-tool with 21 tools, magnetic operation, excellent quality, 8.6oz', 149.99, 70, 72),
('Gerber MP600', 'Multi-tool with 15 tools, excellent quality, durable construction, 9.5oz', 69.99, 70, 88);

-- Child Category 71: Navigation Tools (subcategory_id: 15, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Garmin GPSMAP 66i', 'GPS device with satellite communication, excellent navigation, durable construction', 599.99, 71, 40),
('Garmin eTrex 32x', 'GPS device with excellent navigation, long battery life, affordable', 249.99, 71, 60),
('Suunto M-3', 'Compass with excellent accuracy, durable construction, reliable', 49.99, 71, 100),
('Silva Ranger 515', 'Compass with excellent accuracy, durable construction, reliable', 39.99, 71, 110),
('Brunton Classic', 'Compass with excellent accuracy, durable construction, affordable', 24.99, 71, 120),
('Garmin inReach Mini 2', 'Satellite communicator with GPS, excellent navigation, compact design', 399.99, 71, 50),
('Garmin Foretrex 701', 'GPS device with excellent navigation, wrist-mounted, durable construction', 299.99, 71, 55),
('Suunto MC-2G', 'Compass with global needle, excellent accuracy, durable construction', 59.99, 71, 95),
('Silva Expedition 4', 'Compass with excellent accuracy, durable construction, reliable', 44.99, 71, 105),
('Brunton Eclipse', 'Compass with excellent accuracy, durable construction, affordable', 29.99, 71, 115),
('Garmin GPSMAP 64sx', 'GPS device with excellent navigation, long battery life, durable', 349.99, 71, 48),
('Garmin eTrex 22x', 'GPS device with excellent navigation, long battery life, affordable', 199.99, 71, 65),
('Suunto A-30', 'Compass with excellent accuracy, durable construction, reliable', 34.99, 71, 108),
('Silva Polaris', 'Compass with excellent accuracy, durable construction, reliable', 49.99, 71, 102),
('Brunton Classic 9020', 'Compass with excellent accuracy, durable construction, affordable', 19.99, 71, 125),
('Garmin inReach Explorer+', 'Satellite communicator with GPS, excellent navigation, durable construction', 449.99, 71, 45),
('Garmin Foretrex 601', 'GPS device with excellent navigation, wrist-mounted, durable construction', 249.99, 71, 58),
('Suunto KB-14', 'Compass with excellent accuracy, durable construction, reliable', 44.99, 71, 106),
('Silva Starter 1-2-3', 'Compass with excellent accuracy, durable construction, affordable', 19.99, 71, 128),
('Brunton Classic 9025', 'Compass with excellent accuracy, durable construction, affordable', 22.99, 71, 122);

