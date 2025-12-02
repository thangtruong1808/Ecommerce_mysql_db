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
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Salomon Speedcross 6', 'Trail running shoes with aggressive lugs, excellent grip, lightweight design', 129.99, 52, 70),
('Hoka Speedgoat 5', 'Trail running shoes with maximum cushioning, Vibram sole, excellent grip', 169.99, 52, 65),
('Brooks Cascadia 17', 'Trail running shoes with balanced cushioning, rock plate protection, durable', 129.99, 52, 72),
('Altra Lone Peak 7', 'Zero-drop trail running shoes with wide toe box, excellent comfort, lightweight', 129.99, 52, 68),
('Merrell MTL Long Sky 2', 'Trail running shoes with Vibram sole, excellent grip, lightweight', 119.99, 52, 75),
('Nike Pegasus Trail 4', 'Versatile trail running shoes with React foam, good grip, comfortable', 129.99, 52, 73),
('Adidas Terrex Speed Ultra', 'Lightweight trail running shoes with Continental rubber, excellent grip', 139.99, 52, 70),
('New Balance Hierro V7', 'Trail running shoes with Fresh Foam cushioning, Vibram sole, durable', 124.99, 52, 71),
('Saucony Peregrine 13', 'Trail running shoes with PWRRUN cushioning, aggressive lugs, lightweight', 119.99, 52, 74),
('La Sportiva Bushido II', 'Technical trail running shoes with excellent grip, lightweight, precise fit', 149.99, 52, 66),
('Inov-8 Trailfly G 270', 'Trail running shoes with graphene-enhanced grip, lightweight, responsive', 139.99, 52, 69),
('Topo Athletic Ultraventure 3', 'Trail running shoes with wide toe box, zero-drop, excellent cushioning', 129.99, 52, 67),
('Arc\'teryx Norvan LD 3', 'Lightweight trail running shoes with excellent grip, breathable, durable', 159.99, 52, 64),
('The North Face Vectiv Enduris III', 'Trail running shoes with SurfaceCTRL grip, cushioned, stable', 149.99, 52, 65),
('On Cloudventure', 'Trail running shoes with CloudTec cushioning, excellent grip, lightweight', 139.99, 52, 68),
('Salomon Sense Ride 5', 'Versatile trail running shoes with EnergyCell cushioning, good grip', 119.99, 52, 72),
('Hoka Challenger ATR 7', 'Trail running shoes with maximum cushioning, versatile, comfortable', 149.99, 52, 70),
('Brooks Caldera 6', 'Trail running shoes with DNA Loft cushioning, excellent grip, comfortable', 139.99, 52, 69),
('Merrell Agility Peak 5', 'Trail running shoes with Vibram sole, excellent grip, lightweight', 114.99, 52, 73),
('Nike Wildhorse 8', 'Trail running shoes with React foam, aggressive lugs, durable construction', 119.99, 52, 71);

-- Child Category 53: Approach Shoes (subcategory_id: 11, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('La Sportiva TX4', 'Versatile approach shoes with sticky rubber, excellent grip, comfortable', 129.99, 53, 60),
('Scarpa Crux', 'Technical approach shoes with excellent grip, durable construction, precise fit', 139.99, 53, 58),
('Five Ten Guide Tennie', 'Approach shoes with Stealth rubber, excellent grip, comfortable fit', 119.99, 53, 62),
('Evolv Cruzer', 'Lightweight approach shoes with Trax rubber, excellent grip, packable', 99.99, 53, 65),
('Adidas Terrex Swift R3', 'Versatile approach shoes with Continental rubber, good grip, comfortable', 109.99, 53, 63),
('Salomon XA Pro 3D', 'Approach shoes with Contagrip sole, excellent grip, supportive', 124.99, 53, 61),
('Arc\'teryx Acrux TR', 'Technical approach shoes with excellent grip, lightweight, durable', 149.99, 53, 56),
('Black Diamond Mission', 'Approach shoes with sticky rubber, excellent grip, comfortable fit', 134.99, 53, 59),
('Boreal Ninja', 'Approach shoes with sticky rubber, excellent grip, lightweight', 114.99, 53, 64),
('Butora Acro', 'Approach shoes with sticky rubber, excellent grip, comfortable fit', 129.99, 53, 60),
('La Sportiva Boulder X', 'Approach shoes with sticky rubber, excellent grip, durable construction', 119.99, 53, 62),
('Scarpa Zen Pro', 'Technical approach shoes with excellent grip, lightweight, precise fit', 139.99, 53, 58),
('Five Ten Access', 'Approach shoes with Stealth rubber, excellent grip, comfortable', 109.99, 53, 63),
('Evolv Shaman', 'Approach shoes with Trax rubber, excellent grip, supportive', 124.99, 53, 61),
('Adidas Terrex Free Hiker', 'Versatile approach shoes with Continental rubber, good grip, comfortable', 119.99, 53, 62),
('Salomon X Ultra 4', 'Approach shoes with Contagrip sole, excellent grip, lightweight', 114.99, 53, 64),
('Arc\'teryx Konseal FL', 'Lightweight approach shoes with excellent grip, breathable, durable', 134.99, 53, 59),
('Black Diamond Aspect', 'Approach shoes with sticky rubber, excellent grip, comfortable fit', 129.99, 53, 60),
('Boreal Joker', 'Approach shoes with sticky rubber, excellent grip, durable construction', 119.99, 53, 62),
('Butora Endeavor', 'Approach shoes with sticky rubber, excellent grip, comfortable fit', 109.99, 53, 63);

-- Child Category 54: Waterproof Hiking Boots (subcategory_id: 11, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Salomon Quest 4 GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, ankle support', 199.99, 54, 55),
('Merrell Moab 3 Waterproof', 'Waterproof hiking boots with M Select Dry, Vibram sole, comfortable', 129.99, 54, 75),
('Columbia Newton Ridge Plus Waterproof', 'Waterproof hiking boots with Omni-Tech, good grip, affordable', 89.99, 54, 95),
('Keen Targhee III Waterproof', 'Waterproof hiking boots with Keen.Dry, excellent traction, wide fit', 149.99, 54, 65),
('Timberland White Ledge Waterproof', 'Waterproof hiking boots with sealed seams, durable leather, comfortable', 119.99, 54, 80),
('La Sportiva Nucleo High GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, lightweight', 229.99, 54, 45),
('Oboz Bridger B-Dry', 'Waterproof hiking boots with B-Dry membrane, excellent traction, comfortable', 159.99, 54, 60),
('Vasque Breeze LT GTX', 'Waterproof hiking boots with Gore-Tex, excellent breathability, comfortable', 179.99, 54, 53),
('Lowa Renegade GTX Mid', 'Waterproof hiking boots with Gore-Tex, excellent support, durable', 199.99, 54, 50),
('Scarpa Zodiac Plus GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, lightweight', 249.99, 54, 40),
('Adidas Terrex Swift R3 GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, comfortable', 169.99, 54, 57),
('The North Face Hedgehog Fastpack GTX', 'Waterproof hiking boots with Gore-Tex, excellent traction, comfortable', 149.99, 54, 63),
('Asolo Fugitive GTX', 'Waterproof hiking boots with Gore-Tex, excellent support, durable', 219.99, 54, 47),
('Zamberlan Vioz GTX', 'Waterproof hiking boots with Gore-Tex, excellent craftsmanship, durable', 279.99, 54, 35),
('Hanwag Tatra II GTX', 'Waterproof hiking boots with Gore-Tex, excellent support, comfortable', 249.99, 54, 38),
('Meindl Island MFS', 'Waterproof hiking boots with Gore-Tex, excellent quality, comfortable', 229.99, 54, 42),
('Aku Tribute II GTX', 'Waterproof hiking boots with Gore-Tex, excellent grip, lightweight', 199.99, 54, 52),
('Crispi Monaco GTX', 'Waterproof hiking boots with Gore-Tex, excellent support, durable', 269.99, 54, 33),
('Danner Mountain 600', 'Waterproof hiking boots with Danner Dry, excellent grip, comfortable', 189.99, 54, 51),
('Altra Lone Peak Hiker GTX', 'Waterproof hiking boots with Gore-Tex, zero-drop, wide toe box', 149.99, 54, 59);

-- Child Category 55: Hiking Sandals (subcategory_id: 11, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Chaco Z/Cloud 2', 'Hiking sandals with adjustable straps, excellent arch support, comfortable', 99.99, 55, 80),
('Teva Hurricane XLT2', 'Hiking sandals with adjustable straps, good grip, comfortable fit', 79.99, 55, 90),
('Keen Newport H2', 'Hiking sandals with closed toe, excellent protection, comfortable', 89.99, 55, 85),
('Merrell Kahuna III', 'Hiking sandals with adjustable straps, good grip, comfortable', 69.99, 55, 95),
('Bedrock Cairn 3D Pro', 'Minimalist hiking sandals with adjustable straps, excellent grip, lightweight', 119.99, 55, 70),
('Xero Z-Trail EV', 'Minimalist hiking sandals with adjustable straps, zero-drop, lightweight', 99.99, 55, 75),
('Luna Sandals Oso', 'Minimalist hiking sandals with adjustable straps, excellent grip, comfortable', 89.99, 55, 80),
('Shamma Mountain Goats', 'Minimalist hiking sandals with adjustable straps, excellent grip, lightweight', 109.99, 55, 72),
('Earth Runners Circadian', 'Minimalist hiking sandals with adjustable straps, zero-drop, comfortable', 79.99, 55, 88),
('Chaco Z/Volv 2', 'Hiking sandals with adjustable straps, excellent arch support, comfortable', 94.99, 55, 82),
('Teva Terra Fi 5', 'Hiking sandals with adjustable straps, good grip, durable construction', 84.99, 55, 86),
('Keen Clearwater CNX', 'Hiking sandals with closed toe, excellent protection, comfortable', 79.99, 55, 90),
('Merrell Hydro Moc', 'Water-friendly hiking sandals with slip-on design, comfortable, quick-dry', 49.99, 55, 100),
('Bedrock Cairn Adventure', 'Hiking sandals with adjustable straps, excellent grip, durable', 109.99, 55, 74),
('Xero Z-Trek', 'Minimalist hiking sandals with adjustable straps, zero-drop, lightweight', 79.99, 55, 92),
('Luna Sandals Mono', 'Minimalist hiking sandals with adjustable straps, excellent grip, comfortable', 94.99, 55, 78),
('Shamma Warriors', 'Minimalist hiking sandals with adjustable straps, excellent grip, lightweight', 99.99, 55, 76),
('Earth Runners Alpha', 'Minimalist hiking sandals with adjustable straps, zero-drop, comfortable', 69.99, 55, 94),
('Chaco Z/1 Classic', 'Classic hiking sandals with adjustable straps, excellent arch support', 89.99, 55, 84),
('Teva Original Universal', 'Classic hiking sandals with adjustable straps, good grip, comfortable', 64.99, 55, 96);

-- Child Category 56: Daypacks (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Osprey Talon 22', 'Daypack with 22L capacity, excellent organization, comfortable suspension', 99.99, 56, 70),
('Deuter Speed Lite 20', 'Lightweight daypack with 20L capacity, minimal design, comfortable', 79.99, 56, 80),
('Gregory Zulu 30', 'Daypack with 30L capacity, excellent suspension, good organization', 119.99, 56, 65),
('REI Co-op Flash 22', 'Lightweight daypack with 22L capacity, simple design, affordable', 59.99, 56, 85),
('Patagonia Nine Trails 28', 'Daypack with 28L capacity, excellent organization, comfortable fit', 109.99, 56, 68),
('Arc\'teryx Mantis 26', 'Daypack with 26L capacity, excellent organization, durable construction', 129.99, 56, 60),
('The North Face Recon', 'Daypack with 30L capacity, excellent organization, comfortable suspension', 99.99, 56, 72),
('Salomon XA 25', 'Trail running daypack with 25L capacity, excellent fit, lightweight', 89.99, 56, 75),
('Black Diamond Blitz 28', 'Daypack with 28L capacity, excellent organization, durable construction', 119.99, 56, 63),
('Mountain Hardwear Scrambler 30', 'Daypack with 30L capacity, excellent suspension, good organization', 109.99, 56, 67),
('Osprey Stratos 24', 'Daypack with 24L capacity, excellent suspension, good ventilation', 94.99, 56, 73),
('Deuter ACT Trail 24', 'Daypack with 24L capacity, excellent suspension, good organization', 84.99, 56, 78),
('Gregory Citro 24', 'Daypack with 24L capacity, excellent organization, comfortable fit', 99.99, 56, 71),
('REI Co-op Trail 25', 'Daypack with 25L capacity, simple design, affordable, comfortable', 69.99, 56, 82),
('Patagonia Refugio 28L', 'Daypack with 28L capacity, excellent organization, sustainable materials', 104.99, 56, 69),
('Arc\'teryx Brize 25', 'Daypack with 25L capacity, excellent organization, lightweight design', 124.99, 56, 61),
('The North Face Borealis', 'Daypack with 28L capacity, excellent organization, comfortable suspension', 94.99, 56, 74),
('Salomon Agile 12 Set', 'Trail running daypack with 12L capacity, excellent fit, lightweight', 79.99, 56, 77),
('Black Diamond Distance 15', 'Ultralight daypack with 15L capacity, minimal design, lightweight', 89.99, 56, 76),
('Mountain Hardwear Scrambler 25', 'Daypack with 25L capacity, excellent suspension, good organization', 99.99, 56, 70);

-- Child Category 57: Backpacking Packs (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Osprey Atmos AG 65', 'Backpacking pack with 65L capacity, Anti-Gravity suspension, excellent ventilation', 249.99, 57, 50),
('Deuter Aircontact Core 65+10', 'Backpacking pack with 65-75L capacity, excellent suspension, good ventilation', 199.99, 57, 55),
('Gregory Baltoro 75', 'Backpacking pack with 75L capacity, excellent suspension, comfortable fit', 279.99, 57, 45),
('REI Co-op Flash 55', 'Lightweight backpacking pack with 55L capacity, simple design, affordable', 149.99, 57, 60),
('Patagonia Ascensionist 55', 'Lightweight backpacking pack with 55L capacity, excellent organization', 229.99, 57, 48),
('Arc\'teryx Bora AR 65', 'Premium backpacking pack with 65L capacity, excellent suspension, durable', 399.99, 57, 35),
('The North Face Terra 65', 'Backpacking pack with 65L capacity, excellent suspension, good organization', 199.99, 57, 52),
('Salomon Quest 4D 50', 'Backpacking pack with 50L capacity, excellent fit, comfortable suspension', 179.99, 57, 58),
('Black Diamond Mission 75', 'Backpacking pack with 75L capacity, excellent suspension, durable', 249.99, 57, 47),
('Mountain Hardwear South Col 70', 'Backpacking pack with 70L capacity, excellent suspension, good organization', 229.99, 57, 49),
('Osprey Aether AG 70', 'Backpacking pack with 70L capacity, Anti-Gravity suspension, excellent ventilation', 269.99, 57, 46),
('Deuter Aircontact Lite 65+10', 'Lightweight backpacking pack with 65-75L capacity, excellent suspension', 189.99, 57, 54),
('Gregory Paragon 58', 'Lightweight backpacking pack with 58L capacity, excellent suspension, comfortable', 219.99, 57, 50),
('REI Co-op Traverse 70', 'Backpacking pack with 70L capacity, excellent suspension, good organization', 179.99, 57, 56),
('Patagonia Cragsmith 45', 'Backpacking pack with 45L capacity, excellent organization, durable construction', 199.99, 57, 51),
('Arc\'teryx Altra 65', 'Premium backpacking pack with 65L capacity, excellent suspension, lightweight', 349.99, 57, 40),
('The North Face Banchee 65', 'Backpacking pack with 65L capacity, excellent suspension, good organization', 189.99, 57, 53),
('Salomon Quest 4D 60', 'Backpacking pack with 60L capacity, excellent fit, comfortable suspension', 199.99, 57, 49),
('Black Diamond Mission 55', 'Backpacking pack with 55L capacity, excellent suspension, durable', 219.99, 57, 48),
('Mountain Hardwear South Col 60', 'Backpacking pack with 60L capacity, excellent suspension, good organization', 209.99, 57, 50);

-- Child Category 58: Hydration Packs (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('CamelBak M.U.L.E. 12', 'Hydration pack with 12L capacity, 3L reservoir, excellent organization', 119.99, 58, 65),
('Osprey Raptor 14', 'Hydration pack with 14L capacity, 3L reservoir, excellent suspension', 129.99, 58, 60),
('Salomon Adv Skin 12', 'Trail running hydration pack with 12L capacity, 1.5L soft flasks, excellent fit', 149.99, 58, 55),
('Nathan VaporKrar 12L', 'Hydration pack with 12L capacity, 2L reservoir, excellent organization', 109.99, 58, 68),
('Ultimate Direction Fastpack 20', 'Hydration pack with 20L capacity, excellent organization, lightweight', 139.99, 58, 62),
('Deuter Race X Air 12+3', 'Hydration pack with 12L capacity, 3L reservoir, excellent ventilation', 119.99, 58, 66),
('Gregory Nano 18', 'Hydration pack with 18L capacity, 3L reservoir, excellent suspension', 124.99, 58, 64),
('REI Co-op Flash 18', 'Hydration pack with 18L capacity, 3L reservoir, simple design, affordable', 89.99, 58, 72),
('Patagonia Slope Runner 12L', 'Hydration pack with 12L capacity, excellent organization, sustainable materials', 129.99, 58, 61),
('Arc\'teryx Norvan 14', 'Hydration pack with 14L capacity, excellent organization, lightweight design', 149.99, 58, 58),
('The North Face Flight Race Vest', 'Hydration pack with 12L capacity, excellent fit, comfortable suspension', 134.99, 58, 60),
('Black Diamond Distance 8', 'Ultralight hydration pack with 8L capacity, minimal design, lightweight', 99.99, 58, 70),
('Mountain Hardwear Fluid 12', 'Hydration pack with 12L capacity, 3L reservoir, excellent organization', 114.99, 58, 67),
('CamelBak Circuit', 'Hydration pack with 10L capacity, 3L reservoir, excellent organization', 109.99, 58, 69),
('Osprey Duro 15', 'Hydration pack with 15L capacity, 3L reservoir, excellent suspension', 119.99, 58, 65),
('Salomon Adv Skin 5 Set', 'Trail running hydration pack with 5L capacity, 1.5L soft flasks, excellent fit', 99.99, 58, 73),
('Nathan VaporKrar 4L', 'Hydration pack with 4L capacity, 2L reservoir, excellent organization', 79.99, 58, 75),
('Ultimate Direction Fastpack 15', 'Hydration pack with 15L capacity, excellent organization, lightweight', 124.99, 58, 66),
('Deuter Race X Air 8+3', 'Hydration pack with 8L capacity, 3L reservoir, excellent ventilation', 99.99, 58, 71),
('Gregory Nano 12', 'Hydration pack with 12L capacity, 3L reservoir, excellent suspension', 109.99, 58, 68);

-- Child Category 59: Ultralight Packs (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Hyperlite Mountain Gear Southwest 3400', 'Ultralight pack with 55L capacity, Dyneema fabric, minimal design, 1.9lbs', 349.99, 59, 45),
('Gossamer Gear Mariposa 60', 'Ultralight pack with 60L capacity, excellent organization, comfortable, 1.9lbs', 199.99, 59, 55),
('ULA Circuit', 'Ultralight pack with 68L capacity, excellent suspension, comfortable, 2.1lbs', 249.99, 59, 50),
('Zpacks Arc Blast', 'Ultralight pack with 55L capacity, Dyneema fabric, excellent suspension, 1.5lbs', 399.99, 59, 40),
('Six Moon Designs Swift', 'Ultralight pack with 50L capacity, excellent organization, lightweight, 1.8lbs', 179.99, 59, 58),
('Granite Gear Crown2 60', 'Ultralight pack with 60L capacity, excellent suspension, comfortable, 2.3lbs', 199.99, 59, 52),
('Osprey Levity 60', 'Ultralight pack with 60L capacity, excellent suspension, good ventilation, 2.1lbs', 229.99, 59, 48),
('REI Co-op Flash 55', 'Ultralight pack with 55L capacity, simple design, affordable, 2.4lbs', 149.99, 59, 60),
('Patagonia Ascensionist 45', 'Ultralight pack with 45L capacity, excellent organization, lightweight, 1.9lbs', 229.99, 59, 47),
('Arc\'teryx Altra 65', 'Ultralight pack with 65L capacity, excellent suspension, lightweight, 2.6lbs', 349.99, 59, 42),
('Hyperlite Mountain Gear 2400', 'Ultralight pack with 40L capacity, Dyneema fabric, minimal design, 1.6lbs', 299.99, 59, 50),
('Gossamer Gear Gorilla 50', 'Ultralight pack with 50L capacity, excellent organization, comfortable, 1.7lbs', 179.99, 59, 56),
('ULA Ohm 2.0', 'Ultralight pack with 63L capacity, excellent suspension, comfortable, 2.0lbs', 219.99, 59, 53),
('Zpacks Arc Haul', 'Ultralight pack with 60L capacity, Dyneema fabric, excellent suspension, 1.6lbs', 379.99, 59, 41),
('Six Moon Designs Fusion 50', 'Ultralight pack with 50L capacity, excellent organization, lightweight, 1.9lbs', 189.99, 59, 54),
('Granite Gear Virga 2', 'Ultralight pack with 50L capacity, excellent suspension, comfortable, 1.8lbs', 169.99, 59, 57),
('Osprey Exos 58', 'Ultralight pack with 58L capacity, excellent suspension, good ventilation, 2.5lbs', 199.99, 59, 51),
('REI Co-op Flash 45', 'Ultralight pack with 45L capacity, simple design, affordable, 2.1lbs', 129.99, 59, 62),
('Patagonia Nine Trails 28', 'Ultralight pack with 28L capacity, excellent organization, lightweight, 1.4lbs', 109.99, 59, 64),
('Arc\'teryx Brize 32', 'Ultralight pack with 32L capacity, excellent organization, lightweight, 1.6lbs', 199.99, 59, 49);

-- Child Category 60: Tactical Backpacks (subcategory_id: 12, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('5.11 Tactical RUSH 72', 'Tactical backpack with 55L capacity, MOLLE webbing, excellent organization, durable', 199.99, 60, 55),
('Maxpedition Falcon-II', 'Tactical backpack with 31L capacity, MOLLE webbing, excellent organization, durable', 179.99, 60, 58),
('Condor 3-Day Assault Pack', 'Tactical backpack with 30L capacity, MOLLE webbing, excellent organization, affordable', 89.99, 60, 70),
('Tactical Tailor Removable Operator Pack', 'Tactical backpack with 40L capacity, MOLLE webbing, excellent organization, durable', 249.99, 60, 48),
('Vanquest Markhor-25', 'Tactical backpack with 25L capacity, excellent organization, durable construction', 149.99, 60, 62),
('Direct Action Dragon Egg', 'Tactical backpack with 30L capacity, MOLLE webbing, excellent organization', 199.99, 60, 54),
('Helikon-Tex Direct Action', 'Tactical backpack with 35L capacity, MOLLE webbing, excellent organization', 159.99, 60, 59),
('First Tactical Specialist', 'Tactical backpack with 28L capacity, excellent organization, durable construction', 129.99, 60, 64),
('Blackhawk! Tactical 3-Day', 'Tactical backpack with 30L capacity, MOLLE webbing, excellent organization', 149.99, 60, 61),
('Mystery Ranch 3-Day Assault', 'Tactical backpack with 30L capacity, excellent suspension, durable construction', 279.99, 60, 45),
('5.11 Tactical RUSH 24', 'Tactical backpack with 24L capacity, MOLLE webbing, excellent organization, durable', 149.99, 60, 63),
('Maxpedition Condor-II', 'Tactical backpack with 25L capacity, MOLLE webbing, excellent organization, durable', 159.99, 60, 60),
('Condor Summit', 'Tactical backpack with 35L capacity, MOLLE webbing, excellent organization, affordable', 99.99, 60, 68),
('Tactical Tailor Operator Pack', 'Tactical backpack with 35L capacity, MOLLE webbing, excellent organization, durable', 219.99, 60, 52),
('Vanquest Katara-16', 'Tactical backpack with 16L capacity, excellent organization, durable construction', 119.99, 60, 66),
('Direct Action Dust', 'Tactical backpack with 25L capacity, MOLLE webbing, excellent organization', 179.99, 60, 56),
('Helikon-Tex Trooper', 'Tactical backpack with 30L capacity, MOLLE webbing, excellent organization', 139.99, 60, 61),
('First Tactical Responder', 'Tactical backpack with 24L capacity, excellent organization, durable construction', 109.99, 60, 67),
('Blackhawk! STRIKE', 'Tactical backpack with 28L capacity, MOLLE webbing, excellent organization', 129.99, 60, 64),
('Mystery Ranch Urban Assault', 'Tactical backpack with 24L capacity, excellent suspension, durable construction', 199.99, 60, 53);

-- Child Category 61: Hiking Pants (subcategory_id: 13, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Prana Stretch Zion', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable fit', 89.99, 61, 80),
('Arc\'teryx Gamma LT', 'Hiking pants with softshell fabric, excellent weather resistance, comfortable', 149.99, 61, 65),
('The North Face Paramount', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 79.99, 61, 85),
('Patagonia Quandary', 'Hiking pants with stretch fabric, moisture-wicking, sustainable materials', 89.99, 61, 82),
('Columbia Silver Ridge', 'Hiking pants with stretch fabric, moisture-wicking, UPF protection, affordable', 59.99, 61, 95),
('REI Co-op Sahara', 'Hiking pants with stretch fabric, moisture-wicking, UPF protection, comfortable', 69.99, 61, 90),
('Fjällräven Abisko', 'Hiking pants with durable fabric, excellent weather resistance, comfortable', 129.99, 61, 70),
('Kuhl Renegade', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 99.99, 61, 75),
('Outdoor Research Ferrosi', 'Hiking pants with stretch fabric, excellent breathability, comfortable', 109.99, 61, 72),
('Mountain Hardwear AP', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 94.99, 61, 78),
('Prana Brion', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable fit', 84.99, 61, 80),
('Arc\'teryx Lefroy', 'Hiking pants with stretch fabric, excellent breathability, lightweight', 119.99, 61, 73),
('The North Face Paramount Convertible', 'Convertible hiking pants with zip-off legs, stretch fabric, moisture-wicking', 89.99, 61, 81),
('Patagonia Quandary Convertible', 'Convertible hiking pants with zip-off legs, stretch fabric, sustainable materials', 99.99, 61, 77),
('Columbia Silver Ridge Convertible', 'Convertible hiking pants with zip-off legs, stretch fabric, UPF protection', 69.99, 61, 88),
('REI Co-op Sahara Convertible', 'Convertible hiking pants with zip-off legs, stretch fabric, UPF protection', 79.99, 61, 83),
('Fjällräven Vidda Pro', 'Hiking pants with durable fabric, excellent weather resistance, comfortable', 139.99, 61, 68),
('Kuhl Radikl', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 89.99, 61, 79),
('Outdoor Research Voodoo', 'Hiking pants with stretch fabric, excellent breathability, comfortable', 99.99, 61, 76),
('Mountain Hardwear Chockstone', 'Hiking pants with stretch fabric, moisture-wicking, durable, comfortable', 104.99, 61, 74);

