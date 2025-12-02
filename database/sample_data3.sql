-- Product Data for Ecommerce Database
-- This file contains products for child categories 12-21 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 12-21
-- ============================================

-- Child Category 12: Wired Headphones (subcategory_id: 3, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Sennheiser HD 660S2', 'Open-back audiophile headphones with exceptional sound quality, 150-ohm impedance', 599.99, 12, 45),
('Audio-Technica ATH-M50x', 'Professional studio monitor headphones with exceptional clarity, foldable design', 149.99, 12, 100),
('Beyerdynamic DT 770 Pro', 'Closed-back studio headphones with 80-ohm impedance, comfortable fit', 179.99, 12, 85),
('Sony MDR-7506', 'Professional studio headphones with 40mm drivers, foldable design, industry standard', 99.99, 12, 120),
('Sennheiser HD 600', 'Open-back reference headphones with natural sound reproduction, 300-ohm', 399.99, 12, 60),
('AKG K371', 'Closed-back studio headphones with accurate sound reproduction, comfortable fit', 149.99, 12, 90),
('Beyerdynamic DT 990 Pro', 'Open-back studio headphones with 250-ohm impedance, detailed sound', 179.99, 12, 80),
('Audio-Technica ATH-R70x', 'Open-back reference headphones with 470-ohm impedance, professional grade', 349.99, 12, 55),
('Grado SR325x', 'Open-back headphones with hand-assembled drivers, warm sound signature', 295.99, 12, 65),
('Focal Clear', 'High-end open-back headphones with exceptional detail and clarity', 1499.99, 12, 25),
('Sennheiser HD 650', 'Open-back audiophile headphones with warm sound signature, 300-ohm', 499.99, 12, 50),
('Audio-Technica ATH-M40x', 'Studio monitor headphones with 40mm drivers, foldable design, affordable', 99.99, 12, 110),
('Beyerdynamic DT 1990 Pro', 'Open-back studio headphones with analytical sound, 250-ohm', 599.99, 12, 40),
('AKG K702', 'Open-back reference headphones with wide soundstage, comfortable fit', 199.99, 12, 75),
('Sony MDR-1AM2', 'Premium closed-back headphones with 40mm drivers, lightweight design', 299.99, 12, 70),
('Meze 99 Classics', 'Premium closed-back headphones with wooden earcups, warm sound', 309.99, 12, 58),
('Hifiman Sundara', 'Planar magnetic headphones with exceptional detail and clarity', 349.99, 12, 62),
('Philips Fidelio X2HR', 'Open-back headphones with 50mm drivers, comfortable fit, great value', 149.99, 12, 88),
('Shure SRH840', 'Professional studio headphones with accurate sound reproduction, detachable cable', 149.99, 12, 82),
('Drop + Sennheiser HD 6XX', 'Open-back headphones based on HD 650, exceptional value, 300-ohm', 219.99, 12, 68);

-- Child Category 13: Speakers (subcategory_id: 3, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Sonos Era 300', 'Premium smart speaker with spatial audio, voice control, Wi-Fi connectivity', 449.99, 13, 60),
('Bose SoundLink Flex', 'Portable Bluetooth speaker with waterproof design, 12-hour battery', 149.99, 13, 100),
('JBL Flip 6', 'Portable Bluetooth speaker with IPX7 waterproof, 12-hour battery, PartyBoost', 129.99, 13, 110),
('Sonos Beam Gen 2', 'Compact soundbar with Dolby Atmos, voice control, HDMI eARC', 449.99, 13, 70),
('Bose Home Speaker 500', 'Smart speaker with 360-degree sound, voice control, Wi-Fi and Bluetooth', 399.99, 13, 75),
('JBL Charge 5', 'Portable Bluetooth speaker with 20-hour battery, IPX7 waterproof, power bank', 179.99, 13, 95),
('Sonos Arc', 'Premium soundbar with Dolby Atmos, 11 drivers, voice control, HDMI eARC', 899.99, 13, 45),
('Ultimate Ears Boom 3', '360-degree Bluetooth speaker with 15-hour battery, IP67 waterproof', 149.99, 13, 105),
('Bose Soundbar 700', 'Premium soundbar with voice control, Wi-Fi and Bluetooth, sleek design', 799.99, 13, 50),
('JBL PartyBox 310', 'Large party speaker with 240W power, 18-hour battery, light show', 399.99, 13, 55),
('Sonos One SL', 'Wireless speaker with rich sound, works with Sonos system, no voice', 219.99, 13, 85),
('Anker Soundcore Motion+', 'Portable Bluetooth speaker with Hi-Res Audio, 12-hour battery', 99.99, 13, 120),
('Samsung HW-Q990C', 'Premium soundbar system with Dolby Atmos, wireless subwoofer and rear speakers', 1399.99, 13, 30),
('Bose Portable Smart Speaker', 'Smart speaker with 360-degree sound, battery-powered, voice control', 399.99, 13, 68),
('JBL Xtreme 3', 'Large portable speaker with 15-hour battery, IPX7 waterproof, PartyBoost', 379.99, 13, 62),
('Sonos Sub Gen 3', 'Wireless subwoofer with deep bass, works with Sonos speakers', 799.99, 13, 40),
('Ultimate Ears Hyperboom', 'Large Bluetooth speaker with 24-hour battery, 150W power, IPX4 splash', 399.99, 13, 58),
('Bose Smart Soundbar 600', 'Compact soundbar with Dolby Atmos, voice control, HDMI eARC', 449.99, 13, 72),
('JBL Go 3', 'Ultra-compact Bluetooth speaker with IP67 waterproof, 5-hour battery', 49.99, 13, 150),
('Anker Soundcore Flare 2', '360-degree Bluetooth speaker with LED lights, 12-hour battery', 79.99, 13, 115);

-- Child Category 14: Earbuds & In-Ear (subcategory_id: 3, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Apple AirPods Pro (2nd Gen)', 'Premium wireless earbuds with Active Noise Cancellation, USB-C, spatial audio', 249.99, 14, 120),
('Sony WF-1000XM5', 'Premium noise-canceling earbuds with 8-hour battery, LDAC support, quick charge', 299.99, 14, 100),
('Bose QuietComfort Earbuds II', 'Noise-canceling earbuds with 6-hour battery, comfortable fit, great ANC', 279.99, 14, 95),
('Samsung Galaxy Buds2 Pro', 'Premium earbuds with active noise cancellation, 360 Audio, 8-hour battery', 229.99, 14, 110),
('Jabra Elite 10', 'Premium earbuds with Dolby Atmos, 6-hour battery, IP57 waterproof', 249.99, 14, 105),
('Sennheiser Momentum True Wireless 3', 'Premium earbuds with 7-hour battery, aptX Adaptive, excellent sound', 249.99, 14, 90),
('Beats Fit Pro', 'Sport earbuds with secure fit, Active Noise Cancellation, 6-hour battery', 199.99, 14, 115),
('Google Pixel Buds Pro', 'Smart earbuds with active noise cancellation, 7-hour battery, Google Assistant', 199.99, 14, 108),
('Anker Soundcore Liberty 4 NC', 'Noise-canceling earbuds with 9-hour battery, LDAC support, affordable', 99.99, 14, 130),
('OnePlus Buds Pro 2', 'Premium earbuds with active noise cancellation, 9-hour battery, fast charging', 179.99, 14, 112),
('Sony WF-1000XM4', 'Previous generation noise-canceling earbuds with 8-hour battery, LDAC', 249.99, 14, 98),
('JBL Live Pro 2', 'Noise-canceling earbuds with 10-hour battery, JBL Signature Sound', 149.99, 14, 118),
('Bose Sport Earbuds', 'Sport earbuds with secure fit, 5-hour battery, IPX4 sweat-resistant', 179.99, 14, 102),
('Sennheiser CX Plus', 'True wireless earbuds with active noise cancellation, 8-hour battery', 129.99, 14, 125),
('Apple AirPods (3rd Gen)', 'Wireless earbuds with spatial audio, 6-hour battery, MagSafe case', 179.99, 14, 140),
('Samsung Galaxy Buds FE', 'Affordable earbuds with active noise cancellation, 8-hour battery', 99.99, 14, 135),
('Jabra Elite 7 Pro', 'Premium earbuds with active noise cancellation, 8-hour battery, multipoint', 199.99, 14, 107),
('Anker Soundcore Space A40', 'Noise-canceling earbuds with 10-hour battery, LDAC, great value', 79.99, 14, 145),
('Beats Studio Buds', 'True wireless earbuds with active noise cancellation, 8-hour battery', 149.99, 14, 122),
('Sony LinkBuds S', 'Lightweight earbuds with noise cancellation, 6-hour battery, comfortable', 199.99, 14, 105);

-- Child Category 15: Audio Accessories (subcategory_id: 3, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('AudioQuest Golden Gate', 'Premium 3.5mm to 3.5mm audio cable with high-quality connectors', 29.99, 15, 150),
('FiiO BTR7', 'Portable Bluetooth DAC/amp with LDAC support, balanced output, 13-hour battery', 199.99, 15, 80),
('Schiit Magni+', 'Desktop headphone amplifier with clean power, RCA inputs, volume control', 109.99, 15, 95),
('AudioQuest DragonFly Red', 'USB DAC/amp with high-resolution audio support, plug-and-play', 199.99, 15, 85),
('FiiO K5 Pro', 'Desktop DAC/amp with multiple inputs, balanced output, volume control', 149.99, 15, 90),
('Schiit Modi+', 'Desktop USB DAC with high-resolution audio, RCA outputs, clean design', 129.99, 15, 88),
('AudioQuest Cinnamon USB', 'Premium USB-A to USB-B cable for audio equipment, high-quality', 49.99, 15, 120),
('FiiO Q11', 'Portable DAC/amp with USB-C and 3.5mm inputs, balanced output', 99.99, 15, 100),
('Schiit Hel', 'USB DAC/amp with microphone input, perfect for gaming and streaming', 189.99, 15, 75),
('AudioQuest Big Sur', 'Premium XLR balanced audio cable with high-quality connectors', 79.99, 15, 110),
('FiiO E10K', 'USB DAC/amp with bass boost, volume control, affordable desktop solution', 75.99, 15, 105),
('Schiit Vali 2+', 'Hybrid tube headphone amplifier with warm sound, RCA inputs', 149.99, 15, 82),
('AudioQuest Forest USB', 'USB-A to USB-B cable for audio equipment, good quality', 24.99, 15, 140),
('FiiO BTR5', 'Portable Bluetooth DAC/amp with LDAC, balanced output, 9-hour battery', 109.99, 15, 92),
('Schiit Asgard 3', 'High-power headphone amplifier with multiple inputs, volume control', 249.99, 15, 70),
('AudioQuest Golden Gate RCA', 'Premium RCA to RCA audio cable with high-quality connectors', 39.99, 15, 125),
('FiiO M11 Plus', 'High-resolution portable music player with Android, dual DACs', 699.99, 15, 50),
('Schiit Jotunheim 2', 'Balanced headphone amplifier with multiple inputs, powerful output', 399.99, 15, 60),
('AudioQuest Cinnamon HDMI', 'Premium HDMI cable for audio/video, supports 4K and HDR', 59.99, 15, 115),
('FiiO UTWS5', 'True wireless adapter for wired headphones, LDAC support, 10-hour battery', 89.99, 15, 98);

-- Child Category 16: DSLR Cameras (subcategory_id: 4, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Canon EOS R6 Mark II', 'Full-frame mirrorless camera with 24MP sensor, 4K video, in-body stabilization', 2499.99, 16, 35),
('Nikon D850', 'Full-frame DSLR with 45.7MP sensor, 4K video, excellent image quality', 2999.99, 16, 25),
('Canon EOS 5D Mark IV', 'Full-frame DSLR with 30.4MP sensor, 4K video, professional build', 2499.99, 16, 30),
('Nikon D780', 'Full-frame DSLR with 24.5MP sensor, 4K video, excellent low-light', 2299.99, 16, 32),
('Canon EOS 90D', 'APS-C DSLR with 32.5MP sensor, 4K video, 10fps continuous shooting', 1199.99, 16, 45),
('Nikon D7500', 'APS-C DSLR with 20.9MP sensor, 4K video, 8fps continuous shooting', 999.99, 16, 50),
('Canon EOS Rebel T8i', 'Entry-level DSLR with 24.1MP sensor, Full HD video, beginner-friendly', 749.99, 16, 60),
('Nikon D3500', 'Entry-level DSLR with 24.2MP sensor, Full HD video, lightweight design', 499.99, 16, 65),
('Canon EOS 6D Mark II', 'Full-frame DSLR with 26.2MP sensor, vari-angle touchscreen, Wi-Fi', 1399.99, 16, 40),
('Nikon D610', 'Full-frame DSLR with 24.3MP sensor, excellent image quality, affordable', 999.99, 16, 48),
('Canon EOS 1D X Mark III', 'Professional DSLR with 20.1MP sensor, 16fps continuous, 4K video', 6499.99, 16, 15),
('Nikon D6', 'Professional DSLR with 20.8MP sensor, 14fps continuous, robust build', 6499.99, 16, 12),
('Canon EOS R5', 'Full-frame mirrorless with 45MP sensor, 8K video, in-body stabilization', 3899.99, 16, 20),
('Nikon Z9', 'Full-frame mirrorless with 45.7MP sensor, 8K video, 120fps continuous', 5499.99, 16, 18),
('Canon EOS R', 'Full-frame mirrorless with 30.3MP sensor, 4K video, excellent autofocus', 1799.99, 16, 42),
('Nikon Z7 II', 'Full-frame mirrorless with 45.7MP sensor, 4K video, dual processors', 2999.99, 16, 28),
('Canon EOS R8', 'Full-frame mirrorless with 24.2MP sensor, 4K video, compact design', 1499.99, 16, 38),
('Nikon Z6 II', 'Full-frame mirrorless with 24.5MP sensor, 4K video, excellent performance', 1999.99, 16, 33),
('Canon EOS M50 Mark II', 'APS-C mirrorless with 24.1MP sensor, 4K video, vari-angle screen', 599.99, 16, 55),
('Nikon Z50', 'APS-C mirrorless with 20.9MP sensor, 4K video, compact and lightweight', 859.99, 16, 52);

-- Child Category 17: Mirrorless Cameras (subcategory_id: 4, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Sony Alpha 7 IV', 'Full-frame mirrorless with 33MP sensor, 4K video, excellent autofocus', 2499.99, 17, 40),
('Fujifilm X-T5', 'APS-C mirrorless with 40.2MP sensor, 6.2K video, weather-sealed body', 1699.99, 17, 45),
('Sony Alpha 7R V', 'Full-frame mirrorless with 61MP sensor, 8K video, AI autofocus', 3999.99, 17, 25),
('Olympus OM-D E-M1 Mark III', 'Micro Four Thirds with 20.4MP sensor, 4K video, in-body stabilization', 1799.99, 17, 38),
('Panasonic Lumix GH6', 'Micro Four Thirds with 25.2MP sensor, 5.7K video, professional video', 1999.99, 17, 35),
('Sony Alpha 7S III', 'Full-frame mirrorless with 12.1MP sensor, 4K 120fps video, low-light king', 3499.99, 17, 28),
('Fujifilm X-H2', 'APS-C mirrorless with 40.2MP sensor, 8K video, weather-sealed', 1999.99, 17, 42),
('Canon EOS R6', 'Full-frame mirrorless with 20.1MP sensor, 4K video, in-body stabilization', 2499.99, 17, 36),
('Nikon Z8', 'Full-frame mirrorless with 45.7MP sensor, 8K video, pro features', 3999.99, 17, 22),
('Sony Alpha 6700', 'APS-C mirrorless with 26MP sensor, 4K video, AI autofocus', 1399.99, 17, 48),
('Fujifilm X-S20', 'APS-C mirrorless with 26.1MP sensor, 6.2K video, vlogging features', 1299.99, 17, 50),
('Panasonic Lumix S5 II', 'Full-frame mirrorless with 24.2MP sensor, 6K video, phase detection', 1999.99, 17, 40),
('Sony Alpha 7C', 'Compact full-frame mirrorless with 24.2MP sensor, 4K video, lightweight', 1799.99, 17, 44),
('Fujifilm X-T4', 'APS-C mirrorless with 26.1MP sensor, 4K video, in-body stabilization', 1699.99, 17, 46),
('Olympus OM-D E-M5 Mark III', 'Micro Four Thirds with 20.4MP sensor, 4K video, compact design', 1199.99, 17, 52),
('Sony Alpha 6400', 'APS-C mirrorless with 24.2MP sensor, 4K video, real-time tracking', 899.99, 17, 58),
('Fujifilm X-E4', 'Compact APS-C mirrorless with 26.1MP sensor, 4K video, retro design', 699.99, 17, 60),
('Panasonic Lumix G9', 'Micro Four Thirds with 20.3MP sensor, 4K video, high-speed shooting', 1299.99, 17, 48),
('Canon EOS R7', 'APS-C mirrorless with 32.5MP sensor, 4K video, 30fps continuous', 1499.99, 17, 45),
('Nikon Z fc', 'APS-C mirrorless with 20.9MP sensor, 4K video, retro design', 959.99, 17, 54);

-- Child Category 18: Camera Lenses (subcategory_id: 4, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Canon RF 24-70mm f/2.8L IS USM', 'Professional zoom lens for Canon RF, constant f/2.8, image stabilization', 2299.99, 18, 30),
('Sony FE 24-70mm f/2.8 GM II', 'Professional zoom lens for Sony E, constant f/2.8, lightweight', 2199.99, 18, 32),
('Nikon Z 24-70mm f/2.8 S', 'Professional zoom lens for Nikon Z, constant f/2.8, excellent sharpness', 2299.99, 18, 28),
('Canon RF 70-200mm f/2.8L IS USM', 'Telephoto zoom lens for Canon RF, constant f/2.8, image stabilization', 2699.99, 18, 25),
('Sony FE 70-200mm f/2.8 GM OSS II', 'Telephoto zoom lens for Sony E, constant f/2.8, fast autofocus', 2799.99, 18, 23),
('Nikon Z 70-200mm f/2.8 VR S', 'Telephoto zoom lens for Nikon Z, constant f/2.8, vibration reduction', 2699.99, 18, 26),
('Canon RF 50mm f/1.2L USM', 'Fast prime lens for Canon RF, exceptional bokeh, professional quality', 2299.99, 18, 35),
('Sony FE 50mm f/1.2 GM', 'Fast prime lens for Sony E, exceptional sharpness, beautiful bokeh', 1999.99, 18, 38),
('Nikon Z 50mm f/1.2 S', 'Fast prime lens for Nikon Z, exceptional image quality, professional', 2099.99, 18, 33),
('Canon RF 85mm f/1.2L USM', 'Portrait prime lens for Canon RF, exceptional bokeh, fast aperture', 2699.99, 18, 28),
('Sony FE 85mm f/1.4 GM', 'Portrait prime lens for Sony E, exceptional sharpness, beautiful bokeh', 1799.99, 18, 40),
('Nikon Z 85mm f/1.8 S', 'Portrait prime lens for Nikon Z, excellent sharpness, affordable', 799.99, 18, 55),
('Canon RF 16mm f/2.8 STM', 'Ultra-wide prime lens for Canon RF, compact design, affordable', 299.99, 18, 70),
('Sony FE 16-35mm f/2.8 GM', 'Ultra-wide zoom lens for Sony E, constant f/2.8, professional quality', 2199.99, 18, 30),
('Nikon Z 14-24mm f/2.8 S', 'Ultra-wide zoom lens for Nikon Z, constant f/2.8, excellent sharpness', 1999.99, 18, 32),
('Canon RF 100-500mm f/4.5-7.1L IS USM', 'Super telephoto zoom lens for Canon RF, image stabilization, versatile', 2699.99, 18, 22),
('Sony FE 100-400mm f/4.5-5.6 GM OSS', 'Super telephoto zoom lens for Sony E, image stabilization, sharp', 2499.99, 18, 25),
('Nikon Z 100-400mm f/4.5-5.6 VR S', 'Super telephoto zoom lens for Nikon Z, vibration reduction, sharp', 2699.99, 18, 24),
('Canon RF 35mm f/1.8 IS STM Macro', 'Wide prime lens for Canon RF with macro capability, image stabilization', 499.99, 18, 60),
('Sony FE 35mm f/1.4 GM', 'Wide prime lens for Sony E, exceptional sharpness, beautiful bokeh', 1399.99, 18, 42);

-- Child Category 19: Camera Accessories (subcategory_id: 4, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Manfrotto 055 Carbon Fiber Tripod', 'Professional carbon fiber tripod with 3-way head, supports up to 19.8lbs', 449.99, 19, 50),
('Peak Design Travel Tripod', 'Compact carbon fiber tripod with ball head, 5-section legs, 3.2lbs', 599.99, 19, 45),
('Joby GorillaPod 5K', 'Flexible tripod with ball head, supports up to 11lbs, versatile positioning', 99.99, 19, 80),
('Lowepro ProTactic 450 AW', 'Professional camera backpack with customizable dividers, weather-resistant', 199.99, 19, 70),
('Think Tank Photo Airport Security', 'Rolling camera bag with laptop compartment, TSA-friendly design', 299.99, 19, 55),
('SanDisk Extreme Pro 128GB', 'High-speed SD card with 200MB/s read, 140MB/s write, UHS-II', 49.99, 19, 150),
('Sony Tough 128GB CFexpress', 'Rugged CFexpress card with 1700MB/s read, 1480MB/s write, durable', 199.99, 19, 90),
('Canon LP-E6NH Battery', 'Replacement battery for Canon cameras, 2130mAh capacity, official', 79.99, 19, 120),
('Sony NP-FZ100 Battery', 'Replacement battery for Sony cameras, 2280mAh capacity, official', 78.99, 19, 115),
('Nikon EN-EL15c Battery', 'Replacement battery for Nikon cameras, 2280mAh capacity, official', 69.99, 19, 125),
('Peak Design Capture Clip', 'Camera clip system for attaching camera to backpack strap, quick access', 79.99, 19, 100),
('BlackRapid Sport Breathe', 'Camera strap with quick-release, comfortable padding, secure attachment', 69.99, 19, 110),
('LensCoat Lens Wrap', 'Protective wrap for camera lenses, neoprene material, various sizes', 24.99, 19, 140),
('Hoya Pro1 Digital Filter', 'UV filter for lens protection, multi-coated, reduces flare and ghosting', 29.99, 19, 130),
('B+W XS-Pro Clear Filter', 'Premium UV filter with MRC nano coating, exceptional clarity', 79.99, 19, 95),
('Neewer 660 LED Video Light', 'Bi-color LED light panel with adjustable brightness and color temperature', 49.99, 19, 105),
('Godox V1 Flash', 'Round head flash with magnetic modifiers, TTL support, rechargeable', 199.99, 19, 75),
('Rode VideoMic Pro+', 'Shotgun microphone with Rycote Lyre suspension, 3.5mm output', 329.99, 19, 85),
('DJI RS 3 Gimbal', '3-axis camera gimbal with auto-tracking, 3kg payload, long battery', 549.99, 19, 60),
('SmallRig Camera Cage', 'Modular camera cage with multiple mounting points, aluminum construction', 89.99, 19, 98);

-- Child Category 20: Action Cameras (subcategory_id: 4, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('GoPro Hero 12 Black', 'Latest action camera with 5.3K video, HyperSmooth 6.0, 10m waterproof', 399.99, 20, 80),
('DJI Osmo Action 4', 'Action camera with 4K video, RockSteady stabilization, 18m waterproof', 399.99, 20, 75),
('GoPro Hero 11 Black', 'Action camera with 5.3K video, HyperSmooth 5.0, 10m waterproof', 349.99, 20, 85),
('Insta360 X3', '360-degree action camera with 5.7K video, FlowState stabilization, waterproof', 449.99, 20, 70),
('DJI Osmo Action 3', 'Action camera with 4K video, RockSteady stabilization, 16m waterproof', 329.99, 20, 78),
('GoPro MAX', '360-degree action camera with 5.6K video, 6-directional stabilization', 499.99, 20, 65),
('Insta360 GO 3', 'Ultra-compact action camera with 2.7K video, magnetic mounting, waterproof', 399.99, 20, 72),
('DJI Pocket 2', 'Pocket-sized camera with 4K video, 3-axis gimbal, active tracking', 349.99, 20, 80),
('GoPro Hero 10 Black', 'Action camera with 5.3K video, HyperSmooth 4.0, 10m waterproof', 399.99, 20, 82),
('Akaso Brave 7 LE', 'Budget action camera with 4K video, electronic stabilization, waterproof', 99.99, 20, 100),
('Insta360 ONE RS', 'Modular action camera with 4K video, interchangeable lens modules', 299.99, 20, 88),
('DJI Action 2', 'Modular action camera with 4K video, magnetic mounting, compact design', 399.99, 20, 74),
('GoPro Hero 9 Black', 'Action camera with 5K video, HyperSmooth 3.0, 10m waterproof', 299.99, 20, 90),
('Campark ACT74', 'Budget action camera with 4K video, WiFi, waterproof housing included', 69.99, 20, 110),
('Insta360 ONE X2', '360-degree camera with 5.7K video, FlowState stabilization, waterproof', 429.99, 20, 68),
('GoPro HERO8 Black', 'Action camera with 4K video, HyperSmooth 2.0, 10m waterproof', 249.99, 20, 95),
('DJI Osmo Pocket', 'Pocket-sized camera with 4K video, 3-axis gimbal, compact design', 299.99, 20, 85),
('Akaso V50X', 'Budget action camera with 4K video, electronic stabilization, WiFi', 79.99, 20, 105),
('Insta360 ONE R', 'Modular action camera with 4K video, interchangeable lens modules', 299.99, 20, 86),
('GoPro Hero 7 Black', 'Action camera with 4K video, HyperSmooth, 10m waterproof', 199.99, 20, 98);

-- Child Category 21: Gaming Consoles (subcategory_id: 5, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('PlayStation 5', 'Next-gen gaming console with 4K gaming, ray tracing, 825GB SSD, DualSense controller', 499.99, 21, 60),
('Xbox Series X', 'Next-gen gaming console with 4K gaming, 1TB SSD, backward compatibility, Game Pass', 499.99, 21, 65),
('Nintendo Switch OLED', 'Gaming console with 7" OLED screen, 64GB storage, dock included, handheld/console', 349.99, 21, 80),
('PlayStation 5 Digital Edition', 'Digital-only PS5 with 4K gaming, 825GB SSD, no disc drive', 399.99, 21, 70),
('Xbox Series S', 'Compact next-gen console with 512GB SSD, 1440p gaming, Game Pass', 299.99, 21, 75),
('Nintendo Switch', 'Gaming console with 6.2" screen, 32GB storage, dock included, handheld/console', 299.99, 21, 85),
('Steam Deck 512GB', 'Handheld gaming PC with 7" touchscreen, 512GB storage, Steam OS', 649.99, 21, 50),
('PlayStation 4 Pro', 'Previous gen console with 4K gaming, 1TB storage, HDR support', 399.99, 21, 55),
('Xbox One X', 'Previous gen console with 4K gaming, 1TB storage, enhanced performance', 299.99, 21, 60),
('Nintendo Switch Lite', 'Handheld-only console with 5.5" screen, 32GB storage, compact design', 199.99, 21, 90),
('PlayStation 4 Slim', 'Previous gen console with 1TB storage, HDR support, compact design', 299.99, 21, 65),
('Xbox One S', 'Previous gen console with 1TB storage, 4K video playback, compact design', 249.99, 21, 68),
('Steam Deck 256GB', 'Handheld gaming PC with 7" touchscreen, 256GB storage, Steam OS', 529.99, 21, 58),
('PlayStation Classic', 'Mini retro console with 20 pre-installed games, HDMI output', 99.99, 21, 100),
('SNES Classic Edition', 'Mini retro console with 21 pre-installed games, 2 controllers', 79.99, 21, 110),
('Nintendo 3DS XL', 'Handheld console with 3D display, dual screens, backward compatible', 199.99, 21, 75),
('PlayStation Vita', 'Handheld console with 5" OLED screen, dual analog sticks, portable gaming', 199.99, 21, 70),
('Atari VCS', 'Modern retro console with 800 games, 8GB RAM, 32GB storage, HDMI output', 299.99, 21, 60),
('Evercade VS', 'Retro gaming console with cartridge support, HDMI output, 2 controllers', 99.99, 21, 85),
('Analogue Pocket', 'Premium handheld console with FPGA technology, plays multiple retro systems', 219.99, 21, 45);

