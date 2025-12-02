-- Product Data for Ecommerce Database
-- This file contains products for child categories 2-11 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 2-11
-- ============================================

-- Child Category 2: iPhone & iOS Devices (subcategory_id: 1, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('iPhone 15 Pro Max', 'Latest flagship iPhone with titanium design, A17 Pro chip, 256GB storage, 6.7" Super Retina XDR display', 1199.99, 2, 45, NULL, NULL, NULL, NULL, FALSE),
('iPhone 15 Pro', 'Premium iPhone with titanium build, A17 Pro chip, 128GB storage, 6.1" Super Retina XDR display', 999.99, 2, 50, NULL, NULL, NULL, NULL, FALSE),
('iPhone 15', 'Advanced iPhone with A16 Bionic chip, 128GB storage, 6.1" Super Retina XDR display, Dynamic Island', 799.99, 2, 60, NULL, NULL, NULL, NULL, FALSE),
('iPhone 15 Plus', 'Large-screen iPhone with A16 Bionic chip, 128GB storage, 6.7" Super Retina XDR display', 899.99, 2, 55, NULL, NULL, NULL, NULL, FALSE),
('iPhone 14 Pro Max', 'Previous generation flagship with A16 Bionic, 256GB storage, 6.7" ProMotion display', 1099.99, 2, 40, NULL, NULL, NULL, NULL, FALSE),
('iPhone 14 Pro', 'Previous generation premium iPhone with A16 Bionic, 128GB storage, 6.1" ProMotion display', 899.99, 2, 45, NULL, NULL, NULL, NULL, FALSE),
('iPhone 14', 'Popular iPhone model with A15 Bionic chip, 128GB storage, 6.1" Super Retina XDR display', 699.99, 2, 65, NULL, NULL, NULL, NULL, FALSE),
('iPhone 13', 'Reliable iPhone with A15 Bionic chip, 128GB storage, 6.1" Super Retina XDR display', 599.99, 2, 70, NULL, NULL, NULL, NULL, FALSE),
('iPhone SE (3rd Gen)', 'Compact iPhone with A15 Bionic chip, 64GB storage, 4.7" Retina HD display', 429.99, 2, 50, NULL, NULL, NULL, NULL, FALSE),
('iPad Pro 12.9"', 'Professional tablet with M2 chip, 256GB storage, 12.9" Liquid Retina XDR display', 1099.99, 2, 30, NULL, NULL, NULL, NULL, FALSE),
('iPad Pro 11"', 'Powerful tablet with M2 chip, 128GB storage, 11" Liquid Retina display', 799.99, 2, 35, NULL, NULL, NULL, NULL, FALSE),
('iPad Air', 'Versatile tablet with M1 chip, 64GB storage, 10.9" Liquid Retina display', 599.99, 2, 40, NULL, NULL, NULL, NULL, FALSE),
('iPad (10th Gen)', 'Entry-level iPad with A14 Bionic chip, 64GB storage, 10.9" Liquid Retina display', 449.99, 2, 55, NULL, NULL, NULL, NULL, FALSE),
('iPad mini', 'Compact tablet with A15 Bionic chip, 64GB storage, 8.3" Liquid Retina display', 499.99, 2, 45, NULL, NULL, NULL, NULL, FALSE),
('Apple Watch Series 9', 'Latest smartwatch with S9 SiP chip, 45mm GPS, aluminum case', 429.99, 2, 50, NULL, NULL, NULL, NULL, FALSE),
('Apple Watch Ultra 2', 'Premium rugged smartwatch with S9 SiP chip, 49mm titanium case', 799.99, 2, 25, NULL, NULL, NULL, NULL, FALSE),
('Apple Watch SE', 'Affordable smartwatch with S8 SiP chip, 44mm GPS, aluminum case', 279.99, 2, 60, NULL, NULL, NULL, NULL, FALSE),
('AirPods Pro (2nd Gen)', 'Premium wireless earbuds with Active Noise Cancellation, USB-C charging case', 249.99, 2, 70, NULL, NULL, NULL, NULL, FALSE),
('AirPods (3rd Gen)', 'Wireless earbuds with spatial audio, MagSafe charging case', 179.99, 2, 75, NULL, NULL, NULL, NULL, FALSE),
('AirPods Max', 'Premium over-ear headphones with Active Noise Cancellation, spatial audio', 549.99, 2, 30, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 3: Phone Cases & Protection (subcategory_id: 1, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('OtterBox Defender Series Case', 'Rugged protective case with multi-layer defense, port covers, belt clip holster', 49.99, 3, 80, NULL, NULL, NULL, NULL, FALSE),
('Spigen Tough Armor Case', 'Dual-layer protection case with kickstand, wireless charging compatible', 34.99, 3, 90, NULL, NULL, NULL, NULL, FALSE),
('Apple Silicone Case', 'Official Apple silicone case with microfiber lining, precise fit', 49.99, 3, 100, NULL, NULL, NULL, NULL, FALSE),
('ESR HaloLock Clear Case', 'MagSafe compatible clear case with magnetic ring, yellowing resistant', 19.99, 3, 120, NULL, NULL, NULL, NULL, FALSE),
('Casetify Impact Case', 'Customizable protective case with shock-absorbing technology, various designs', 45.99, 3, 85, NULL, NULL, NULL, NULL, FALSE),
('Mous Limitless 5.0 Case', 'Premium protective case with AiroShock technology, MagSafe compatible', 59.99, 3, 70, NULL, NULL, NULL, NULL, FALSE),
('Rhinoshield SolidSuit Case', 'Modular protective case with customizable buttons, 3m drop protection', 39.99, 3, 75, NULL, NULL, NULL, NULL, FALSE),
('UAG Plasma Series Case', 'Military-grade protection case with impact-resistant design, raised edges', 44.99, 3, 80, NULL, NULL, NULL, NULL, FALSE),
('ZAGG InvisibleShield Glass Elite', 'Premium tempered glass screen protector with anti-glare coating', 39.99, 3, 150, NULL, NULL, NULL, NULL, FALSE),
('Spigen NeoFlex Screen Protector', 'Flexible film screen protector with bubble-free installation kit', 12.99, 3, 200, NULL, NULL, NULL, NULL, FALSE),
('ESR Tempered Glass Screen Protector', '9H hardness tempered glass with easy installation frame, 2-pack', 9.99, 3, 180, NULL, NULL, NULL, NULL, FALSE),
('ZAGG InvisibleShield Privacy', 'Privacy screen protector that blocks side-angle viewing, tempered glass', 49.99, 3, 100, NULL, NULL, NULL, NULL, FALSE),
('Pela Eco-Friendly Case', 'Biodegradable phone case made from plant-based materials, compostable', 34.99, 3, 60, NULL, NULL, NULL, NULL, FALSE),
('Moment Photo Case', 'Protective case with lens mount system for professional photography', 39.99, 3, 50, NULL, NULL, NULL, NULL, FALSE),
('LifeProof FRE Case', 'Waterproof case with 2m water protection, drop-proof, dust-proof', 79.99, 3, 40, NULL, NULL, NULL, NULL, FALSE),
('Tech21 Evo Check Case', 'Impact-resistant case with FlexShock technology, antimicrobial coating', 34.99, 3, 85, NULL, NULL, NULL, NULL, FALSE),
('Incipio DualPro Case', 'Dual-layer protection case with soft inner layer and hard outer shell', 24.99, 3, 95, NULL, NULL, NULL, NULL, FALSE),
('Totallee Thin Case', 'Ultra-thin minimalist case with precise cutouts, 0.02" thickness', 29.99, 3, 70, NULL, NULL, NULL, NULL, FALSE),
('Pitaka MagEZ Case', 'Aramid fiber case with MagSafe compatibility, ultra-lightweight', 59.99, 3, 55, NULL, NULL, NULL, NULL, FALSE),
('dbrand Grip Case', 'Customizable case with grippy texture, precise fit, various skin options', 34.99, 3, 65, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 4: Chargers & Cables (subcategory_id: 1, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Apple MagSafe Charger', 'Official Apple wireless charger with magnetic alignment, 15W fast charging', 39.99, 4, 100, NULL, NULL, NULL, NULL, FALSE),
('Anker PowerWave Stand', 'Wireless charging stand with 10W fast charging, adjustable viewing angle', 29.99, 4, 90, NULL, NULL, NULL, NULL, FALSE),
('Belkin BoostCharge Pro', 'MagSafe compatible wireless charger with 15W fast charging, stand design', 59.99, 4, 75, NULL, NULL, NULL, NULL, FALSE),
('Anker 313 USB-C Cable', '6ft USB-C to USB-C cable with 100W power delivery, data transfer', 12.99, 4, 150, NULL, NULL, NULL, NULL, FALSE),
('Apple USB-C to Lightning Cable', 'Official 1m USB-C to Lightning cable with fast charging support', 19.99, 4, 120, NULL, NULL, NULL, NULL, FALSE),
('Anker PowerLine III USB-C', 'Durable 6ft USB-C cable with 100W power delivery, reinforced connectors', 15.99, 4, 140, NULL, NULL, NULL, NULL, FALSE),
('UGREEN USB-C Cable 100W', '6.6ft braided USB-C cable with 100W power delivery, fast data transfer', 13.99, 4, 130, NULL, NULL, NULL, NULL, FALSE),
('Samsung 25W Super Fast Charger', 'USB-C wall charger with 25W fast charging, compact design', 19.99, 4, 110, NULL, NULL, NULL, NULL, FALSE),
('Anker 735 Charger GaNPrime', '65W GaN wall charger with 3 ports, compact design, fast charging', 49.99, 4, 85, NULL, NULL, NULL, NULL, FALSE),
('Spigen ArcField MagSafe Stand', 'Wireless charging stand with MagSafe compatibility, adjustable angle', 34.99, 4, 80, NULL, NULL, NULL, NULL, FALSE),
('ESR HaloLock Wireless Charger', 'MagSafe compatible wireless charger with 15W fast charging, LED indicator', 24.99, 4, 95, NULL, NULL, NULL, NULL, FALSE),
('Anker PowerCore 10000', 'Portable power bank with 10000mAh capacity, USB-C and USB-A ports', 29.99, 4, 100, NULL, NULL, NULL, NULL, FALSE),
('Mophie Powerstation Plus XL', 'Wireless power bank with 10000mAh capacity, built-in stand', 79.99, 4, 60, NULL, NULL, NULL, NULL, FALSE),
('Anker 511 Charger PowerCore', 'Compact 5000mAh power bank with USB-C port, pocket-friendly design', 19.99, 4, 120, NULL, NULL, NULL, NULL, FALSE),
('Belkin USB-C Cable 100W', '6ft USB-C cable with 100W power delivery, braided design, lifetime warranty', 24.99, 4, 105, NULL, NULL, NULL, NULL, FALSE),
('UGREEN 100W USB-C Charger', 'GaN wall charger with 4 ports, 100W total output, compact design', 59.99, 4, 70, NULL, NULL, NULL, NULL, FALSE),
('Anker 521 Power Bank', '20000mAh power bank with 20W USB-C charging, Power Delivery support', 39.99, 4, 90, NULL, NULL, NULL, NULL, FALSE),
('Spigen ArcField MagSafe Car Mount', 'Car mount with MagSafe wireless charging, 15W fast charging', 49.99, 4, 75, NULL, NULL, NULL, NULL, FALSE),
('ESR HaloLock Car Mount', 'MagSafe car mount with wireless charging, one-hand operation', 34.99, 4, 85, NULL, NULL, NULL, NULL, FALSE),
('Anker 323 USB-C Hub', '7-in-1 USB-C hub with HDMI, USB-A ports, SD card reader, 100W pass-through', 49.99, 4, 65, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 5: Phone Accessories (subcategory_id: 1, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('PopSocket PopGrip', 'Adjustable phone grip and stand with swappable top, various designs', 14.99, 5, 200, NULL, NULL, NULL, NULL, FALSE),
('ESR HaloLock Kickstand', 'MagSafe compatible kickstand with 360-degree rotation, magnetic attachment', 19.99, 5, 150, NULL, NULL, NULL, NULL, FALSE),
('Anker Soundcore Liberty 4', 'True wireless earbuds with noise cancellation, 9-hour battery life', 99.99, 5, 80, NULL, NULL, NULL, NULL, FALSE),
('Spigen ArcField Phone Stand', 'Adjustable phone stand with MagSafe compatibility, multiple angles', 24.99, 5, 120, NULL, NULL, NULL, NULL, FALSE),
('Belkin MagSafe Car Vent Mount', 'Car vent mount with MagSafe technology, one-hand operation', 34.99, 5, 100, NULL, NULL, NULL, NULL, FALSE),
('Moment Tele 58mm Lens', 'Professional telephoto lens attachment for iPhone photography', 99.99, 5, 40, NULL, NULL, NULL, NULL, FALSE),
('Anker 521 Magnetic Battery', '5000mAh MagSafe power bank with wireless charging, slim design', 49.99, 5, 90, NULL, NULL, NULL, NULL, FALSE),
('ESR HaloLock Wallet', 'MagSafe compatible wallet with card slots, RFID blocking', 19.99, 5, 130, NULL, NULL, NULL, NULL, FALSE),
('Spigen ArcField Desk Stand', 'Desktop stand with MagSafe charging, adjustable viewing angle', 39.99, 5, 85, NULL, NULL, NULL, NULL, FALSE),
('PopSocket Phone Grip Ring', 'Removable phone grip ring with adhesive backing, various colors', 9.99, 5, 250, NULL, NULL, NULL, NULL, FALSE),
('Anker Soundcore Life Q30', 'Over-ear headphones with active noise cancellation, 40-hour battery', 79.99, 5, 70, NULL, NULL, NULL, NULL, FALSE),
('Belkin MagSafe Mount', 'Wall mount with MagSafe technology for hands-free viewing', 29.99, 5, 95, NULL, NULL, NULL, NULL, FALSE),
('ESR HaloLock Stand', 'Adjustable stand with MagSafe charging, 360-degree rotation', 34.99, 5, 110, NULL, NULL, NULL, NULL, FALSE),
('Moment Wide 18mm Lens', 'Professional wide-angle lens attachment for iPhone cameras', 99.99, 5, 45, NULL, NULL, NULL, NULL, FALSE),
('Anker 313 USB-C Hub', '7-in-1 USB-C hub with HDMI, USB ports, SD card reader', 39.99, 5, 75, NULL, NULL, NULL, NULL, FALSE),
('Spigen ArcField Car Mount', 'Car dashboard mount with MagSafe technology, strong adhesive', 44.99, 5, 80, NULL, NULL, NULL, NULL, FALSE),
('PopSocket PopWallet+', 'Phone wallet with PopGrip technology, card storage, MagSafe compatible', 24.99, 5, 140, NULL, NULL, NULL, NULL, FALSE),
('ESR HaloLock Grip Ring', 'Magnetic grip ring with MagSafe compatibility, 360-degree rotation', 12.99, 5, 160, NULL, NULL, NULL, NULL, FALSE),
('Anker Soundcore Life P3', 'True wireless earbuds with noise cancellation, 35-hour battery', 79.99, 5, 85, NULL, NULL, NULL, NULL, FALSE),
('Belkin MagSafe 3-in-1 Stand', 'Wireless charging stand for iPhone, AirPods, and Apple Watch', 149.99, 5, 50, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 6: Gaming Laptops (subcategory_id: 2, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('ASUS ROG Strix G18', 'Gaming laptop with Intel i9-13980HX, RTX 4080, 32GB RAM, 1TB SSD, 18" 165Hz display', 2499.99, 6, 25, NULL, NULL, NULL, NULL, FALSE),
('MSI Raider GE78 HX', 'Premium gaming laptop with Intel i9-13980HX, RTX 4090, 64GB RAM, 2TB SSD, 17.3" 240Hz', 3499.99, 6, 15, NULL, NULL, NULL, NULL, FALSE),
('Alienware m18 R2', 'High-end gaming laptop with AMD Ryzen 9 7945HX, RTX 4090, 32GB RAM, 1TB SSD, 18" QHD', 3299.99, 6, 20, NULL, NULL, NULL, NULL, FALSE),
('Razer Blade 18', 'Premium gaming laptop with Intel i9-13950HX, RTX 4090, 32GB RAM, 2TB SSD, 18" 4K', 4299.99, 6, 10, NULL, NULL, NULL, NULL, FALSE),
('Lenovo Legion Pro 7i', 'Gaming laptop with Intel i9-13900HX, RTX 4080, 32GB RAM, 1TB SSD, 16" 240Hz', 2299.99, 6, 30, NULL, NULL, NULL, NULL, FALSE),
('ASUS ROG Zephyrus M16', 'Slim gaming laptop with Intel i9-13900H, RTX 4070, 32GB RAM, 1TB SSD, 16" 165Hz', 1999.99, 6, 35, NULL, NULL, NULL, NULL, FALSE),
('MSI Stealth 16 Studio', 'Creator gaming laptop with Intel i9-13900H, RTX 4070, 32GB RAM, 1TB SSD, 16" QHD', 1899.99, 6, 40, NULL, NULL, NULL, NULL, FALSE),
('HP Omen 17', 'Gaming laptop with Intel i7-13700HX, RTX 4060, 16GB RAM, 512GB SSD, 17.3" 144Hz', 1499.99, 6, 45, NULL, NULL, NULL, NULL, FALSE),
('Acer Predator Helios 16', 'Gaming laptop with Intel i7-13700HX, RTX 4070, 16GB RAM, 1TB SSD, 16" 165Hz', 1699.99, 6, 38, NULL, NULL, NULL, NULL, FALSE),
('ASUS TUF Gaming A17', 'Budget gaming laptop with AMD Ryzen 7 7735HS, RTX 4060, 16GB RAM, 512GB SSD, 17.3"', 1199.99, 6, 50, NULL, NULL, NULL, NULL, FALSE),
('MSI Katana 15', 'Affordable gaming laptop with Intel i7-13620H, RTX 4060, 16GB RAM, 512GB SSD, 15.6"', 1099.99, 6, 55, NULL, NULL, NULL, NULL, FALSE),
('Lenovo Legion 5 Pro', 'Mid-range gaming laptop with AMD Ryzen 7 7745HX, RTX 4070, 16GB RAM, 1TB SSD, 16"', 1599.99, 6, 42, NULL, NULL, NULL, NULL, FALSE),
('HP Victus 16', 'Entry-level gaming laptop with AMD Ryzen 5 7535HS, RTX 4050, 16GB RAM, 512GB SSD, 16"', 899.99, 6, 60, NULL, NULL, NULL, NULL, FALSE),
('Acer Nitro 5', 'Budget gaming laptop with Intel i5-12500H, RTX 3050, 16GB RAM, 512GB SSD, 15.6"', 799.99, 6, 65, NULL, NULL, NULL, NULL, FALSE),
('ASUS ROG Flow X16', '2-in-1 gaming laptop with AMD Ryzen 9 7940HS, RTX 4060, 32GB RAM, 1TB SSD, 16" touch', 2199.99, 6, 28, NULL, NULL, NULL, NULL, FALSE),
('Razer Blade 16', 'Compact gaming laptop with Intel i9-13950HX, RTX 4090, 32GB RAM, 2TB SSD, 16" 240Hz', 3999.99, 6, 12, NULL, NULL, NULL, NULL, FALSE),
('MSI Creator Z17', 'Creator gaming laptop with Intel i9-12900H, RTX 3080 Ti, 32GB RAM, 2TB SSD, 17" 4K', 2999.99, 6, 18, NULL, NULL, NULL, NULL, FALSE),
('Alienware x16', 'Slim gaming laptop with Intel i9-13900HK, RTX 4080, 32GB RAM, 1TB SSD, 16" QHD+', 2799.99, 6, 22, NULL, NULL, NULL, NULL, FALSE),
('ASUS ROG Strix Scar 16', 'Esports gaming laptop with Intel i9-13980HX, RTX 4090, 32GB RAM, 2TB SSD, 16" 240Hz', 3199.99, 6, 15, NULL, NULL, NULL, NULL, FALSE),
('Lenovo Legion Slim 7', 'Thin gaming laptop with AMD Ryzen 9 7940HS, RTX 4070, 32GB RAM, 1TB SSD, 16"', 1899.99, 6, 33, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 7: Business Laptops (subcategory_id: 2, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Dell XPS 15', 'Premium business laptop with Intel i7-13700H, 32GB RAM, 1TB SSD, 15.6" 4K OLED display', 1999.99, 7, 40, NULL, NULL, NULL, NULL, FALSE),
('MacBook Pro 16" M3 Max', 'Professional laptop with M3 Max chip, 36GB RAM, 1TB SSD, 16.2" Liquid Retina XDR', 3499.99, 7, 25, NULL, NULL, NULL, NULL, FALSE),
('Lenovo ThinkPad X1 Carbon', 'Ultra-light business laptop with Intel i7-1355U, 16GB RAM, 512GB SSD, 14" 2.8K', 1699.99, 7, 45, NULL, NULL, NULL, NULL, FALSE),
('HP EliteBook 840 G10', 'Business laptop with Intel i7-1355U, 16GB RAM, 512GB SSD, 14" FHD, MIL-STD tested', 1299.99, 7, 50, NULL, NULL, NULL, NULL, FALSE),
('Microsoft Surface Laptop 5', 'Premium laptop with Intel i7-1255U, 16GB RAM, 512GB SSD, 15" PixelSense touchscreen', 1499.99, 7, 42, NULL, NULL, NULL, NULL, FALSE),
('Dell Latitude 9440', 'Business laptop with Intel i7-1355U, 16GB RAM, 512GB SSD, 14" QHD+ touchscreen', 1599.99, 7, 38, NULL, NULL, NULL, NULL, FALSE),
('MacBook Air 15" M3', 'Large-screen laptop with M3 chip, 16GB RAM, 512GB SSD, 15.3" Liquid Retina display', 1799.99, 7, 48, NULL, NULL, NULL, NULL, FALSE),
('Lenovo ThinkPad P16', 'Mobile workstation with Intel i7-13700HX, 32GB RAM, 1TB SSD, 16" 4K display', 2499.99, 7, 30, NULL, NULL, NULL, NULL, FALSE),
('HP ZBook Studio G10', 'Mobile workstation with Intel i7-13700H, 32GB RAM, 1TB SSD, 16" 4K DreamColor', 2299.99, 7, 32, NULL, NULL, NULL, NULL, FALSE),
('ASUS ProArt StudioBook 16', 'Creator laptop with Intel i9-13900H, 32GB RAM, 1TB SSD, 16" 4K OLED', 2699.99, 7, 28, NULL, NULL, NULL, NULL, FALSE),
('Dell Precision 5680', 'Mobile workstation with Intel i7-13700H, 32GB RAM, 1TB SSD, 16" 4K touchscreen', 2199.99, 7, 35, NULL, NULL, NULL, NULL, FALSE),
('MacBook Pro 14" M3 Pro', 'Professional laptop with M3 Pro chip, 18GB RAM, 512GB SSD, 14.2" Liquid Retina XDR', 1999.99, 7, 40, NULL, NULL, NULL, NULL, FALSE),
('Lenovo ThinkPad T14s', 'Thin business laptop with AMD Ryzen 7 PRO 7840U, 32GB RAM, 1TB SSD, 14" FHD', 1499.99, 7, 44, NULL, NULL, NULL, NULL, FALSE),
('HP ProBook 450 G10', 'Business laptop with Intel i5-1335U, 16GB RAM, 512GB SSD, 15.6" FHD', 899.99, 7, 55, NULL, NULL, NULL, NULL, FALSE),
('Dell Inspiron 16 Plus', 'Business laptop with Intel i7-13620H, 16GB RAM, 512GB SSD, 16" 3K display', 1099.99, 7, 47, NULL, NULL, NULL, NULL, FALSE),
('Microsoft Surface Pro 9', '2-in-1 business tablet with Intel i7-1255U, 16GB RAM, 256GB SSD, 13" PixelSense', 1299.99, 7, 43, NULL, NULL, NULL, NULL, FALSE),
('Lenovo Yoga 9i', 'Premium 2-in-1 laptop with Intel i7-1360P, 16GB RAM, 512GB SSD, 14" 4K OLED touch', 1699.99, 7, 39, NULL, NULL, NULL, NULL, FALSE),
('HP Spectre x360 14', 'Convertible laptop with Intel i7-1355U, 16GB RAM, 512GB SSD, 14" 2.8K OLED touch', 1499.99, 7, 41, NULL, NULL, NULL, NULL, FALSE),
('ASUS ZenBook Pro 16X', 'Creator laptop with Intel i9-13905H, 32GB RAM, 1TB SSD, 16" 4K OLED touchscreen', 2499.99, 7, 26, NULL, NULL, NULL, NULL, FALSE),
('Dell XPS 13 Plus', 'Ultra-compact laptop with Intel i7-1360P, 16GB RAM, 512GB SSD, 13.4" 4K+ touch', 1799.99, 7, 37, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 8: Ultrabooks (subcategory_id: 2, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('MacBook Air 13" M3', 'Ultra-thin laptop with M3 chip, 8GB RAM, 256GB SSD, 13.6" Liquid Retina display', 1099.99, 8, 60, NULL, NULL, NULL, NULL, FALSE),
('ASUS ZenBook 14 OLED', 'Slim laptop with AMD Ryzen 7 7730U, 16GB RAM, 512GB SSD, 14" 2.8K OLED display', 999.99, 8, 55, NULL, NULL, NULL, NULL, FALSE),
('LG Gram 17', 'Ultra-light laptop with Intel i7-1360P, 16GB RAM, 1TB SSD, 17" WQXGA display, 1.35kg', 1499.99, 8, 45, NULL, NULL, NULL, NULL, FALSE),
('Dell XPS 13', 'Compact laptop with Intel i7-1350U, 16GB RAM, 512GB SSD, 13.4" FHD+ display', 1299.99, 8, 50, NULL, NULL, NULL, NULL, FALSE),
('HP Pavilion Plus 14', 'Slim laptop with Intel i5-1335U, 16GB RAM, 512GB SSD, 14" 2.8K OLED display', 899.99, 8, 58, NULL, NULL, NULL, NULL, FALSE),
('Lenovo Yoga 7i', '2-in-1 ultrabook with Intel i7-1355U, 16GB RAM, 512GB SSD, 14" 2.8K touchscreen', 1199.99, 8, 52, NULL, NULL, NULL, NULL, FALSE),
('Microsoft Surface Laptop Studio 2', 'Convertible laptop with Intel i7-13700H, 32GB RAM, 1TB SSD, 14.4" touchscreen', 2199.99, 8, 35, NULL, NULL, NULL, NULL, FALSE),
('ASUS VivoBook S 15', 'Lightweight laptop with Intel i5-1335U, 16GB RAM, 512GB SSD, 15.6" FHD display', 749.99, 8, 65, NULL, NULL, NULL, NULL, FALSE),
('Acer Swift 5', 'Ultra-thin laptop with Intel i7-1355U, 16GB RAM, 512GB SSD, 14" 2.8K touchscreen', 999.99, 8, 57, NULL, NULL, NULL, NULL, FALSE),
('Samsung Galaxy Book3 360', '2-in-1 laptop with Intel i7-1360P, 16GB RAM, 512GB SSD, 15.6" AMOLED touch', 1299.99, 8, 48, NULL, NULL, NULL, NULL, FALSE),
('LG Gram 16', 'Lightweight laptop with Intel i7-1360P, 16GB RAM, 1TB SSD, 16" WQXGA display, 1.19kg', 1399.99, 8, 46, NULL, NULL, NULL, NULL, FALSE),
('HP Envy x360 15', 'Convertible laptop with AMD Ryzen 7 7730U, 16GB RAM, 512GB SSD, 15.6" FHD touch', 1099.99, 8, 53, NULL, NULL, NULL, NULL, FALSE),
('Lenovo IdeaPad Slim 5', 'Slim laptop with AMD Ryzen 7 7730U, 16GB RAM, 512GB SSD, 14" FHD display', 699.99, 8, 62, NULL, NULL, NULL, NULL, FALSE),
('ASUS ZenBook S 13', 'Ultra-compact laptop with AMD Ryzen 7 6800U, 16GB RAM, 512GB SSD, 13.3" OLED', 1199.99, 8, 49, NULL, NULL, NULL, NULL, FALSE),
('Dell Inspiron 14 Plus', 'Slim laptop with Intel i7-13620H, 16GB RAM, 512GB SSD, 14" 2.2K display', 999.99, 8, 56, NULL, NULL, NULL, NULL, FALSE),
('Acer Swift 3', 'Budget ultrabook with AMD Ryzen 5 7530U, 8GB RAM, 256GB SSD, 14" FHD display', 599.99, 8, 68, NULL, NULL, NULL, NULL, FALSE),
('Microsoft Surface Laptop Go 3', 'Compact laptop with Intel i5-1235U, 8GB RAM, 256GB SSD, 12.4" PixelSense', 799.99, 8, 64, NULL, NULL, NULL, NULL, FALSE),
('HP Spectre x360 13.5', 'Premium 2-in-1 laptop with Intel i7-1355U, 16GB RAM, 512GB SSD, 13.5" 3K2K touch', 1399.99, 8, 44, NULL, NULL, NULL, NULL, FALSE),
('Lenovo ThinkPad X1 Nano', 'Ultra-light laptop with Intel i7-1360P, 16GB RAM, 512GB SSD, 13" 2K display, 970g', 1699.99, 8, 40, NULL, NULL, NULL, NULL, FALSE),
('ASUS ExpertBook B9', 'Business ultrabook with Intel i7-1355U, 16GB RAM, 512GB SSD, 14" FHD, 880g', 1499.99, 8, 42, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 9: Desktop Computers (subcategory_id: 2, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Apple iMac 24" M3', 'All-in-one desktop with M3 chip, 8GB RAM, 256GB SSD, 24" 4.5K Retina display', 1299.99, 9, 40, NULL, NULL, NULL, NULL, FALSE),
('Dell XPS Desktop', 'Desktop PC with Intel i7-13700, 32GB RAM, 1TB SSD, RTX 4070, Windows 11', 1899.99, 9, 35, NULL, NULL, NULL, NULL, FALSE),
('HP Pavilion Desktop', 'Desktop PC with Intel i5-13400, 16GB RAM, 512GB SSD, integrated graphics', 699.99, 9, 55, NULL, NULL, NULL, NULL, FALSE),
('Lenovo ThinkCentre M90q', 'Compact desktop with Intel i7-13700T, 16GB RAM, 512GB SSD, Windows 11 Pro', 999.99, 9, 48, NULL, NULL, NULL, NULL, FALSE),
('ASUS ROG Strix G16CH', 'Gaming desktop with Intel i7-13700F, 16GB RAM, 1TB SSD, RTX 4060 Ti', 1499.99, 9, 42, NULL, NULL, NULL, NULL, FALSE),
('Apple Mac Studio M2 Max', 'Professional desktop with M2 Max chip, 32GB RAM, 1TB SSD, compact design', 1999.99, 9, 30, NULL, NULL, NULL, NULL, FALSE),
('Dell OptiPlex 7010', 'Business desktop with Intel i5-13500, 16GB RAM, 256GB SSD, Windows 11 Pro', 899.99, 9, 50, NULL, NULL, NULL, NULL, FALSE),
('HP EliteDesk 800 G9', 'Business desktop with Intel i7-13700, 32GB RAM, 512GB SSD, Windows 11 Pro', 1299.99, 9, 45, NULL, NULL, NULL, NULL, FALSE),
('ASUS ExpertCenter D7', 'Workstation desktop with Intel i7-13700, 32GB RAM, 1TB SSD, RTX 3060', 1599.99, 9, 38, NULL, NULL, NULL, NULL, FALSE),
('Lenovo IdeaCentre AIO 5i', 'All-in-one desktop with Intel i5-13420H, 16GB RAM, 512GB SSD, 23.8" FHD', 999.99, 9, 47, NULL, NULL, NULL, NULL, FALSE),
('Microsoft Surface Studio 2+', 'All-in-one desktop with Intel i7-11370H, 32GB RAM, 1TB SSD, 28" touchscreen', 4299.99, 9, 15, NULL, NULL, NULL, NULL, FALSE),
('Dell Inspiron 27 All-in-One', 'All-in-one PC with Intel i5-1335U, 16GB RAM, 512GB SSD, 27" FHD touchscreen', 1099.99, 9, 44, NULL, NULL, NULL, NULL, FALSE),
('HP Pavilion All-in-One 24', 'All-in-one PC with AMD Ryzen 5 5625U, 16GB RAM, 512GB SSD, 23.8" FHD', 799.99, 9, 52, NULL, NULL, NULL, NULL, FALSE),
('ASUS VivoPC X420', 'Compact desktop with Intel i5-12400, 8GB RAM, 256GB SSD, Windows 11', 599.99, 9, 58, NULL, NULL, NULL, NULL, FALSE),
('Apple Mac mini M2 Pro', 'Compact desktop with M2 Pro chip, 16GB RAM, 512GB SSD, professional performance', 1299.99, 9, 43, NULL, NULL, NULL, NULL, FALSE),
('Dell Precision 3660 Tower', 'Workstation desktop with Intel i7-13700, 32GB RAM, 1TB SSD, RTX 4060', 1799.99, 9, 33, NULL, NULL, NULL, NULL, FALSE),
('HP Z2 Tower G9', 'Workstation desktop with Intel i7-13700, 32GB RAM, 1TB SSD, NVIDIA T1000', 1699.99, 9, 36, NULL, NULL, NULL, NULL, FALSE),
('Lenovo ThinkStation P3', 'Workstation desktop with Intel i7-13700, 32GB RAM, 1TB SSD, RTX 4060', 1899.99, 9, 31, NULL, NULL, NULL, NULL, FALSE),
('ASUS ProArt Station PD5', 'Creator desktop with Intel i7-13700, 64GB RAM, 2TB SSD, RTX 4070', 2499.99, 9, 25, NULL, NULL, NULL, NULL, FALSE),
('Corsair Vengeance i7400', 'Gaming desktop with Intel i7-13700K, 32GB RAM, 1TB SSD, RTX 4070 Ti', 2199.99, 9, 28, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 10: Computer Accessories (subcategory_id: 2, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Logitech MX Master 3S', 'Premium wireless mouse with precision tracking, ergonomic design, multi-device', 99.99, 10, 120, NULL, NULL, NULL, NULL, FALSE),
('Keychron K8 Pro', 'Mechanical keyboard with Gateron switches, RGB backlight, wireless connectivity', 119.99, 10, 100, NULL, NULL, NULL, NULL, FALSE),
('Dell UltraSharp U2723DE', '27" 4K monitor with USB-C, IPS panel, 60Hz refresh rate, color-accurate', 449.99, 10, 80, NULL, NULL, NULL, NULL, FALSE),
('Logitech C920 HD Pro Webcam', '1080p webcam with autofocus, dual microphones, privacy shutter', 79.99, 10, 150, NULL, NULL, NULL, NULL, FALSE),
('Samsung Odyssey G7', '32" curved gaming monitor with 240Hz refresh rate, QHD resolution, HDR', 599.99, 10, 60, NULL, NULL, NULL, NULL, FALSE),
('Corsair K70 RGB TKL', 'Tenkeyless mechanical keyboard with Cherry MX switches, RGB lighting', 149.99, 10, 90, NULL, NULL, NULL, NULL, FALSE),
('Razer DeathAdder V3', 'Gaming mouse with 30K DPI sensor, 90-hour battery, lightweight design', 69.99, 10, 110, NULL, NULL, NULL, NULL, FALSE),
('LG 27GL850-B', '27" gaming monitor with 144Hz refresh rate, QHD IPS, G-Sync compatible', 399.99, 10, 85, NULL, NULL, NULL, NULL, FALSE),
('Blue Yeti USB Microphone', 'Professional USB microphone with multiple pickup patterns, studio quality', 129.99, 10, 95, NULL, NULL, NULL, NULL, FALSE),
('HyperX Cloud Alpha', 'Gaming headset with dual chamber drivers, memory foam ear cushions', 99.99, 10, 105, NULL, NULL, NULL, NULL, FALSE),
('Elgato Stream Deck MK.2', '15-key stream controller with LCD keys, customizable shortcuts', 149.99, 10, 70, NULL, NULL, NULL, NULL, FALSE),
('Wacom Intuos Pro', 'Professional drawing tablet with pressure sensitivity, wireless connectivity', 349.99, 10, 55, NULL, NULL, NULL, NULL, FALSE),
('Anker USB-C Hub', '7-in-1 USB-C hub with HDMI, USB-A ports, SD card reader, 100W pass-through', 49.99, 10, 130, NULL, NULL, NULL, NULL, FALSE),
('SteelSeries Apex Pro', 'Mechanical keyboard with adjustable actuation, OLED display, RGB', 199.99, 10, 75, NULL, NULL, NULL, NULL, FALSE),
('BenQ PD2700U', '27" 4K monitor for content creation, color-accurate, USB-C connectivity', 499.99, 10, 65, NULL, NULL, NULL, NULL, FALSE),
('Logitech G Pro X Superlight', 'Ultra-lightweight gaming mouse, 25K sensor, 60-hour battery', 159.99, 10, 88, NULL, NULL, NULL, NULL, FALSE),
('Audio-Technica ATH-M50x', 'Professional studio headphones with exceptional sound quality, foldable', 149.99, 10, 92, NULL, NULL, NULL, NULL, FALSE),
('Ergotron LX Desk Mount', 'Monitor arm with full motion, supports up to 34" monitors, cable management', 199.99, 10, 68, NULL, NULL, NULL, NULL, FALSE),
('Corsair MM700 RGB', 'Extended gaming mouse pad with RGB lighting, 930mm x 400mm', 49.99, 10, 140, NULL, NULL, NULL, NULL, FALSE),
('Focusrite Scarlett Solo', 'USB audio interface with studio-quality preamps, XLR input, 24-bit/192kHz', 119.99, 10, 82, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 11: Wireless Headphones (subcategory_id: 3, category_id: 1)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Sony WH-1000XM5', 'Premium noise-canceling headphones with 30-hour battery, LDAC support, quick charge', 399.99, 11, 70, NULL, NULL, NULL, NULL, FALSE),
('Apple AirPods Max', 'Premium over-ear headphones with Active Noise Cancellation, spatial audio, 20-hour battery', 549.99, 11, 60, NULL, NULL, NULL, NULL, FALSE),
('Bose QuietComfort 45', 'Comfortable noise-canceling headphones with 24-hour battery, comfortable fit', 329.99, 11, 75, NULL, NULL, NULL, NULL, FALSE),
('Sennheiser Momentum 4', 'Premium wireless headphones with 60-hour battery, adaptive noise cancellation', 349.99, 11, 68, NULL, NULL, NULL, NULL, FALSE),
('JBL Tour One M2', 'Noise-canceling headphones with 50-hour battery, Smart Ambient mode', 249.99, 11, 80, NULL, NULL, NULL, NULL, FALSE),
('Bose 700', 'Noise-canceling headphones with 11 levels of cancellation, 20-hour battery', 379.99, 11, 72, NULL, NULL, NULL, NULL, FALSE),
('Sony WH-1000XM4', 'Previous generation noise-canceling headphones with 30-hour battery, LDAC', 349.99, 11, 78, NULL, NULL, NULL, NULL, FALSE),
('Beats Studio Pro', 'Wireless headphones with spatial audio, 40-hour battery, USB-C charging', 349.99, 11, 73, NULL, NULL, NULL, NULL, FALSE),
('Audio-Technica ATH-M50xBT2', 'Wireless studio headphones with 50-hour battery, aptX HD support', 199.99, 11, 85, NULL, NULL, NULL, NULL, FALSE),
('Sennheiser HD 450BT', 'Affordable noise-canceling headphones with 30-hour battery, Bluetooth 5.0', 179.99, 11, 90, NULL, NULL, NULL, NULL, FALSE),
('Jabra Elite 85h', 'Smart noise-canceling headphones with 36-hour battery, voice assistant support', 249.99, 11, 82, NULL, NULL, NULL, NULL, FALSE),
('Skullcandy Crusher Evo', 'Bass-heavy wireless headphones with sensory bass, 40-hour battery', 179.99, 11, 88, NULL, NULL, NULL, NULL, FALSE),
('Anker Soundcore Life Q35', 'Noise-canceling headphones with 40-hour battery, LDAC support, affordable', 129.99, 11, 95, NULL, NULL, NULL, NULL, FALSE),
('Bowers & Wilkins Px7 S2', 'Premium wireless headphones with 30-hour battery, adaptive noise cancellation', 399.99, 11, 65, NULL, NULL, NULL, NULL, FALSE),
('Master & Dynamic MW75', 'Luxury wireless headphones with 32-hour battery, premium materials', 549.99, 11, 55, NULL, NULL, NULL, NULL, FALSE),
('Bang & Olufsen Beoplay H95', 'Ultra-premium headphones with 38-hour battery, active noise cancellation', 899.99, 11, 40, NULL, NULL, NULL, NULL, FALSE),
('Sony WH-CH720N', 'Lightweight noise-canceling headphones with 35-hour battery, affordable', 129.99, 11, 92, NULL, NULL, NULL, NULL, FALSE),
('JBL Live 660NC', 'Noise-canceling headphones with 30-hour battery, voice assistant, comfortable', 149.99, 11, 87, NULL, NULL, NULL, NULL, FALSE),
('Sennheiser Accentum', 'Wireless headphones with 50-hour battery, adaptive noise cancellation', 199.99, 11, 83, NULL, NULL, NULL, NULL, FALSE),
('Bose QuietComfort Ultra', 'Latest noise-canceling headphones with Immersive Audio, 24-hour battery', 429.99, 11, 62, NULL, NULL, NULL, NULL, FALSE);

