-- Product Data for Ecommerce Database
-- This file contains products for child categories 22-31 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 22-31
-- ============================================

-- Child Category 22: Video Games (subcategory_id: 5, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('The Legend of Zelda: Tears of the Kingdom', 'Nintendo Switch action-adventure game, sequel to Breath of the Wild, open-world exploration', 69.99, 22, 120),
('Marvel\'s Spider-Man 2', 'PlayStation 5 action-adventure game, play as both Spider-Men, stunning graphics', 69.99, 22, 100),
('Baldur\'s Gate 3', 'PC/PS5/Xbox RPG with deep storytelling, turn-based combat, multiple endings', 59.99, 22, 110),
('Super Mario Bros. Wonder', 'Nintendo Switch platformer with new power-ups, multiplayer support, colorful graphics', 59.99, 22, 130),
('Starfield', 'Xbox/PC space RPG with vast exploration, ship building, Bethesda open-world', 69.99, 22, 95),
('Final Fantasy XVI', 'PlayStation 5 action RPG with epic story, real-time combat, stunning visuals', 69.99, 22, 105),
('Hogwarts Legacy', 'PC/PS5/Xbox action RPG set in Harry Potter universe, open-world exploration', 59.99, 22, 115),
('Elden Ring', 'PC/PS5/Xbox action RPG with challenging combat, open-world, FromSoftware', 59.99, 22, 108),
('God of War Ragnarök', 'PlayStation 5 action-adventure game, epic Norse mythology story, combat', 69.99, 22, 98),
('Horizon Forbidden West', 'PlayStation 5 action RPG with robot dinosaurs, open-world, stunning graphics', 59.99, 22, 112),
('The Last of Us Part I', 'PlayStation 5 remake of classic survival game, enhanced graphics, emotional story', 69.99, 22, 102),
('Call of Duty: Modern Warfare III', 'PC/PS5/Xbox first-person shooter with campaign, multiplayer, zombies', 69.99, 22, 125),
('FIFA 24', 'PC/PS5/Xbox soccer simulation game with updated rosters, realistic gameplay', 69.99, 22, 140),
('NBA 2K24', 'PC/PS5/Xbox basketball simulation game with MyCareer, online multiplayer', 69.99, 22, 135),
('Minecraft', 'PC/PS5/Xbox creative sandbox game, build and explore infinite worlds', 29.99, 22, 200),
('Grand Theft Auto V', 'PC/PS5/Xbox open-world action game, story mode and online multiplayer', 39.99, 22, 150),
('Red Dead Redemption 2', 'PC/PS5/Xbox western action-adventure, open-world, compelling story', 59.99, 22, 118),
('Cyberpunk 2077', 'PC/PS5/Xbox sci-fi RPG with open-world, character customization, story choices', 49.99, 22, 122),
('Assassin\'s Creed Mirage', 'PC/PS5/Xbox action-adventure game, return to stealth gameplay, Middle East setting', 59.99, 22, 107),
('Resident Evil 4 Remake', 'PC/PS5/Xbox survival horror game, remake of classic, modern graphics', 59.99, 22, 113);

-- Child Category 23: Gaming Controllers (subcategory_id: 5, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('PlayStation 5 DualSense Controller', 'Official PS5 controller with haptic feedback, adaptive triggers, built-in microphone', 69.99, 23, 150),
('Xbox Wireless Controller', 'Official Xbox controller with textured grips, Bluetooth connectivity, 40-hour battery', 59.99, 23, 160),
('Nintendo Switch Pro Controller', 'Official Switch controller with motion controls, HD rumble, 40-hour battery', 69.99, 23, 140),
('Xbox Elite Wireless Controller Series 2', 'Premium controller with adjustable tension thumbsticks, paddles, 40-hour battery', 179.99, 23, 80),
('PlayStation 5 DualSense Edge', 'Premium PS5 controller with customizable buttons, replaceable stick modules, case', 199.99, 23, 75),
('Razer Wolverine V2 Chroma', 'Wired Xbox controller with 6 remappable buttons, RGB lighting, mecha-tactile switches', 99.99, 23, 100),
('Scuf Reflex Pro', 'Customizable PS5 controller with paddles, adjustable triggers, various colors', 229.99, 23, 70),
('8BitDo Pro 2', 'Universal controller with customizable buttons, macro support, 20-hour battery', 49.99, 23, 120),
('SteelSeries Stratus Duo', 'Wireless controller for PC and Android, 20-hour battery, comfortable design', 59.99, 23, 110),
('PowerA Enhanced Wired Controller', 'Licensed Xbox controller with 3.5mm audio jack, textured grips, affordable', 29.99, 23, 180),
('Hori Split Pad Pro', 'Ergonomic controller for Switch, larger grips, turbo function, no rumble', 49.99, 23, 130),
('Nacon Revolution X Pro', 'Wired Xbox controller with 4 back buttons, customizable profiles, audio controls', 79.99, 23, 95),
('Astro C40 TR', 'Modular PS4/PC controller with swappable components, tournament-grade', 199.99, 23, 65),
('Razer Kishi V2', 'Mobile gaming controller with USB-C connection, telescopic design, passthrough charging', 99.99, 23, 105),
('Backbone One', 'Mobile gaming controller for iPhone, connects to Lightning port, app integration', 99.99, 23, 108),
('GameSir X2', 'Mobile gaming controller with USB-C, telescopic design, passthrough charging', 49.99, 23, 125),
('8BitDo SN30 Pro', 'Retro-style controller with modern features, supports multiple platforms', 44.99, 23, 135),
('PDP Victrix Pro BFG', 'Modular PS5 controller with swappable components, tournament features', 179.99, 23, 72),
('HyperX Clutch Gladiate', 'Wired Xbox controller with textured grips, audio controls, affordable', 39.99, 23, 155),
('Thrustmaster eSwap X Pro', 'Modular Xbox controller with swappable components, customizable layout', 149.99, 23, 85);

-- Child Category 24: Gaming Accessories (subcategory_id: 5, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('SteelSeries Arctis 7P+', 'Wireless gaming headset for PlayStation, 30-hour battery, 3D audio support', 149.99, 24, 100),
('HyperX Cloud Alpha', 'Wired gaming headset with dual chamber drivers, detachable microphone, comfortable', 99.99, 24, 120),
('Razer BlackShark V2 Pro', 'Wireless gaming headset with 50mm drivers, 24-hour battery, THX Spatial Audio', 179.99, 24, 90),
('Logitech G Pro X', 'Wired gaming headset with Blue Voice microphone, DTS Headphone:X 2.0', 129.99, 24, 110),
('Corsair Virtuoso RGB Wireless', 'Premium wireless gaming headset with 20-hour battery, high-fidelity audio', 199.99, 24, 85),
('SteelSeries Apex Pro', 'Mechanical gaming keyboard with adjustable actuation, OLED display, RGB', 199.99, 24, 95),
('Razer Huntsman V3 Pro', 'Optical gaming keyboard with analog switches, 8000Hz polling, RGB', 249.99, 24, 80),
('Logitech G Pro X Superlight', 'Ultra-lightweight gaming mouse, 25K sensor, 60-hour battery, 63g weight', 159.99, 24, 105),
('Corsair K70 RGB TKL', 'Tenkeyless mechanical keyboard with Cherry MX switches, RGB lighting', 149.99, 24, 100),
('Razer DeathAdder V3', 'Gaming mouse with 30K DPI sensor, 90-hour battery, lightweight design', 69.99, 24, 130),
('SteelSeries Rival 5', 'Gaming mouse with 9 programmable buttons, RGB lighting, comfortable grip', 59.99, 24, 125),
('Logitech G502 X', 'Gaming mouse with Hero 25K sensor, LIGHTSPEED wireless, 140-hour battery', 149.99, 24, 98),
('Corsair MM700 RGB', 'Extended gaming mouse pad with RGB lighting, 930mm x 400mm, USB passthrough', 49.99, 24, 150),
('SteelSeries QcK Heavy', 'Large gaming mouse pad with 6mm thickness, smooth surface, 900mm x 300mm', 24.99, 24, 180),
('Elgato Stream Deck MK.2', '15-key stream controller with LCD keys, customizable shortcuts, app integration', 149.99, 24, 85),
('Blue Yeti USB Microphone', 'Professional USB microphone with multiple pickup patterns, studio quality', 129.99, 24, 100),
('HyperX QuadCast S', 'RGB USB microphone with anti-vibration shock mount, multiple patterns', 159.99, 24, 92),
('Elgato Key Light', 'Professional LED light panel with adjustable brightness and color temperature', 199.99, 24, 75),
('Corsair iCUE Nexus', 'Touchscreen stream controller with customizable shortcuts, app integration', 99.99, 24, 88),
('Razer Kiyo Pro', 'USB webcam with 1080p 60fps, adaptive light sensor, HDR support', 199.99, 24, 82);

-- Child Category 25: Gaming Chairs & Furniture (subcategory_id: 5, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Secretlab Titan Evo 2023', 'Premium gaming chair with memory foam, 4D armrests, lumbar support, various sizes', 429.99, 25, 60),
('Herman Miller Aeron', 'Professional ergonomic chair with PostureFit SL, adjustable arms, mesh back', 1395.99, 25, 30),
('SteelSeries Apex Pro TKL', 'Tenkeyless mechanical keyboard with adjustable actuation, OLED display, RGB', 199.99, 25, 95),
('Razer Iskur', 'Gaming chair with built-in lumbar support, 4D armrests, memory foam head pillow', 399.99, 25, 70),
('DXRacer Formula Series', 'Racing-style gaming chair with 4D armrests, lumbar pillow, headrest pillow', 349.99, 25, 75),
('Noblechairs Hero', 'Premium gaming chair with real leather, 4D armrests, memory foam, various colors', 499.99, 25, 55),
('Corsair T3 Rush', 'Gaming chair with soft fabric, 4D armrests, lumbar support, headrest pillow', 399.99, 25, 65),
('AKRacing Masters Series', 'Gaming chair with 4D armrests, lumbar support, premium materials', 449.99, 25, 58),
('GTracing Pro Series', 'Budget gaming chair with 4D armrests, lumbar pillow, headrest, footrest', 249.99, 25, 85),
('Respawn 110', 'Gaming chair with 4D armrests, lumbar support, footrest, affordable option', 199.99, 25, 90),
('Secretlab Magnus Pro', 'Motorized standing desk with 3-stage legs, memory presets, cable management', 999.99, 25, 40),
('UPLIFT V2 Standing Desk', 'Standing desk with dual motors, various sizes, cable management, accessories', 599.99, 25, 50),
('FlexiSpot E7 Pro', 'Electric standing desk with dual motors, 3-stage legs, memory presets', 449.99, 25, 55),
('IKEA BEKANT Desk', 'Simple desk with cable management, various sizes, affordable option', 199.99, 25, 80),
('Arozzi Arena Gaming Desk', 'Large gaming desk with mouse pad surface, cable management, cup holder', 299.99, 25, 70),
('Secretlab Magnus Metal Desk', 'Gaming desk with magnetic cable management, RGB strip, various sizes', 399.99, 25, 65),
('Ewin Racing Champion Series', 'Gaming chair with 4D armrests, lumbar support, premium materials', 379.99, 25, 68),
('Autonomous ErgoChair Pro', 'Ergonomic office chair with adjustable lumbar, headrest, 5-year warranty', 499.99, 25, 52),
('Herman Miller Embody', 'Premium ergonomic chair with pixelated support, adjustable arms, breathable', 1595.99, 25, 25),
('Steelcase Gesture', 'Professional ergonomic chair with LiveBack technology, adjustable arms, various fabrics', 1099.99, 25, 35);

-- Child Category 26: Professional Rackets (subcategory_id: 6, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Astrox 100 ZZ', 'Professional racket with stiff shaft, head-heavy balance, 4U weight, tournament-grade', 249.99, 26, 45),
('Victor Thruster F Enhanced', 'Professional racket with stiff shaft, head-heavy balance, 4U weight, power', 229.99, 26, 50),
('Li-Ning N9 II', 'Professional racket with medium-stiff shaft, balanced, 4U weight, control', 219.99, 26, 48),
('Yonex Nanoflare 800', 'Professional racket with extra-stiff shaft, head-light balance, 4U weight, speed', 239.99, 26, 46),
('Victor Jetspeed S 12', 'Professional racket with stiff shaft, head-light balance, 4U weight, fast', 229.99, 26, 49),
('Li-Ning Windstorm 72', 'Professional racket with medium-stiff shaft, head-light balance, 4U weight, speed', 199.99, 26, 52),
('Yonex Arcsaber 11 Pro', 'Professional racket with stiff shaft, balanced, 4U weight, all-round', 249.99, 26, 44),
('Victor Auraspeed 100X', 'Professional racket with extra-stiff shaft, head-light balance, 4U weight, fast', 239.99, 26, 47),
('Li-Ning Axforce 90', 'Professional racket with stiff shaft, head-heavy balance, 4U weight, power', 229.99, 26, 48),
('Yonex Duora Z-Strike', 'Professional racket with dual-sided technology, stiff shaft, 4U weight', 259.99, 26, 42),
('Victor DriveX 9X', 'Professional racket with stiff shaft, head-heavy balance, 4U weight, power', 219.99, 26, 50),
('Li-Ning Turbo Charging 75', 'Professional racket with medium-stiff shaft, balanced, 4U weight, all-round', 199.99, 26, 51),
('Yonex Astrox 88D Pro', 'Professional racket with stiff shaft, head-heavy balance, 4U weight, doubles', 249.99, 26, 45),
('Victor Auraspeed 90K', 'Professional racket with extra-stiff shaft, head-light balance, 4U weight, fast', 239.99, 26, 46),
('Li-Ning N7 II', 'Professional racket with stiff shaft, balanced, 4U weight, control', 219.99, 26, 49),
('Yonex Nanoflare 1000Z', 'Professional racket with extra-stiff shaft, head-light balance, 4U weight, speed', 259.99, 26, 43),
('Victor Thruster F Claw', 'Professional racket with stiff shaft, head-heavy balance, 4U weight, power', 229.99, 26, 47),
('Li-Ning Windstorm 9000', 'Professional racket with medium-stiff shaft, head-light balance, 4U weight, speed', 199.99, 26, 52),
('Yonex Arcsaber 7 Pro', 'Professional racket with stiff shaft, balanced, 4U weight, all-round', 239.99, 26, 46),
('Victor Auraspeed 12F', 'Professional racket with extra-stiff shaft, head-light balance, 4U weight, fast', 229.99, 26, 48);

-- Child Category 27: Intermediate Rackets (subcategory_id: 6, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Astrox 77', 'Intermediate racket with medium-stiff shaft, head-heavy balance, 4U weight, power', 149.99, 27, 70),
('Victor Thruster K Falcon', 'Intermediate racket with medium-stiff shaft, balanced, 4U weight, all-round', 139.99, 27, 75),
('Li-Ning Windstorm 500', 'Intermediate racket with flexible shaft, head-light balance, 4U weight, speed', 129.99, 27, 80),
('Yonex Nanoflare 700', 'Intermediate racket with medium-stiff shaft, head-light balance, 4U weight, fast', 149.99, 27, 72),
('Victor Auraspeed 70F', 'Intermediate racket with medium-stiff shaft, head-light balance, 4U weight, speed', 139.99, 27, 74),
('Li-Ning N80', 'Intermediate racket with medium-stiff shaft, balanced, 4U weight, control', 119.99, 27, 82),
('Yonex Arcsaber 11', 'Intermediate racket with medium-stiff shaft, balanced, 4U weight, all-round', 159.99, 27, 68),
('Victor DriveX 7X', 'Intermediate racket with medium-stiff shaft, head-heavy balance, 4U weight, power', 129.99, 27, 78),
('Li-Ning Turbo Charging 55', 'Intermediate racket with flexible shaft, balanced, 4U weight, all-round', 109.99, 27, 85),
('Yonex Astrox 68D', 'Intermediate racket with medium-stiff shaft, head-heavy balance, 4U weight, doubles', 149.99, 27, 70),
('Victor Auraspeed 50K', 'Intermediate racket with medium-stiff shaft, head-light balance, 4U weight, fast', 139.99, 27, 76),
('Li-Ning N50', 'Intermediate racket with flexible shaft, balanced, 4U weight, control', 119.99, 27, 80),
('Yonex Nanoflare 370', 'Intermediate racket with flexible shaft, head-light balance, 4U weight, speed', 99.99, 27, 88),
('Victor Thruster K Onigiri', 'Intermediate racket with medium-stiff shaft, balanced, 4U weight, all-round', 129.99, 27, 77),
('Li-Ning Windstorm 300', 'Intermediate racket with flexible shaft, head-light balance, 4U weight, speed', 109.99, 27, 83),
('Yonex Arcsaber 7', 'Intermediate racket with medium-stiff shaft, balanced, 4U weight, all-round', 139.99, 27, 74),
('Victor DriveX 5X', 'Intermediate racket with flexible shaft, head-heavy balance, 4U weight, power', 119.99, 27, 81),
('Li-Ning Turbo Charging 35', 'Intermediate racket with flexible shaft, balanced, 4U weight, all-round', 99.99, 27, 87),
('Yonex Astrox 38D', 'Intermediate racket with flexible shaft, head-heavy balance, 4U weight, doubles', 129.99, 27, 79),
('Victor Auraspeed 30F', 'Intermediate racket with flexible shaft, head-light balance, 4U weight, fast', 119.99, 27, 82);

-- Child Category 28: Beginner Rackets (subcategory_id: 6, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Nanoray 10F', 'Beginner racket with flexible shaft, head-light balance, 4U weight, easy to use', 79.99, 28, 100),
('Victor Brave Sword 12', 'Beginner racket with flexible shaft, balanced, 4U weight, forgiving', 69.99, 28, 110),
('Li-Ning Windstorm 200', 'Beginner racket with flexible shaft, head-light balance, 4U weight, lightweight', 59.99, 28, 120),
('Yonex Voltric 7', 'Beginner racket with flexible shaft, head-heavy balance, 4U weight, power', 89.99, 28, 95),
('Victor Thruster K 15', 'Beginner racket with flexible shaft, balanced, 4U weight, all-round', 79.99, 28, 105),
('Li-Ning N20', 'Beginner racket with flexible shaft, balanced, 4U weight, control', 69.99, 28, 115),
('Yonex Arcsaber 3', 'Beginner racket with flexible shaft, balanced, 4U weight, all-round', 99.99, 28, 90),
('Victor DriveX 3X', 'Beginner racket with flexible shaft, head-heavy balance, 4U weight, power', 79.99, 28, 100),
('Li-Ning Turbo Charging 15', 'Beginner racket with flexible shaft, balanced, 4U weight, all-round', 59.99, 28, 125),
('Yonex Nanoray 20', 'Beginner racket with flexible shaft, head-light balance, 4U weight, speed', 89.99, 28, 92),
('Victor Auraspeed 10F', 'Beginner racket with flexible shaft, head-light balance, 4U weight, fast', 79.99, 28, 103),
('Li-Ning N10', 'Beginner racket with flexible shaft, balanced, 4U weight, control', 69.99, 28, 112),
('Yonex Astrox 5', 'Beginner racket with flexible shaft, head-heavy balance, 4U weight, power', 99.99, 28, 88),
('Victor Thruster K 10', 'Beginner racket with flexible shaft, balanced, 4U weight, all-round', 79.99, 28, 106),
('Li-Ning Windstorm 100', 'Beginner racket with flexible shaft, head-light balance, 4U weight, speed', 59.99, 28, 122),
('Yonex Arcsaber Lite', 'Beginner racket with flexible shaft, balanced, 4U weight, all-round', 89.99, 28, 94),
('Victor DriveX Lite', 'Beginner racket with flexible shaft, head-heavy balance, 4U weight, power', 79.99, 28, 101),
('Li-Ning Turbo Charging Lite', 'Beginner racket with flexible shaft, balanced, 4U weight, all-round', 69.99, 28, 108),
('Yonex Nanoray Lite', 'Beginner racket with flexible shaft, head-light balance, 4U weight, speed', 89.99, 28, 96),
('Victor Auraspeed Lite', 'Beginner racket with flexible shaft, head-light balance, 4U weight, fast', 79.99, 28, 104);

-- Child Category 29: Lightweight Rackets (subcategory_id: 6, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Nanoflare 800', 'Lightweight racket with extra-stiff shaft, head-light balance, 5U weight, speed', 239.99, 29, 55),
('Victor Auraspeed 100X', 'Lightweight racket with extra-stiff shaft, head-light balance, 5U weight, fast', 229.99, 29, 58),
('Li-Ning Windstorm 72', 'Lightweight racket with medium-stiff shaft, head-light balance, 5U weight, speed', 199.99, 29, 62),
('Yonex Arcsaber 11 Pro', 'Lightweight racket with stiff shaft, balanced, 5U weight, all-round', 249.99, 29, 52),
('Victor Jetspeed S 12', 'Lightweight racket with stiff shaft, head-light balance, 5U weight, fast', 229.99, 29, 56),
('Li-Ning N9 II', 'Lightweight racket with medium-stiff shaft, balanced, 5U weight, control', 219.99, 29, 60),
('Yonex Astrox 100 ZZ', 'Lightweight racket with stiff shaft, head-heavy balance, 5U weight, power', 249.99, 29, 54),
('Victor Thruster F Enhanced', 'Lightweight racket with stiff shaft, head-heavy balance, 5U weight, power', 229.99, 29, 57),
('Li-Ning Windstorm 9000', 'Lightweight racket with medium-stiff shaft, head-light balance, 5U weight, speed', 199.99, 29, 61),
('Yonex Nanoflare 1000Z', 'Lightweight racket with extra-stiff shaft, head-light balance, 5U weight, speed', 259.99, 29, 50),
('Victor Auraspeed 90K', 'Lightweight racket with extra-stiff shaft, head-light balance, 5U weight, fast', 239.99, 29, 55),
('Li-Ning Turbo Charging 75', 'Lightweight racket with medium-stiff shaft, balanced, 5U weight, all-round', 199.99, 29, 63),
('Yonex Arcsaber 7 Pro', 'Lightweight racket with stiff shaft, balanced, 5U weight, all-round', 239.99, 29, 53),
('Victor Auraspeed 12F', 'Lightweight racket with extra-stiff shaft, head-light balance, 5U weight, fast', 229.99, 29, 56),
('Li-Ning N7 II', 'Lightweight racket with stiff shaft, balanced, 5U weight, control', 219.99, 29, 59),
('Yonex Nanoflare 700', 'Lightweight racket with medium-stiff shaft, head-light balance, 5U weight, speed', 149.99, 29, 68),
('Victor Auraspeed 70F', 'Lightweight racket with medium-stiff shaft, head-light balance, 5U weight, speed', 139.99, 29, 70),
('Li-Ning Windstorm 500', 'Lightweight racket with flexible shaft, head-light balance, 5U weight, speed', 129.99, 29, 72),
('Yonex Arcsaber 11', 'Lightweight racket with medium-stiff shaft, balanced, 5U weight, all-round', 159.99, 29, 65),
('Victor Jetspeed S 10', 'Lightweight racket with medium-stiff shaft, head-light balance, 5U weight, fast', 149.99, 29, 67);

-- Child Category 30: Heavy Rackets (subcategory_id: 6, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Astrox 100 ZZ', 'Heavy racket with stiff shaft, head-heavy balance, 3U weight, maximum power', 249.99, 30, 40),
('Victor Thruster F Enhanced', 'Heavy racket with stiff shaft, head-heavy balance, 3U weight, power', 229.99, 30, 42),
('Li-Ning Axforce 90', 'Heavy racket with stiff shaft, head-heavy balance, 3U weight, power', 229.99, 30, 43),
('Yonex Astrox 88D Pro', 'Heavy racket with stiff shaft, head-heavy balance, 3U weight, doubles', 249.99, 30, 41),
('Victor DriveX 9X', 'Heavy racket with stiff shaft, head-heavy balance, 3U weight, power', 219.99, 30, 44),
('Li-Ning N9 II', 'Heavy racket with medium-stiff shaft, balanced, 3U weight, control', 219.99, 30, 45),
('Yonex Voltric Z-Force II', 'Heavy racket with stiff shaft, head-heavy balance, 3U weight, power', 239.99, 30, 39),
('Victor Thruster F Claw', 'Heavy racket with stiff shaft, head-heavy balance, 3U weight, power', 229.99, 30, 42),
('Li-Ning Turbo Charging 90', 'Heavy racket with medium-stiff shaft, balanced, 3U weight, all-round', 199.99, 30, 46),
('Yonex Astrox 77', 'Heavy racket with medium-stiff shaft, head-heavy balance, 3U weight, power', 149.99, 30, 50),
('Victor Thruster K Falcon', 'Heavy racket with medium-stiff shaft, balanced, 3U weight, all-round', 139.99, 30, 52),
('Li-Ning N80', 'Heavy racket with medium-stiff shaft, balanced, 3U weight, control', 119.99, 30, 54),
('Yonex Arcsaber 11 Pro', 'Heavy racket with stiff shaft, balanced, 3U weight, all-round', 249.99, 30, 40),
('Victor DriveX 7X', 'Heavy racket with medium-stiff shaft, head-heavy balance, 3U weight, power', 129.99, 30, 51),
('Li-Ning Turbo Charging 55', 'Heavy racket with flexible shaft, balanced, 3U weight, all-round', 109.99, 30, 55),
('Yonex Astrox 68D', 'Heavy racket with medium-stiff shaft, head-heavy balance, 3U weight, doubles', 149.99, 30, 48),
('Victor Thruster K Onigiri', 'Heavy racket with medium-stiff shaft, balanced, 3U weight, all-round', 129.99, 30, 50),
('Li-Ning N50', 'Heavy racket with flexible shaft, balanced, 3U weight, control', 119.99, 30, 53),
('Yonex Voltric 7', 'Heavy racket with flexible shaft, head-heavy balance, 3U weight, power', 89.99, 30, 58),
('Victor DriveX 5X', 'Heavy racket with flexible shaft, head-heavy balance, 3U weight, power', 119.99, 30, 52);

-- Child Category 31: Feather Shuttlecocks (subcategory_id: 7, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Aerosensa 50', 'Premium feather shuttlecock, tournament-grade, consistent flight, 12-pack', 29.99, 31, 150),
('Victor Master Ace', 'Premium feather shuttlecock, professional quality, excellent durability, 12-pack', 27.99, 31, 160),
('Li-Ning A+ 60', 'Premium feather shuttlecock, tournament-grade, consistent flight, 12-pack', 26.99, 31, 165),
('Yonex Aerosensa 30', 'Professional feather shuttlecock, high quality, consistent flight, 12-pack', 24.99, 31, 170),
('Victor Champion', 'Professional feather shuttlecock, good quality, consistent flight, 12-pack', 22.99, 31, 175),
('Li-Ning A+ 80', 'Professional feather shuttlecock, tournament-grade, excellent flight, 12-pack', 28.99, 31, 158),
('Yonex Aerosensa 20', 'Intermediate feather shuttlecock, good quality, consistent flight, 12-pack', 19.99, 31, 180),
('Victor Master No.1', 'Intermediate feather shuttlecock, good quality, consistent flight, 12-pack', 18.99, 31, 185),
('Li-Ning A+ 100', 'Intermediate feather shuttlecock, good quality, consistent flight, 12-pack', 17.99, 31, 190),
('Yonex Aerosensa 10', 'Beginner feather shuttlecock, affordable quality, consistent flight, 12-pack', 14.99, 31, 200),
('Victor Master No.2', 'Beginner feather shuttlecock, affordable quality, consistent flight, 12-pack', 13.99, 31, 205),
('Li-Ning A+ 200', 'Beginner feather shuttlecock, affordable quality, consistent flight, 12-pack', 12.99, 31, 210),
('Yonex Mavis 350', 'Training feather shuttlecock, durable, consistent flight, 12-pack', 16.99, 31, 195),
('Victor Master No.3', 'Training feather shuttlecock, durable, consistent flight, 12-pack', 15.99, 31, 198),
('Li-Ning A+ 300', 'Training feather shuttlecock, durable, consistent flight, 12-pack', 14.99, 31, 200),
('Yonex Aerosensa 40', 'Competition feather shuttlecock, high quality, consistent flight, 12-pack', 26.99, 31, 168),
('Victor Master Ace Pro', 'Competition feather shuttlecock, professional quality, excellent flight, 12-pack', 29.99, 31, 155),
('Li-Ning A+ 40', 'Competition feather shuttlecock, tournament-grade, consistent flight, 12-pack', 27.99, 31, 162),
('Yonex Aerosensa 60', 'Elite feather shuttlecock, premium quality, exceptional flight, 12-pack', 32.99, 31, 145),
('Victor Master Ace Elite', 'Elite feather shuttlecock, premium quality, exceptional flight, 12-pack', 31.99, 31, 148);

