-- Product Data for Ecommerce Database
-- This file contains products for child categories 52-61 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 52-61
-- ============================================

-- Child Category 52: Trail Running Shoes (subcategory_id: 11, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Salomon Speedcross 6', 'Trail running shoes with aggressive lugs, excellent grip, lightweight design', 129.99, 52, 70, NULL, NULL, NULL, NULL, FALSE),
('Hoka Speedgoat 5', 'Trail running shoes with maximum cushioning, Vibram sole, excellent grip', 169.99, 52, 65, NULL, NULL, NULL, NULL, FALSE),
('Brooks Cascadia 17', 'Trail running shoes with balanced cushioning, rock plate protection, durable', 129.99, 52, 72, NULL, NULL, NULL, NULL, FALSE),
('Altra Lone Peak 7', 'Zero-drop trail running shoes with wide toe box, excellent comfort, lightweight', 129.99, 52, 68, NULL, NULL, NULL, NULL, FALSE),
('Merrell MTL Long Sky 2', 'Trail running shoes with Vibram sole, excellent grip, lightweight', 119.99, 52, 75, NULL, NULL, NULL, NULL, FALSE),
('Nike Pegasus Trail 4', 'Versatile trail running shoes with React foam, good grip, comfortable', 129.99, 52, 73, NULL, NULL, NULL, NULL, FALSE),
('Adidas Terrex Speed Ultra', 'Lightweight trail running shoes with Continental rubber, excellent grip', 139.99, 52, 70, NULL, NULL, NULL, NULL, FALSE),
('New Balance Hierro V7', 'Trail running shoes with Fresh Foam cushioning, Vibram sole, durable', 124.99, 52, 71, NULL, NULL, NULL, NULL, FALSE),
('Saucony Peregrine 13', 'Trail running shoes with PWRRUN cushioning, aggressive lugs, lightweight', 119.99, 52, 74, NULL, NULL, NULL, NULL, FALSE),
('La Sportiva Bushido II', 'Technical trail running shoes with excellent grip, lightweight, precise fit', 149.99, 52, 66, NULL, NULL, NULL, NULL, FALSE),
('Inov-8 Trailfly G 270', 'Trail running shoes with graphene-enhanced grip, lightweight, responsive', 139.99, 52, 69, NULL, NULL, NULL, NULL, FALSE),
('Topo Athletic Ultraventure 3', 'Trail running shoes with wide toe box, zero-drop, excellent cushioning', 129.99, 52, 67, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Norvan LD 3', 'Lightweight trail running shoes with excellent grip, breathable, durable', 159.99, 52, 64, NULL, NULL, NULL, NULL, FALSE),
('The North Face Vectiv Enduris III', 'Trail running shoes with SurfaceCTRL grip, cushioned, stable', 149.99, 52, 65, NULL, NULL, NULL, NULL, FALSE),
('On Cloudventure', 'Trail running shoes with CloudTec cushioning, excellent grip, lightweight', 139.99, 52, 68, NULL, NULL, NULL, NULL, FALSE),
('Salomon Sense Ride 5', 'Versatile trail running shoes with EnergyCell cushioning, good grip', 119.99, 52, 72, NULL, NULL, NULL, NULL, FALSE),
('Hoka Challenger ATR 7', 'Trail running shoes with maximum cushioning, versatile, comfortable', 149.99, 52, 70, NULL, NULL, NULL, NULL, FALSE),
('Brooks Caldera 6', 'Trail running shoes with DNA Loft cushioning, excellent grip, comfortable', 139.99, 52, 69, NULL, NULL, NULL, NULL, FALSE),
('Merrell Agility Peak 5', 'Trail running shoes with Vibram sole, excellent grip, lightweight', 114.99, 52, 73, NULL, NULL, NULL, NULL, FALSE),
('Nike Wildhorse 8', 'Trail running shoes with React foam, aggressive lugs, durable construction', 119.99, 52, 71, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 53: Approach Shoes (subcategory_id: 11, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('La Sportiva TX4', 'Versatile approach shoes with sticky rubber, excellent grip, comfortable', 129.99, 53, 60, NULL, NULL, NULL, NULL, FALSE),
('Scarpa Crux', 'Technical approach shoes with excellent grip, durable construction, precise fit', 139.99, 53, 58, NULL, NULL, NULL, NULL, FALSE),
('Five Ten Guide Tennie', 'Approach shoes with Stealth rubber, excellent grip, comfortable fit', 119.99, 53, 62, NULL, NULL, NULL, NULL, FALSE),
('Evolv Cruzer', 'Lightweight approach shoes with Trax rubber, excellent grip, packable', 99.99, 53, 65, NULL, NULL, NULL, NULL, FALSE),
('Adidas Terrex Swift R3', 'Versatile approach shoes with Continental rubber, good grip, comfortable', 109.99, 53, 63, NULL, NULL, NULL, NULL, FALSE),
('Salomon XA Pro 3D', 'Approach shoes with Contagrip sole, excellent grip, supportive', 124.99, 53, 61, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Acrux TR', 'Technical approach shoes with excellent grip, lightweight, durable', 149.99, 53, 56, NULL, NULL, NULL, NULL, FALSE),
('Black Diamond Mission', 'Approach shoes with sticky rubber, excellent grip, comfortable fit', 134.99, 53, 59, NULL, NULL, NULL, NULL, FALSE),
('Boreal Ninja', 'Approach shoes with sticky rubber, excellent grip, lightweight', 114.99, 53, 64, NULL, NULL, NULL, NULL, FALSE),
('Butora Acro', 'Approach shoes with sticky rubber, excellent grip, comfortable fit', 129.99, 53, 60, NULL, NULL, NULL, NULL, FALSE),
('La Sportiva Boulder X', 'Approach shoes with sticky rubber, excellent grip, durable construction', 119.99, 53, 62, NULL, NULL, NULL, NULL, FALSE),
('Scarpa Zen Pro', 'Technical approach shoes with excellent grip, lightweight, precise fit', 139.99, 53, 58, NULL, NULL, NULL, NULL, FALSE),
('Five Ten Access', 'Approach shoes with Stealth rubber, excellent grip, comfortable', 109.99, 53, 63, NULL, NULL, NULL, NULL, FALSE),
('Evolv Shaman', 'Approach shoes with Trax rubber, excellent grip, supportive', 124.99, 53, 61, NULL, NULL, NULL, NULL, FALSE),
('Adidas Terrex Free Hiker', 'Versatile approach shoes with Continental rubber, good grip, comfortable', 119.99, 53, 62, NULL, NULL, NULL, NULL, FALSE),
('Salomon X Ultra 4', 'Approach shoes with Contagrip sole, excellent grip, lightweight', 114.99, 53, 64, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Konseal FL', 'Lightweight approach shoes with excellent grip, breathable, durable', 134.99, 53, 59, NULL, NULL, NULL, NULL, FALSE),
('Black Diamond Aspect', 'Approach shoes with sticky rubber, excellent grip, comfortable fit', 129.99, 53, 60, NULL, NULL, NULL, NULL, FALSE),
('Boreal Joker', 'Approach shoes with sticky rubber, excellent grip, durable construction', 119.99, 53, 62, NULL, NULL, NULL, NULL, FALSE),
('Butora Endeavor', 'Approach shoes with sticky rubber, excellent grip, comfortable fit', 109.99, 53, 63, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 54: Waterproof Hiking Boots (subcategory_id: 11, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Salomon Quest 4 GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, ankle support', 199.99, 54, 55, NULL, NULL, NULL, NULL, FALSE),
('Merrell Moab 3 Waterproof', 'Waterproof hiking boots with M Select Dry, Vibram sole, comfortable', 129.99, 54, 75, NULL, NULL, NULL, NULL, FALSE),
('Columbia Newton Ridge Plus Waterproof', 'Waterproof hiking boots with Omni-Tech, good grip, affordable', 89.99, 54, 95, NULL, NULL, NULL, NULL, FALSE),
('Keen Targhee III Waterproof', 'Waterproof hiking boots with Keen.Dry, excellent traction, wide fit', 149.99, 54, 65, NULL, NULL, NULL, NULL, FALSE),
('Timberland White Ledge Waterproof', 'Waterproof hiking boots with sealed seams, durable leather, comfortable', 119.99, 54, 80, NULL, NULL, NULL, NULL, FALSE),
('La Sportiva Nucleo High GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, lightweight', 229.99, 54, 45, NULL, NULL, NULL, NULL, FALSE),
('Oboz Bridger B-Dry', 'Waterproof hiking boots with B-Dry membrane, excellent traction, comfortable', 159.99, 54, 60, NULL, NULL, NULL, NULL, FALSE),
('Vasque Breeze LT GTX', 'Waterproof hiking boots with Gore-Tex, excellent breathability, comfortable', 179.99, 54, 53, NULL, NULL, NULL, NULL, FALSE),
('Lowa Renegade GTX Mid', 'Waterproof hiking boots with Gore-Tex, excellent support, durable', 199.99, 54, 50, NULL, NULL, NULL, NULL, FALSE),
('Scarpa Zodiac Plus GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, lightweight', 249.99, 54, 40, NULL, NULL, NULL, NULL, FALSE),
('Adidas Terrex Swift R3 GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, comfortable', 169.99, 54, 57, NULL, NULL, NULL, NULL, FALSE),
('The North Face Hedgehog Fastpack GTX', 'Waterproof hiking boots with Gore-Tex, excellent traction, comfortable', 149.99, 54, 63, NULL, NULL, NULL, NULL, FALSE),
('Asolo Fugitive GTX', 'Waterproof hiking boots with Gore-Tex, excellent support, durable', 219.99, 54, 47, NULL, NULL, NULL, NULL, FALSE),
('Zamberlan Vioz GTX', 'Waterproof hiking boots with Gore-Tex, excellent craftsmanship, durable', 279.99, 54, 35, NULL, NULL, NULL, NULL, FALSE),
('Hanwag Tatra II GTX', 'Waterproof hiking boots with Gore-Tex, excellent support, comfortable', 249.99, 54, 38, NULL, NULL, NULL, NULL, FALSE),
('Meindl Island MFS', 'Waterproof hiking boots with Gore-Tex, excellent quality, comfortable', 229.99, 54, 42, NULL, NULL, NULL, NULL, FALSE),
('Aku Tribute II GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, lightweight', 199.99, 54, 52, NULL, NULL, NULL, NULL, FALSE),
('Crispi Monaco GTX', 'Waterproof hiking boots with Gore-Tex, excellent support, durable', 269.99, 54, 33, NULL, NULL, NULL, NULL, FALSE),
('Danner Mountain 600', 'Waterproof hiking boots with Danner Dry, excellent grip, comfortable', 189.99, 54, 51, NULL, NULL, NULL, NULL, FALSE),
('Altra Lone Peak Hiker GTX', 'Waterproof hiking boots with Gore-Tex, zero-drop, wide toe box', 149.99, 54, 59, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 55: Hiking Sandals (subcategory_id: 11, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Chaco Z/Cloud 2', 'Hiking sandals with adjustable straps, excellent arch support, comfortable', 99.99, 55, 80, NULL, NULL, NULL, NULL, FALSE),
('Teva Hurricane XLT2', 'Hiking sandals with adjustable straps, good grip, comfortable fit', 79.99, 55, 90, NULL, NULL, NULL, NULL, FALSE),
('Keen Newport H2', 'Hiking sandals with closed toe, excellent protection, comfortable', 89.99, 55, 85, NULL, NULL, NULL, NULL, FALSE),
('Merrell Kahuna III', 'Hiking sandals with adjustable straps, good grip, comfortable', 69.99, 55, 95, NULL, NULL, NULL, NULL, FALSE),
('Bedrock Cairn 3D Pro', 'Minimalist hiking sandals with adjustable straps, excellent grip, lightweight', 119.99, 55, 70, NULL, NULL, NULL, NULL, FALSE),
('Xero Z-Trail EV', 'Minimalist hiking sandals with adjustable straps, zero-drop, lightweight', 99.99, 55, 75, NULL, NULL, NULL, NULL, FALSE),
('Luna Sandals Oso', 'Minimalist hiking sandals with adjustable straps, excellent grip, comfortable', 89.99, 55, 80, NULL, NULL, NULL, NULL, FALSE),
('Shamma Mountain Goats', 'Minimalist hiking sandals with adjustable straps, excellent grip, lightweight', 109.99, 55, 72, NULL, NULL, NULL, NULL, FALSE),
('Earth Runners Circadian', 'Minimalist hiking sandals with adjustable straps, zero-drop, comfortable', 79.99, 55, 88, NULL, NULL, NULL, NULL, FALSE),
('Chaco Z/Volv 2', 'Hiking sandals with adjustable straps, excellent arch support, comfortable', 94.99, 55, 82, NULL, NULL, NULL, NULL, FALSE),
('Teva Terra Fi 5', 'Hiking sandals with adjustable straps, good grip, durable construction', 84.99, 55, 86, NULL, NULL, NULL, NULL, FALSE),
('Keen Clearwater CNX', 'Hiking sandals with closed toe, excellent protection, comfortable', 79.99, 55, 90, NULL, NULL, NULL, NULL, FALSE),
('Merrell Hydro Moc', 'Water-friendly hiking sandals with slip-on design, comfortable, quick-dry', 49.99, 55, 100, NULL, NULL, NULL, NULL, FALSE),
('Bedrock Cairn Adventure', 'Hiking sandals with adjustable straps, excellent grip, durable', 109.99, 55, 74, NULL, NULL, NULL, NULL, FALSE),
('Xero Z-Trek', 'Minimalist hiking sandals with adjustable straps, zero-drop, lightweight', 79.99, 55, 92, NULL, NULL, NULL, NULL, FALSE),
('Luna Sandals Mono', 'Minimalist hiking sandals with adjustable straps, excellent grip, comfortable', 94.99, 55, 78, NULL, NULL, NULL, NULL, FALSE),
('Shamma Warriors', 'Minimalist hiking sandals with adjustable straps, excellent grip, lightweight', 99.99, 55, 76, NULL, NULL, NULL, NULL, FALSE),
('Earth Runners Alpha', 'Minimalist hiking sandals with adjustable straps, zero-drop, comfortable', 69.99, 55, 94, NULL, NULL, NULL, NULL, FALSE),
('Chaco Z/1 Classic', 'Classic hiking sandals with adjustable straps, excellent arch support', 89.99, 55, 84, NULL, NULL, NULL, NULL, FALSE),
('Teva Original Universal', 'Classic hiking sandals with adjustable straps, good grip, comfortable', 64.99, 55, 96, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 56: Daypacks (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Osprey Talon 22', 'Daypack with 22L capacity, excellent organization, comfortable suspension', 99.99, 56, 70, NULL, NULL, NULL, NULL, FALSE),
('Deuter Speed Lite 20', 'Lightweight daypack with 20L capacity, minimal design, comfortable', 79.99, 56, 80, NULL, NULL, NULL, NULL, FALSE),
('Gregory Zulu 30', 'Daypack with 30L capacity, excellent suspension, good organization', 119.99, 56, 65, NULL, NULL, NULL, NULL, FALSE),
('REI Co-op Flash 22', 'Lightweight daypack with 22L capacity, simple design, affordable', 59.99, 56, 85, NULL, NULL, NULL, NULL, FALSE),
('Patagonia Nine Trails 28', 'Daypack with 28L capacity, excellent organization, comfortable fit', 109.99, 56, 68, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Mantis 26', 'Daypack with 26L capacity, excellent organization, durable construction', 129.99, 56, 60, NULL, NULL, NULL, NULL, FALSE),
('The North Face Recon', 'Daypack with 30L capacity, excellent organization, comfortable suspension', 99.99, 56, 72, NULL, NULL, NULL, NULL, FALSE),
('Salomon XA 25', 'Trail running daypack with 25L capacity, excellent fit, lightweight', 89.99, 56, 75, NULL, NULL, NULL, NULL, FALSE),
('Black Diamond Blitz 28', 'Daypack with 28L capacity, excellent organization, durable construction', 119.99, 56, 63, NULL, NULL, NULL, NULL, FALSE),
('Mountain Hardwear Scrambler 30', 'Daypack with 30L capacity, excellent suspension, good organization', 109.99, 56, 67, NULL, NULL, NULL, NULL, FALSE),
('Osprey Stratos 24', 'Daypack with 24L capacity, excellent suspension, good ventilation', 94.99, 56, 73, NULL, NULL, NULL, NULL, FALSE),
('Deuter ACT Trail 24', 'Daypack with 24L capacity, excellent suspension, good organization', 84.99, 56, 78, NULL, NULL, NULL, NULL, FALSE),
('Gregory Citro 24', 'Daypack with 24L capacity, excellent organization, comfortable fit', 99.99, 56, 71, NULL, NULL, NULL, NULL, FALSE),
('REI Co-op Trail 25', 'Daypack with 25L capacity, simple design, affordable, comfortable', 69.99, 56, 82, NULL, NULL, NULL, NULL, FALSE),
('Patagonia Refugio 28L', 'Daypack with 28L capacity, excellent organization, sustainable materials', 104.99, 56, 69, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Brize 25', 'Daypack with 25L capacity, excellent organization, lightweight design', 124.99, 56, 61, NULL, NULL, NULL, NULL, FALSE),
('The North Face Borealis', 'Daypack with 28L capacity, excellent organization, comfortable suspension', 94.99, 56, 74, NULL, NULL, NULL, NULL, FALSE),
('Salomon Agile 12 Set', 'Trail running daypack with 12L capacity, excellent fit, lightweight', 79.99, 56, 77, NULL, NULL, NULL, NULL, FALSE),
('Black Diamond Distance 15', 'Ultralight daypack with 15L capacity, minimal design, lightweight', 89.99, 56, 76, NULL, NULL, NULL, NULL, FALSE),
('Mountain Hardwear Scrambler 25', 'Daypack with 25L capacity, excellent suspension, good organization', 99.99, 56, 70, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 57: Backpacking Packs (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Osprey Atmos AG 65', 'Backpacking pack with 65L capacity, Anti-Gravity suspension, excellent ventilation', 249.99, 57, 50, NULL, NULL, NULL, NULL, FALSE),
('Deuter Aircontact Core 65+10', 'Backpacking pack with 65-75L capacity, excellent suspension, good ventilation', 199.99, 57, 55, NULL, NULL, NULL, NULL, FALSE),
('Gregory Baltoro 75', 'Backpacking pack with 75L capacity, excellent suspension, comfortable fit', 279.99, 57, 45, NULL, NULL, NULL, NULL, FALSE),
('REI Co-op Flash 55', 'Lightweight backpacking pack with 55L capacity, simple design, affordable', 149.99, 57, 60, NULL, NULL, NULL, NULL, FALSE),
('Patagonia Ascensionist 55', 'Lightweight backpacking pack with 55L capacity, excellent organization', 229.99, 57, 48, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Bora AR 65', 'Premium backpacking pack with 65L capacity, excellent suspension, durable', 399.99, 57, 35, NULL, NULL, NULL, NULL, FALSE),
('The North Face Terra 65', 'Backpacking pack with 65L capacity, excellent suspension, good organization', 199.99, 57, 52, NULL, NULL, NULL, NULL, FALSE),
('Salomon Quest 4D 50', 'Backpacking pack with 50L capacity, excellent fit, comfortable suspension', 179.99, 57, 58, NULL, NULL, NULL, NULL, FALSE),
('Black Diamond Mission 75', 'Backpacking pack with 75L capacity, excellent suspension, durable', 249.99, 57, 47, NULL, NULL, NULL, NULL, FALSE),
('Mountain Hardwear South Col 70', 'Backpacking pack with 70L capacity, excellent suspension, good organization', 229.99, 57, 49, NULL, NULL, NULL, NULL, FALSE),
('Osprey Aether AG 70', 'Backpacking pack with 70L capacity, Anti-Gravity suspension, excellent ventilation', 269.99, 57, 46, NULL, NULL, NULL, NULL, FALSE),
('Deuter Aircontact Lite 65+10', 'Lightweight backpacking pack with 65-75L capacity, excellent suspension', 189.99, 57, 54, NULL, NULL, NULL, NULL, FALSE),
('Gregory Paragon 58', 'Lightweight backpacking pack with 58L capacity, excellent suspension, comfortable', 219.99, 57, 50, NULL, NULL, NULL, NULL, FALSE),
('REI Co-op Traverse 70', 'Backpacking pack with 70L capacity, excellent suspension, good organization', 179.99, 57, 56, NULL, NULL, NULL, NULL, FALSE),
('Patagonia Cragsmith 45', 'Backpacking pack with 45L capacity, excellent organization, durable construction', 199.99, 57, 51, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Altra 65', 'Premium backpacking pack with 65L capacity, excellent suspension, lightweight', 349.99, 57, 40, NULL, NULL, NULL, NULL, FALSE),
('The North Face Banchee 65', 'Backpacking pack with 65L capacity, excellent suspension, good organization', 189.99, 57, 53, NULL, NULL, NULL, NULL, FALSE),
('Salomon Quest 4D 60', 'Backpacking pack with 60L capacity, excellent fit, comfortable suspension', 199.99, 57, 49, NULL, NULL, NULL, NULL, FALSE),
('Black Diamond Mission 55', 'Backpacking pack with 55L capacity, excellent suspension, durable', 219.99, 57, 48, NULL, NULL, NULL, NULL, FALSE),
('Mountain Hardwear South Col 60', 'Backpacking pack with 60L capacity, excellent suspension, good organization', 209.99, 57, 50, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 58: Hydration Packs (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('CamelBak M.U.L.E. 12', 'Hydration pack with 12L capacity, 3L reservoir, excellent organization', 119.99, 58, 65, NULL, NULL, NULL, NULL, FALSE),
('Osprey Raptor 14', 'Hydration pack with 14L capacity, 3L reservoir, excellent suspension', 129.99, 58, 60, NULL, NULL, NULL, NULL, FALSE),
('Salomon Adv Skin 12', 'Trail running hydration pack with 12L capacity, 1.5L soft flasks, excellent fit', 149.99, 58, 55, NULL, NULL, NULL, NULL, FALSE),
('Nathan VaporKrar 12L', 'Hydration pack with 12L capacity, 2L reservoir, excellent organization', 109.99, 58, 68, NULL, NULL, NULL, NULL, FALSE),
('Ultimate Direction Fastpack 20', 'Hydration pack with 20L capacity, excellent organization, lightweight', 139.99, 58, 62, NULL, NULL, NULL, NULL, FALSE),
('Deuter Race X Air 12+3', 'Hydration pack with 12L capacity, 3L reservoir, excellent ventilation', 119.99, 58, 66, NULL, NULL, NULL, NULL, FALSE),
('Gregory Nano 18', 'Hydration pack with 18L capacity, 3L reservoir, excellent suspension', 124.99, 58, 64, NULL, NULL, NULL, NULL, FALSE),
('REI Co-op Flash 18', 'Hydration pack with 18L capacity, 3L reservoir, simple design, affordable', 89.99, 58, 72, NULL, NULL, NULL, NULL, FALSE),
('Patagonia Slope Runner 12L', 'Hydration pack with 12L capacity, excellent organization, sustainable materials', 129.99, 58, 61, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Norvan 14', 'Hydration pack with 14L capacity, excellent organization, lightweight design', 149.99, 58, 58, NULL, NULL, NULL, NULL, FALSE),
('The North Face Flight Race Vest', 'Hydration pack with 12L capacity, excellent fit, comfortable suspension', 134.99, 58, 60, NULL, NULL, NULL, NULL, FALSE),
('Black Diamond Distance 8', 'Ultralight hydration pack with 8L capacity, minimal design, lightweight', 99.99, 58, 70, NULL, NULL, NULL, NULL, FALSE),
('Mountain Hardwear Fluid 12', 'Hydration pack with 12L capacity, 3L reservoir, excellent organization', 114.99, 58, 67, NULL, NULL, NULL, NULL, FALSE),
('CamelBak Circuit', 'Hydration pack with 10L capacity, 3L reservoir, excellent organization', 109.99, 58, 69, NULL, NULL, NULL, NULL, FALSE),
('Osprey Duro 15', 'Hydration pack with 15L capacity, 3L reservoir, excellent suspension', 119.99, 58, 65, NULL, NULL, NULL, NULL, FALSE),
('Salomon Adv Skin 5 Set', 'Trail running hydration pack with 5L capacity, 1.5L soft flasks, excellent fit', 99.99, 58, 73, NULL, NULL, NULL, NULL, FALSE),
('Nathan VaporKrar 4L', 'Hydration pack with 4L capacity, 2L reservoir, excellent organization', 79.99, 58, 75, NULL, NULL, NULL, NULL, FALSE),
('Ultimate Direction Fastpack 15', 'Hydration pack with 15L capacity, excellent organization, lightweight', 124.99, 58, 66, NULL, NULL, NULL, NULL, FALSE),
('Deuter Race X Air 8+3', 'Hydration pack with 8L capacity, 3L reservoir, excellent ventilation', 99.99, 58, 71, NULL, NULL, NULL, NULL, FALSE),
('Gregory Nano 12', 'Hydration pack with 12L capacity, 3L reservoir, excellent suspension', 109.99, 58, 68, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 59: Ultralight Packs (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Hyperlite Mountain Gear Southwest 3400', 'Ultralight pack with 55L capacity, Dyneema fabric, minimal design, 1.9lbs', 349.99, 59, 45, NULL, NULL, NULL, NULL, FALSE),
('Gossamer Gear Mariposa 60', 'Ultralight pack with 60L capacity, excellent organization, comfortable, 1.9lbs', 199.99, 59, 55, NULL, NULL, NULL, NULL, FALSE),
('ULA Circuit', 'Ultralight pack with 68L capacity, excellent suspension, comfortable, 2.1lbs', 249.99, 59, 50, NULL, NULL, NULL, NULL, FALSE),
('Zpacks Arc Blast', 'Ultralight pack with 55L capacity, Dyneema fabric, excellent suspension, 1.5lbs', 399.99, 59, 40, NULL, NULL, NULL, NULL, FALSE),
('Six Moon Designs Swift', 'Ultralight pack with 50L capacity, excellent organization, lightweight, 1.8lbs', 179.99, 59, 58, NULL, NULL, NULL, NULL, FALSE),
('Granite Gear Crown2 60', 'Ultralight pack with 60L capacity, excellent suspension, comfortable, 2.3lbs', 199.99, 59, 52, NULL, NULL, NULL, NULL, FALSE),
('Osprey Levity 60', 'Ultralight pack with 60L capacity, excellent suspension, good ventilation, 2.1lbs', 229.99, 59, 48, NULL, NULL, NULL, NULL, FALSE),
('REI Co-op Flash 55', 'Ultralight pack with 55L capacity, simple design, affordable, 2.4lbs', 149.99, 59, 60, NULL, NULL, NULL, NULL, FALSE),
('Patagonia Ascensionist 45', 'Ultralight pack with 45L capacity, excellent organization, lightweight, 1.9lbs', 229.99, 59, 47, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Altra 65', 'Ultralight pack with 65L capacity, excellent suspension, lightweight, 2.6lbs', 349.99, 59, 42, NULL, NULL, NULL, NULL, FALSE),
('Hyperlite Mountain Gear 2400', 'Ultralight pack with 40L capacity, Dyneema fabric, minimal design, 1.6lbs', 299.99, 59, 50, NULL, NULL, NULL, NULL, FALSE),
('Gossamer Gear Gorilla 50', 'Ultralight pack with 50L capacity, excellent organization, comfortable, 1.7lbs', 179.99, 59, 56, NULL, NULL, NULL, NULL, FALSE),
('ULA Ohm 2.0', 'Ultralight pack with 63L capacity, excellent suspension, comfortable, 2.0lbs', 219.99, 59, 53, NULL, NULL, NULL, NULL, FALSE),
('Zpacks Arc Haul', 'Ultralight pack with 60L capacity, Dyneema fabric, excellent suspension, 1.6lbs', 379.99, 59, 41, NULL, NULL, NULL, NULL, FALSE),
('Six Moon Designs Fusion 50', 'Ultralight pack with 50L capacity, excellent organization, lightweight, 1.9lbs', 189.99, 59, 54, NULL, NULL, NULL, NULL, FALSE),
('Granite Gear Virga 2', 'Ultralight pack with 50L capacity, excellent suspension, comfortable, 1.8lbs', 169.99, 59, 57, NULL, NULL, NULL, NULL, FALSE),
('Osprey Exos 58', 'Ultralight pack with 58L capacity, excellent suspension, good ventilation, 2.5lbs', 199.99, 59, 51, NULL, NULL, NULL, NULL, FALSE),
('REI Co-op Flash 45', 'Ultralight pack with 45L capacity, simple design, affordable, 2.1lbs', 129.99, 59, 62, NULL, NULL, NULL, NULL, FALSE),
('Patagonia Nine Trails 28', 'Ultralight pack with 28L capacity, excellent organization, lightweight, 1.4lbs', 109.99, 59, 64, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Brize 32', 'Ultralight pack with 32L capacity, excellent organization, lightweight, 1.6lbs', 199.99, 59, 49, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 60: Tactical Backpacks (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('5.11 Tactical RUSH 72', 'Tactical backpack with 55L capacity, MOLLE webbing, excellent organization, durable', 199.99, 60, 55, NULL, NULL, NULL, NULL, FALSE),
('Maxpedition Falcon-II', 'Tactical backpack with 31L capacity, MOLLE webbing, excellent organization, durable', 179.99, 60, 58, NULL, NULL, NULL, NULL, FALSE),
('Condor 3-Day Assault Pack', 'Tactical backpack with 30L capacity, MOLLE webbing, excellent organization, affordable', 89.99, 60, 70, NULL, NULL, NULL, NULL, FALSE),
('Tactical Tailor Removable Operator Pack', 'Tactical backpack with 40L capacity, MOLLE webbing, excellent organization, durable', 249.99, 60, 48, NULL, NULL, NULL, NULL, FALSE),
('Vanquest Markhor-25', 'Tactical backpack with 25L capacity, excellent organization, durable construction', 149.99, 60, 62, NULL, NULL, NULL, NULL, FALSE),
('Direct Action Dragon Egg', 'Tactical backpack with 30L capacity, MOLLE webbing, excellent organization', 199.99, 60, 54, NULL, NULL, NULL, NULL, FALSE),
('Helikon-Tex Direct Action', 'Tactical backpack with 35L capacity, MOLLE webbing, excellent organization', 159.99, 60, 59, NULL, NULL, NULL, NULL, FALSE),
('First Tactical Specialist', 'Tactical backpack with 28L capacity, excellent organization, durable construction', 129.99, 60, 64, NULL, NULL, NULL, NULL, FALSE),
('Blackhawk! Tactical 3-Day', 'Tactical backpack with 30L capacity, MOLLE webbing, excellent organization', 149.99, 60, 61, NULL, NULL, NULL, NULL, FALSE),
('Mystery Ranch 3-Day Assault', 'Tactical backpack with 30L capacity, excellent suspension, durable construction', 279.99, 60, 45, NULL, NULL, NULL, NULL, FALSE),
('5.11 Tactical RUSH 24', 'Tactical backpack with 24L capacity, MOLLE webbing, excellent organization, durable', 149.99, 60, 63, NULL, NULL, NULL, NULL, FALSE),
('Maxpedition Condor-II', 'Tactical backpack with 25L capacity, MOLLE webbing, excellent organization, durable', 159.99, 60, 60, NULL, NULL, NULL, NULL, FALSE),
('Condor Summit', 'Tactical backpack with 35L capacity, MOLLE webbing, excellent organization, affordable', 99.99, 60, 68, NULL, NULL, NULL, NULL, FALSE),
('Tactical Tailor Operator Pack', 'Tactical backpack with 35L capacity, MOLLE webbing, excellent organization, durable', 219.99, 60, 52, NULL, NULL, NULL, NULL, FALSE),
('Vanquest Katara-16', 'Tactical backpack with 16L capacity, excellent organization, durable construction', 119.99, 60, 66, NULL, NULL, NULL, NULL, FALSE),
('Direct Action Dust', 'Tactical backpack with 25L capacity, MOLLE webbing, excellent organization', 179.99, 60, 56, NULL, NULL, NULL, NULL, FALSE),
('Helikon-Tex Trooper', 'Tactical backpack with 30L capacity, MOLLE webbing, excellent organization', 139.99, 60, 61, NULL, NULL, NULL, NULL, FALSE),
('First Tactical Responder', 'Tactical backpack with 24L capacity, excellent organization, durable construction', 109.99, 60, 67, NULL, NULL, NULL, NULL, FALSE),
('Blackhawk! STRIKE', 'Tactical backpack with 28L capacity, MOLLE webbing, excellent organization', 129.99, 60, 64, NULL, NULL, NULL, NULL, FALSE),
('Mystery Ranch Urban Assault', 'Tactical backpack with 24L capacity, excellent suspension, durable construction', 199.99, 60, 53, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 61: Hiking Pants (subcategory_id: 13, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Prana Stretch Zion', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable fit', 89.99, 61, 80, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Gamma LT', 'Hiking pants with softshell fabric, excellent weather resistance, comfortable', 149.99, 61, 65, NULL, NULL, NULL, NULL, FALSE),
('The North Face Paramount', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 79.99, 61, 85, NULL, NULL, NULL, NULL, FALSE),
('Patagonia Quandary', 'Hiking pants with stretch fabric, moisture-wicking, sustainable materials', 89.99, 61, 82, NULL, NULL, NULL, NULL, FALSE),
('Columbia Silver Ridge', 'Hiking pants with stretch fabric, moisture-wicking, UPF protection, affordable', 59.99, 61, 95, NULL, NULL, NULL, NULL, FALSE),
('REI Co-op Sahara', 'Hiking pants with stretch fabric, moisture-wicking, UPF protection, comfortable', 69.99, 61, 90, NULL, NULL, NULL, NULL, FALSE),
('Fjällräven Abisko', 'Hiking pants with durable fabric, excellent weather resistance, comfortable', 129.99, 61, 70, NULL, NULL, NULL, NULL, FALSE),
('Kuhl Renegade', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 99.99, 61, 75, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Research Ferrosi', 'Hiking pants with stretch fabric, excellent breathability, comfortable', 109.99, 61, 72, NULL, NULL, NULL, NULL, FALSE),
('Mountain Hardwear AP', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 94.99, 61, 78, NULL, NULL, NULL, NULL, FALSE),
('Prana Brion', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable fit', 84.99, 61, 80, NULL, NULL, NULL, NULL, FALSE),
('Arc\'teryx Lefroy', 'Hiking pants with stretch fabric, excellent breathability, lightweight', 119.99, 61, 73, NULL, NULL, NULL, NULL, FALSE),
('The North Face Paramount Convertible', 'Convertible hiking pants with zip-off legs, stretch fabric, moisture-wicking', 89.99, 61, 81, NULL, NULL, NULL, NULL, FALSE),
('Patagonia Quandary Convertible', 'Convertible hiking pants with zip-off legs, stretch fabric, sustainable materials', 99.99, 61, 77, NULL, NULL, NULL, NULL, FALSE),
('Columbia Silver Ridge Convertible', 'Convertible hiking pants with zip-off legs, stretch fabric, UPF protection', 69.99, 61, 88, NULL, NULL, NULL, NULL, FALSE),
('REI Co-op Sahara Convertible', 'Convertible hiking pants with zip-off legs, stretch fabric, UPF protection', 79.99, 61, 83, NULL, NULL, NULL, NULL, FALSE),
('Fjällräven Vidda Pro', 'Hiking pants with durable fabric, excellent weather resistance, comfortable', 139.99, 61, 68, NULL, NULL, NULL, NULL, FALSE),
('Kuhl Radikl', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 89.99, 61, 79, NULL, NULL, NULL, NULL, FALSE),
('Outdoor Research Voodoo', 'Hiking pants with stretch fabric, excellent breathability, comfortable', 99.99, 61, 76, NULL, NULL, NULL, NULL, FALSE),
('Mountain Hardwear Chockstone', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 104.99, 61, 74, NULL, NULL, NULL, NULL, FALSE);

