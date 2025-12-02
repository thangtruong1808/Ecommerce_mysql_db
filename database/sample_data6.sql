-- Product Data for Ecommerce Database
-- This file contains products for child categories 42-51 (10 child categories)
-- Each child category has 20 products = 200 products total
--
-- @author Thang Truong
-- @date 2024-12-19

USE ecommerce_db;

-- ============================================
-- PRODUCTS FOR CHILD CATEGORIES 42-51
-- ============================================

-- Child Category 42: Badminton Shorts (subcategory_id: 9, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Badminton Shorts Pro', 'Professional badminton shorts with moisture-wicking fabric, breathable, comfortable fit', 34.99, 42, 160),
('Victor Badminton Shorts Elite', 'Professional badminton shorts with moisture-wicking fabric, breathable, comfortable fit', 29.99, 42, 170),
('Li-Ning Badminton Shorts Pro', 'Professional badminton shorts with moisture-wicking fabric, breathable, comfortable fit', 24.99, 42, 180),
('Yonex Badminton Shorts Performance', 'Performance badminton shorts with moisture-wicking fabric, breathable, comfortable', 39.99, 42, 155),
('Victor Badminton Shorts Performance', 'Performance badminton shorts with moisture-wicking fabric, breathable, comfortable', 34.99, 42, 165),
('Li-Ning Badminton Shorts Performance', 'Performance badminton shorts with moisture-wicking fabric, breathable, comfortable', 29.99, 42, 175),
('Yonex Badminton Shorts Training', 'Training badminton shorts with moisture-wicking fabric, breathable, comfortable', 19.99, 42, 190),
('Victor Badminton Shorts Training', 'Training badminton shorts with moisture-wicking fabric, breathable, comfortable', 14.99, 42, 200),
('Li-Ning Badminton Shorts Training', 'Training badminton shorts with moisture-wicking fabric, breathable, comfortable', 9.99, 42, 210),
('Yonex Badminton Shorts Casual', 'Casual badminton shorts with comfortable fabric, breathable, relaxed fit', 24.99, 42, 185),
('Victor Badminton Shorts Casual', 'Casual badminton shorts with comfortable fabric, breathable, relaxed fit', 19.99, 42, 195),
('Li-Ning Badminton Shorts Casual', 'Casual badminton shorts with comfortable fabric, breathable, relaxed fit', 14.99, 42, 205),
('Yonex Badminton Shorts Competition', 'Competition badminton shorts with moisture-wicking fabric, breathable, performance fit', 44.99, 42, 150),
('Victor Badminton Shorts Competition', 'Competition badminton shorts with moisture-wicking fabric, breathable, performance fit', 39.99, 42, 160),
('Li-Ning Badminton Shorts Competition', 'Competition badminton shorts with moisture-wicking fabric, breathable, performance fit', 34.99, 42, 170),
('Yonex Badminton Shorts Premium', 'Premium badminton shorts with advanced moisture-wicking, breathable, premium fit', 49.99, 42, 145),
('Victor Badminton Shorts Premium', 'Premium badminton shorts with advanced moisture-wicking, breathable, premium fit', 44.99, 42, 155),
('Li-Ning Badminton Shorts Premium', 'Premium badminton shorts with advanced moisture-wicking, breathable, premium fit', 39.99, 42, 165),
('Yonex Badminton Shorts Elite', 'Elite badminton shorts with ultimate moisture-wicking, breathable, elite fit', 54.99, 42, 140),
('Victor Badminton Shorts Elite Pro', 'Elite badminton shorts with ultimate moisture-wicking, breathable, elite fit', 49.99, 42, 150);

-- Child Category 43: Badminton Skirts (subcategory_id: 9, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Badminton Skirt Pro', 'Professional badminton skirt with moisture-wicking fabric, breathable, comfortable fit', 39.99, 43, 140),
('Victor Badminton Skirt Elite', 'Professional badminton skirt with moisture-wicking fabric, breathable, comfortable fit', 34.99, 43, 150),
('Li-Ning Badminton Skirt Pro', 'Professional badminton skirt with moisture-wicking fabric, breathable, comfortable fit', 29.99, 43, 160),
('Yonex Badminton Skirt Performance', 'Performance badminton skirt with moisture-wicking fabric, breathable, comfortable', 44.99, 43, 135),
('Victor Badminton Skirt Performance', 'Performance badminton skirt with moisture-wicking fabric, breathable, comfortable', 39.99, 43, 145),
('Li-Ning Badminton Skirt Performance', 'Performance badminton skirt with moisture-wicking fabric, breathable, comfortable', 34.99, 43, 155),
('Yonex Badminton Skirt Training', 'Training badminton skirt with moisture-wicking fabric, breathable, comfortable', 24.99, 43, 170),
('Victor Badminton Skirt Training', 'Training badminton skirt with moisture-wicking fabric, breathable, comfortable', 19.99, 43, 180),
('Li-Ning Badminton Skirt Training', 'Training badminton skirt with moisture-wicking fabric, breathable, comfortable', 14.99, 43, 190),
('Yonex Badminton Skirt Casual', 'Casual badminton skirt with comfortable fabric, breathable, relaxed fit', 29.99, 43, 165),
('Victor Badminton Skirt Casual', 'Casual badminton skirt with comfortable fabric, breathable, relaxed fit', 24.99, 43, 175),
('Li-Ning Badminton Skirt Casual', 'Casual badminton skirt with comfortable fabric, breathable, relaxed fit', 19.99, 43, 185),
('Yonex Badminton Skirt Competition', 'Competition badminton skirt with moisture-wicking fabric, breathable, performance fit', 49.99, 43, 130),
('Victor Badminton Skirt Competition', 'Competition badminton skirt with moisture-wicking fabric, breathable, performance fit', 44.99, 43, 140),
('Li-Ning Badminton Skirt Competition', 'Competition badminton skirt with moisture-wicking fabric, breathable, performance fit', 39.99, 43, 150),
('Yonex Badminton Skirt Premium', 'Premium badminton skirt with advanced moisture-wicking, breathable, premium fit', 54.99, 43, 125),
('Victor Badminton Skirt Premium', 'Premium badminton skirt with advanced moisture-wicking, breathable, premium fit', 49.99, 43, 135),
('Li-Ning Badminton Skirt Premium', 'Premium badminton skirt with advanced moisture-wicking, breathable, premium fit', 44.99, 43, 145),
('Yonex Badminton Skirt Elite', 'Elite badminton skirt with ultimate moisture-wicking, breathable, elite fit', 59.99, 43, 120),
('Victor Badminton Skirt Elite Pro', 'Elite badminton skirt with ultimate moisture-wicking, breathable, elite fit', 54.99, 43, 130);

-- Child Category 44: Badminton Socks (subcategory_id: 9, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Badminton Socks Pro', 'Professional badminton socks with cushioning, moisture-wicking, comfortable fit, 3-pack', 19.99, 44, 200),
('Victor Badminton Socks Elite', 'Professional badminton socks with cushioning, moisture-wicking, comfortable fit, 3-pack', 17.99, 44, 210),
('Li-Ning Badminton Socks Pro', 'Professional badminton socks with cushioning, moisture-wicking, comfortable fit, 3-pack', 15.99, 44, 220),
('Yonex Badminton Socks Performance', 'Performance badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 22.99, 44, 195),
('Victor Badminton Socks Performance', 'Performance badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 19.99, 44, 205),
('Li-Ning Badminton Socks Performance', 'Performance badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 17.99, 44, 215),
('Yonex Badminton Socks Training', 'Training badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 12.99, 44, 230),
('Victor Badminton Socks Training', 'Training badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 10.99, 44, 240),
('Li-Ning Badminton Socks Training', 'Training badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 8.99, 44, 250),
('Yonex Badminton Socks Casual', 'Casual badminton socks with comfortable fabric, breathable, relaxed fit, 3-pack', 14.99, 44, 225),
('Victor Badminton Socks Casual', 'Casual badminton socks with comfortable fabric, breathable, relaxed fit, 3-pack', 12.99, 44, 235),
('Li-Ning Badminton Socks Casual', 'Casual badminton socks with comfortable fabric, breathable, relaxed fit, 3-pack', 10.99, 44, 245),
('Yonex Badminton Socks Competition', 'Competition badminton socks with advanced cushioning, moisture-wicking, performance fit, 3-pack', 24.99, 44, 190),
('Victor Badminton Socks Competition', 'Competition badminton socks with advanced cushioning, moisture-wicking, performance fit, 3-pack', 22.99, 44, 200),
('Li-Ning Badminton Socks Competition', 'Competition badminton socks with advanced cushioning, moisture-wicking, performance fit, 3-pack', 19.99, 44, 210),
('Yonex Badminton Socks Premium', 'Premium badminton socks with ultimate cushioning, moisture-wicking, premium fit, 3-pack', 27.99, 44, 185),
('Victor Badminton Socks Premium', 'Premium badminton socks with ultimate cushioning, moisture-wicking, premium fit, 3-pack', 24.99, 44, 195),
('Li-Ning Badminton Socks Premium', 'Premium badminton socks with ultimate cushioning, moisture-wicking, premium fit, 3-pack', 21.99, 44, 205),
('Yonex Badminton Socks Elite', 'Elite badminton socks with maximum cushioning, moisture-wicking, elite fit, 3-pack', 29.99, 44, 180),
('Victor Badminton Socks Elite Pro', 'Elite badminton socks with maximum cushioning, moisture-wicking, elite fit, 3-pack', 27.99, 44, 190);

-- Child Category 45: Badminton Sets (subcategory_id: 9, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Badminton Set Pro', 'Complete badminton apparel set with shirt, shorts, socks, moisture-wicking fabric', 89.99, 45, 100),
('Victor Badminton Set Elite', 'Complete badminton apparel set with shirt, shorts, socks, moisture-wicking fabric', 79.99, 45, 110),
('Li-Ning Badminton Set Pro', 'Complete badminton apparel set with shirt, shorts, socks, moisture-wicking fabric', 69.99, 45, 120),
('Yonex Badminton Set Performance', 'Complete badminton apparel set with shirt, shorts, socks, performance fabric', 99.99, 45, 95),
('Victor Badminton Set Performance', 'Complete badminton apparel set with shirt, shorts, socks, performance fabric', 89.99, 45, 105),
('Li-Ning Badminton Set Performance', 'Complete badminton apparel set with shirt, shorts, socks, performance fabric', 79.99, 45, 115),
('Yonex Badminton Set Training', 'Complete badminton apparel set with shirt, shorts, socks, training fabric', 59.99, 45, 130),
('Victor Badminton Set Training', 'Complete badminton apparel set with shirt, shorts, socks, training fabric', 49.99, 45, 140),
('Li-Ning Badminton Set Training', 'Complete badminton apparel set with shirt, shorts, socks, training fabric', 39.99, 45, 150),
('Yonex Badminton Set Casual', 'Complete badminton apparel set with shirt, shorts, socks, casual fabric', 69.99, 45, 125),
('Victor Badminton Set Casual', 'Complete badminton apparel set with shirt, shorts, socks, casual fabric', 59.99, 45, 135),
('Li-Ning Badminton Set Casual', 'Complete badminton apparel set with shirt, shorts, socks, casual fabric', 49.99, 45, 145),
('Yonex Badminton Set Competition', 'Complete badminton apparel set with shirt, shorts, socks, competition fabric', 109.99, 45, 90),
('Victor Badminton Set Competition', 'Complete badminton apparel set with shirt, shorts, socks, competition fabric', 99.99, 45, 100),
('Li-Ning Badminton Set Competition', 'Complete badminton apparel set with shirt, shorts, socks, competition fabric', 89.99, 45, 110),
('Yonex Badminton Set Premium', 'Complete badminton apparel set with shirt, shorts, socks, premium fabric', 119.99, 45, 85),
('Victor Badminton Set Premium', 'Complete badminton apparel set with shirt, shorts, socks, premium fabric', 109.99, 45, 95),
('Li-Ning Badminton Set Premium', 'Complete badminton apparel set with shirt, shorts, socks, premium fabric', 99.99, 45, 105),
('Yonex Badminton Set Elite', 'Complete badminton apparel set with shirt, shorts, socks, elite fabric', 129.99, 45, 80),
('Victor Badminton Set Elite Pro', 'Complete badminton apparel set with shirt, shorts, socks, elite fabric', 119.99, 45, 90);

-- Child Category 46: Racket Bags (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Racket Bag Pro', 'Professional racket bag with multiple compartments, padded protection, shoulder strap', 49.99, 46, 120),
('Victor Racket Bag Elite', 'Professional racket bag with multiple compartments, padded protection, shoulder strap', 44.99, 46, 130),
('Li-Ning Racket Bag Pro', 'Professional racket bag with multiple compartments, padded protection, shoulder strap', 39.99, 46, 140),
('Yonex Racket Bag Performance', 'Performance racket bag with compartments, padded protection, shoulder strap', 54.99, 46, 115),
('Victor Racket Bag Performance', 'Performance racket bag with compartments, padded protection, shoulder strap', 49.99, 46, 125),
('Li-Ning Racket Bag Performance', 'Performance racket bag with compartments, padded protection, shoulder strap', 44.99, 46, 135),
('Yonex Racket Bag Training', 'Training racket bag with compartments, basic protection, shoulder strap', 29.99, 46, 150),
('Victor Racket Bag Training', 'Training racket bag with compartments, basic protection, shoulder strap', 24.99, 46, 160),
('Li-Ning Racket Bag Training', 'Training racket bag with compartments, basic protection, shoulder strap', 19.99, 46, 170),
('Yonex Racket Bag Casual', 'Casual racket bag with simple design, basic protection, shoulder strap', 34.99, 46, 145),
('Victor Racket Bag Casual', 'Casual racket bag with simple design, basic protection, shoulder strap', 29.99, 46, 155),
('Li-Ning Racket Bag Casual', 'Casual racket bag with simple design, basic protection, shoulder strap', 24.99, 46, 165),
('Yonex Racket Bag Competition', 'Competition racket bag with premium compartments, advanced protection, shoulder strap', 59.99, 46, 110),
('Victor Racket Bag Competition', 'Competition racket bag with premium compartments, advanced protection, shoulder strap', 54.99, 46, 120),
('Li-Ning Racket Bag Competition', 'Competition racket bag with premium compartments, advanced protection, shoulder strap', 49.99, 46, 130),
('Yonex Racket Bag Premium', 'Premium racket bag with ultimate compartments, maximum protection, shoulder strap', 64.99, 46, 105),
('Victor Racket Bag Premium', 'Premium racket bag with ultimate compartments, maximum protection, shoulder strap', 59.99, 46, 115),
('Li-Ning Racket Bag Premium', 'Premium racket bag with ultimate compartments, maximum protection, shoulder strap', 54.99, 46, 125),
('Yonex Racket Bag Elite', 'Elite racket bag with professional compartments, elite protection, shoulder strap', 69.99, 46, 100),
('Victor Racket Bag Elite Pro', 'Elite racket bag with professional compartments, elite protection, shoulder strap', 64.99, 46, 110);

-- Child Category 47: Racket Grips (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Super Grap', 'Premium racket grip with excellent grip, moisture-wicking, comfortable feel, 3-pack', 12.99, 47, 200),
('Victor GR-262', 'Premium racket grip with excellent grip, moisture-wicking, comfortable feel, 3-pack', 11.99, 47, 210),
('Li-Ning GP100', 'Premium racket grip with excellent grip, moisture-wicking, comfortable feel, 3-pack', 10.99, 47, 220),
('Yonex AC102EX', 'Performance racket grip with good grip, moisture-wicking, comfortable, 3-pack', 14.99, 47, 195),
('Victor GR-233', 'Performance racket grip with good grip, moisture-wicking, comfortable, 3-pack', 13.99, 47, 205),
('Li-Ning GP200', 'Performance racket grip with good grip, moisture-wicking, comfortable, 3-pack', 12.99, 47, 215),
('Yonex AC108', 'Training racket grip with basic grip, moisture-wicking, comfortable, 3-pack', 8.99, 47, 230),
('Victor GR-200', 'Training racket grip with basic grip, moisture-wicking, comfortable, 3-pack', 7.99, 47, 240),
('Li-Ning GP300', 'Training racket grip with basic grip, moisture-wicking, comfortable, 3-pack', 6.99, 47, 250),
('Yonex AC102', 'Casual racket grip with comfortable feel, basic grip, 3-pack', 9.99, 47, 225),
('Victor GR-150', 'Casual racket grip with comfortable feel, basic grip, 3-pack', 8.99, 47, 235),
('Li-Ning GP400', 'Casual racket grip with comfortable feel, basic grip, 3-pack', 7.99, 47, 245),
('Yonex AC102EX Pro', 'Competition racket grip with advanced grip, moisture-wicking, performance feel, 3-pack', 16.99, 47, 190),
('Victor GR-262 Pro', 'Competition racket grip with advanced grip, moisture-wicking, performance feel, 3-pack', 15.99, 47, 200),
('Li-Ning GP100 Pro', 'Competition racket grip with advanced grip, moisture-wicking, performance feel, 3-pack', 14.99, 47, 210),
('Yonex Super Grap Pro', 'Premium racket grip with ultimate grip, moisture-wicking, premium feel, 3-pack', 18.99, 47, 185),
('Victor GR-262 Elite', 'Premium racket grip with ultimate grip, moisture-wicking, premium feel, 3-pack', 17.99, 47, 195),
('Li-Ning GP100 Elite', 'Premium racket grip with ultimate grip, moisture-wicking, premium feel, 3-pack', 16.99, 47, 205),
('Yonex AC102EX Elite', 'Elite racket grip with maximum grip, moisture-wicking, elite feel, 3-pack', 19.99, 47, 180),
('Victor GR-262 World', 'Elite racket grip with maximum grip, moisture-wicking, elite feel, 3-pack', 18.99, 47, 190);

-- Child Category 48: Racket Strings (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex BG80', 'Premium racket string with excellent durability, control, power, 10m length', 24.99, 48, 150),
('Victor VBS-66N', 'Premium racket string with excellent durability, control, power, 10m length', 23.99, 48, 160),
('Li-Ning No.1', 'Premium racket string with excellent durability, control, power, 10m length', 22.99, 48, 170),
('Yonex BG65', 'Performance racket string with good durability, control, power, 10m length', 19.99, 48, 180),
('Victor VBS-70', 'Performance racket string with good durability, control, power, 10m length', 18.99, 48, 190),
('Li-Ning No.5', 'Performance racket string with good durability, control, power, 10m length', 17.99, 48, 200),
('Yonex BG65Ti', 'Training racket string with basic durability, control, power, 10m length', 14.99, 48, 210),
('Victor VBS-63', 'Training racket string with basic durability, control, power, 10m length', 13.99, 48, 220),
('Li-Ning No.10', 'Training racket string with basic durability, control, power, 10m length', 12.99, 48, 230),
('Yonex BG66UM', 'Casual racket string with comfortable feel, basic durability, 10m length', 16.99, 48, 200),
('Victor VBS-68', 'Casual racket string with comfortable feel, basic durability, 10m length', 15.99, 48, 210),
('Li-Ning No.7', 'Casual racket string with comfortable feel, basic durability, 10m length', 14.99, 48, 220),
('Yonex BG80 Power', 'Competition racket string with advanced durability, control, power, 10m length', 26.99, 48, 140),
('Victor VBS-66N Pro', 'Competition racket string with advanced durability, control, power, 10m length', 25.99, 48, 150),
('Li-Ning No.1 Pro', 'Competition racket string with advanced durability, control, power, 10m length', 24.99, 48, 160),
('Yonex BG80 Elite', 'Premium racket string with ultimate durability, control, power, 10m length', 28.99, 48, 130),
('Victor VBS-66N Elite', 'Premium racket string with ultimate durability, control, power, 10m length', 27.99, 48, 140),
('Li-Ning No.1 Elite', 'Premium racket string with ultimate durability, control, power, 10m length', 26.99, 48, 150),
('Yonex BG80 World', 'Elite racket string with maximum durability, control, power, 10m length', 29.99, 48, 125),
('Victor VBS-66N World', 'Elite racket string with maximum durability, control, power, 10m length', 28.99, 48, 135);

-- Child Category 49: Wristbands & Headbands (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Wristband Pro', 'Professional wristband with sweat-absorbing fabric, comfortable fit, 2-pack', 9.99, 49, 250),
('Victor Wristband Elite', 'Professional wristband with sweat-absorbing fabric, comfortable fit, 2-pack', 8.99, 49, 260),
('Li-Ning Wristband Pro', 'Professional wristband with sweat-absorbing fabric, comfortable fit, 2-pack', 7.99, 49, 270),
('Yonex Headband Pro', 'Professional headband with sweat-absorbing fabric, comfortable fit, 2-pack', 12.99, 49, 240),
('Victor Headband Elite', 'Professional headband with sweat-absorbing fabric, comfortable fit, 2-pack', 11.99, 49, 250),
('Li-Ning Headband Pro', 'Professional headband with sweat-absorbing fabric, comfortable fit, 2-pack', 10.99, 49, 260),
('Yonex Wristband Performance', 'Performance wristband with sweat-absorbing fabric, comfortable, 2-pack', 10.99, 49, 245),
('Victor Wristband Performance', 'Performance wristband with sweat-absorbing fabric, comfortable, 2-pack', 9.99, 49, 255),
('Li-Ning Wristband Performance', 'Performance wristband with sweat-absorbing fabric, comfortable, 2-pack', 8.99, 49, 265),
('Yonex Headband Performance', 'Performance headband with sweat-absorbing fabric, comfortable, 2-pack', 13.99, 49, 235),
('Victor Headband Performance', 'Performance headband with sweat-absorbing fabric, comfortable, 2-pack', 12.99, 49, 245),
('Li-Ning Headband Performance', 'Performance headband with sweat-absorbing fabric, comfortable, 2-pack', 11.99, 49, 255),
('Yonex Wristband Training', 'Training wristband with basic sweat-absorbing, comfortable, 2-pack', 6.99, 49, 275),
('Victor Wristband Training', 'Training wristband with basic sweat-absorbing, comfortable, 2-pack', 5.99, 49, 285),
('Li-Ning Wristband Training', 'Training wristband with basic sweat-absorbing, comfortable, 2-pack', 4.99, 49, 295),
('Yonex Headband Training', 'Training headband with basic sweat-absorbing, comfortable, 2-pack', 8.99, 49, 265),
('Victor Headband Training', 'Training headband with basic sweat-absorbing, comfortable, 2-pack', 7.99, 49, 275),
('Li-Ning Headband Training', 'Training headband with basic sweat-absorbing, comfortable, 2-pack', 6.99, 49, 285),
('Yonex Wristband Set', 'Complete set with wristbands and headbands, sweat-absorbing, comfortable, 4-pack', 19.99, 49, 230),
('Victor Wristband Set Elite', 'Complete set with wristbands and headbands, sweat-absorbing, comfortable, 4-pack', 17.99, 49, 240);

-- Child Category 50: Badminton Equipment (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Yonex Badminton Net Pro', 'Professional badminton net with official dimensions, durable material, easy setup', 89.99, 50, 80),
('Victor Badminton Net Elite', 'Professional badminton net with official dimensions, durable material, easy setup', 79.99, 50, 90),
('Li-Ning Badminton Net Pro', 'Professional badminton net with official dimensions, durable material, easy setup', 69.99, 50, 100),
('Yonex Badminton Posts Pro', 'Professional badminton posts with adjustable height, sturdy construction, easy setup', 149.99, 50, 60),
('Victor Badminton Posts Elite', 'Professional badminton posts with adjustable height, sturdy construction, easy setup', 139.99, 50, 70),
('Li-Ning Badminton Posts Pro', 'Professional badminton posts with adjustable height, sturdy construction, easy setup', 129.99, 50, 80),
('Yonex Badminton Court Mat', 'Professional badminton court mat with non-slip surface, durable material, easy installation', 299.99, 50, 50),
('Victor Badminton Court Mat', 'Professional badminton court mat with non-slip surface, durable material, easy installation', 279.99, 50, 55),
('Li-Ning Badminton Court Mat', 'Professional badminton court mat with non-slip surface, durable material, easy installation', 259.99, 50, 60),
('Yonex Badminton Net Set', 'Complete badminton net set with net, posts, and accessories, easy setup', 199.99, 50, 70),
('Victor Badminton Net Set Elite', 'Complete badminton net set with net, posts, and accessories, easy setup', 189.99, 50, 75),
('Li-Ning Badminton Net Set Pro', 'Complete badminton net set with net, posts, and accessories, easy setup', 179.99, 50, 80),
('Yonex Badminton Training Equipment', 'Complete training equipment set with targets, cones, and accessories', 49.99, 50, 120),
('Victor Badminton Training Equipment', 'Complete training equipment set with targets, cones, and accessories', 44.99, 50, 130),
('Li-Ning Badminton Training Equipment', 'Complete training equipment set with targets, cones, and accessories', 39.99, 50, 140),
('Yonex Badminton Court Lighting', 'Professional court lighting system with LED lights, adjustable brightness, easy installation', 399.99, 50, 40),
('Victor Badminton Court Lighting', 'Professional court lighting system with LED lights, adjustable brightness, easy installation', 379.99, 50, 45),
('Li-Ning Badminton Court Lighting', 'Professional court lighting system with LED lights, adjustable brightness, easy installation', 359.99, 50, 50),
('Yonex Badminton Scoreboard', 'Electronic scoreboard with LED display, easy operation, battery-powered', 199.99, 50, 65),
('Victor Badminton Scoreboard Elite', 'Electronic scoreboard with LED display, easy operation, battery-powered', 189.99, 50, 70);

-- Child Category 51: Hiking Boots (subcategory_id: 11, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock) VALUES
('Salomon Quest 4 GTX', 'Premium hiking boots with Gore-Tex waterproofing, excellent grip, ankle support', 199.99, 51, 60),
('Merrell Moab 3', 'Durable hiking boots with Vibram sole, waterproof, comfortable fit', 129.99, 51, 80),
('Columbia Newton Ridge Plus', 'Reliable hiking boots with waterproof construction, good grip, affordable', 89.99, 51, 100),
('Keen Targhee III', 'Sturdy hiking boots with waterproof membrane, excellent traction, wide fit', 149.99, 51, 70),
('Timberland White Ledge', 'Classic hiking boots with waterproof construction, durable leather, comfortable', 119.99, 51, 85),
('La Sportiva Nucleo High GTX', 'Technical hiking boots with Gore-Tex, excellent grip, lightweight', 229.99, 51, 50),
('Oboz Bridger B-Dry', 'Supportive hiking boots with waterproof membrane, excellent traction, comfortable', 159.99, 51, 65),
('Vasque Breeze LT GTX', 'Lightweight hiking boots with Gore-Tex, excellent breathability, comfortable', 179.99, 51, 58),
('Lowa Renegade GTX Mid', 'Premium hiking boots with Gore-Tex, excellent support, durable construction', 199.99, 51, 55),
('Scarpa Zodiac Plus GTX', 'Technical hiking boots with Gore-Tex, excellent grip, lightweight design', 249.99, 51, 45),
('Adidas Terrex Swift R3 GTX', 'Modern hiking boots with Gore-Tex, excellent grip, comfortable fit', 169.99, 51, 62),
('The North Face Hedgehog Fastpack GTX', 'Lightweight hiking boots with Gore-Tex, excellent traction, comfortable', 149.99, 51, 68),
('Asolo Fugitive GTX', 'Premium hiking boots with Gore-Tex, excellent support, durable construction', 219.99, 51, 52),
('Zamberlan Vioz GTX', 'Italian hiking boots with Gore-Tex, excellent craftsmanship, durable', 279.99, 51, 40),
('Hanwag Tatra II GTX', 'Premium hiking boots with Gore-Tex, excellent support, comfortable fit', 249.99, 51, 43),
('Meindl Island MFS', 'German hiking boots with Gore-Tex, excellent quality, comfortable fit', 229.99, 51, 47),
('Aku Tribute II GTX', 'Italian hiking boots with Gore-Tex, excellent grip, lightweight', 199.99, 51, 54),
('Crispi Monaco GTX', 'Premium hiking boots with Gore-Tex, excellent support, durable construction', 269.99, 51, 38),
('Danner Mountain 600', 'American hiking boots with waterproof construction, excellent grip, comfortable', 189.99, 51, 56),
('Altra Lone Peak Hiker', 'Zero-drop hiking boots with wide toe box, excellent comfort, lightweight', 149.99, 51, 64);

