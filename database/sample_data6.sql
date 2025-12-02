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
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Badminton Shorts Pro', 'Professional badminton shorts with moisture-wicking fabric, breathable, comfortable fit', 34.99, 42, 160, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shorts Elite', 'Professional badminton shorts with moisture-wicking fabric, breathable, comfortable fit', 29.99, 42, 170, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shorts Pro', 'Professional badminton shorts with moisture-wicking fabric, breathable, comfortable fit', 24.99, 42, 180, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shorts Performance', 'Performance badminton shorts with moisture-wicking fabric, breathable, comfortable', 39.99, 42, 155, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shorts Performance', 'Performance badminton shorts with moisture-wicking fabric, breathable, comfortable', 34.99, 42, 165, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shorts Performance', 'Performance badminton shorts with moisture-wicking fabric, breathable, comfortable', 29.99, 42, 175, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shorts Training', 'Training badminton shorts with moisture-wicking fabric, breathable, comfortable', 19.99, 42, 190, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shorts Training', 'Training badminton shorts with moisture-wicking fabric, breathable, comfortable', 14.99, 42, 200, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shorts Training', 'Training badminton shorts with moisture-wicking fabric, breathable, comfortable', 9.99, 42, 210, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shorts Casual', 'Casual badminton shorts with comfortable fabric, breathable, relaxed fit', 24.99, 42, 185, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shorts Casual', 'Casual badminton shorts with comfortable fabric, breathable, relaxed fit', 19.99, 42, 195, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shorts Casual', 'Casual badminton shorts with comfortable fabric, breathable, relaxed fit', 14.99, 42, 205, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shorts Competition', 'Competition badminton shorts with moisture-wicking fabric, breathable, performance fit', 44.99, 42, 150, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shorts Competition', 'Competition badminton shorts with moisture-wicking fabric, breathable, performance fit', 39.99, 42, 160, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shorts Competition', 'Competition badminton shorts with moisture-wicking fabric, breathable, performance fit', 34.99, 42, 170, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shorts Premium', 'Premium badminton shorts with advanced moisture-wicking, breathable, premium fit', 49.99, 42, 145, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shorts Premium', 'Premium badminton shorts with advanced moisture-wicking, breathable, premium fit', 44.99, 42, 155, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Shorts Premium', 'Premium badminton shorts with advanced moisture-wicking, breathable, premium fit', 39.99, 42, 165, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Shorts Elite', 'Elite badminton shorts with ultimate moisture-wicking, breathable, elite fit', 54.99, 42, 140, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Shorts Elite Pro', 'Elite badminton shorts with ultimate moisture-wicking, breathable, elite fit', 49.99, 42, 150, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 43: Badminton Skirts (subcategory_id: 9, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Badminton Skirt Pro', 'Professional badminton skirt with moisture-wicking fabric, breathable, comfortable fit', 39.99, 43, 140, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Skirt Elite', 'Professional badminton skirt with moisture-wicking fabric, breathable, comfortable fit', 34.99, 43, 150, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Skirt Pro', 'Professional badminton skirt with moisture-wicking fabric, breathable, comfortable fit', 29.99, 43, 160, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Skirt Performance', 'Performance badminton skirt with moisture-wicking fabric, breathable, comfortable', 44.99, 43, 135, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Skirt Performance', 'Performance badminton skirt with moisture-wicking fabric, breathable, comfortable', 39.99, 43, 145, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Skirt Performance', 'Performance badminton skirt with moisture-wicking fabric, breathable, comfortable', 34.99, 43, 155, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Skirt Training', 'Training badminton skirt with moisture-wicking fabric, breathable, comfortable', 24.99, 43, 170, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Skirt Training', 'Training badminton skirt with moisture-wicking fabric, breathable, comfortable', 19.99, 43, 180, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Skirt Training', 'Training badminton skirt with moisture-wicking fabric, breathable, comfortable', 14.99, 43, 190, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Skirt Casual', 'Casual badminton skirt with comfortable fabric, breathable, relaxed fit', 29.99, 43, 165, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Skirt Casual', 'Casual badminton skirt with comfortable fabric, breathable, relaxed fit', 24.99, 43, 175, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Skirt Casual', 'Casual badminton skirt with comfortable fabric, breathable, relaxed fit', 19.99, 43, 185, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Skirt Competition', 'Competition badminton skirt with moisture-wicking fabric, breathable, performance fit', 49.99, 43, 130, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Skirt Competition', 'Competition badminton skirt with moisture-wicking fabric, breathable, performance fit', 44.99, 43, 140, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Skirt Competition', 'Competition badminton skirt with moisture-wicking fabric, breathable, performance fit', 39.99, 43, 150, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Skirt Premium', 'Premium badminton skirt with advanced moisture-wicking, breathable, premium fit', 54.99, 43, 125, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Skirt Premium', 'Premium badminton skirt with advanced moisture-wicking, breathable, premium fit', 49.99, 43, 135, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Skirt Premium', 'Premium badminton skirt with advanced moisture-wicking, breathable, premium fit', 44.99, 43, 145, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Skirt Elite', 'Elite badminton skirt with ultimate moisture-wicking, breathable, elite fit', 59.99, 43, 120, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Skirt Elite Pro', 'Elite badminton skirt with ultimate moisture-wicking, breathable, elite fit', 54.99, 43, 130, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 44: Badminton Socks (subcategory_id: 9, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Badminton Socks Pro', 'Professional badminton socks with cushioning, moisture-wicking, comfortable fit, 3-pack', 19.99, 44, 200, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Socks Elite', 'Professional badminton socks with cushioning, moisture-wicking, comfortable fit, 3-pack', 17.99, 44, 210, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Socks Pro', 'Professional badminton socks with cushioning, moisture-wicking, comfortable fit, 3-pack', 15.99, 44, 220, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Socks Performance', 'Performance badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 22.99, 44, 195, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Socks Performance', 'Performance badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 19.99, 44, 205, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Socks Performance', 'Performance badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 17.99, 44, 215, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Socks Training', 'Training badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 12.99, 44, 230, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Socks Training', 'Training badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 10.99, 44, 240, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Socks Training', 'Training badminton socks with cushioning, moisture-wicking, comfortable, 3-pack', 8.99, 44, 250, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Socks Casual', 'Casual badminton socks with comfortable fabric, breathable, relaxed fit, 3-pack', 14.99, 44, 225, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Socks Casual', 'Casual badminton socks with comfortable fabric, breathable, relaxed fit, 3-pack', 12.99, 44, 235, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Socks Casual', 'Casual badminton socks with comfortable fabric, breathable, relaxed fit, 3-pack', 10.99, 44, 245, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Socks Competition', 'Competition badminton socks with advanced cushioning, moisture-wicking, performance fit, 3-pack', 24.99, 44, 190, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Socks Competition', 'Competition badminton socks with advanced cushioning, moisture-wicking, performance fit, 3-pack', 22.99, 44, 200, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Socks Competition', 'Competition badminton socks with advanced cushioning, moisture-wicking, performance fit, 3-pack', 19.99, 44, 210, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Socks Premium', 'Premium badminton socks with ultimate cushioning, moisture-wicking, premium fit, 3-pack', 27.99, 44, 185, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Socks Premium', 'Premium badminton socks with ultimate cushioning, moisture-wicking, premium fit, 3-pack', 24.99, 44, 195, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Socks Premium', 'Premium badminton socks with ultimate cushioning, moisture-wicking, premium fit, 3-pack', 21.99, 44, 205, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Socks Elite', 'Elite badminton socks with maximum cushioning, moisture-wicking, elite fit, 3-pack', 29.99, 44, 180, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Socks Elite Pro', 'Elite badminton socks with maximum cushioning, moisture-wicking, elite fit, 3-pack', 27.99, 44, 190, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 45: Badminton Sets (subcategory_id: 9, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Badminton Set Pro', 'Complete badminton apparel set with shirt, shorts, socks, moisture-wicking fabric', 89.99, 45, 100, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Set Elite', 'Complete badminton apparel set with shirt, shorts, socks, moisture-wicking fabric', 79.99, 45, 110, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Set Pro', 'Complete badminton apparel set with shirt, shorts, socks, moisture-wicking fabric', 69.99, 45, 120, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Set Performance', 'Complete badminton apparel set with shirt, shorts, socks, performance fabric', 99.99, 45, 95, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Set Performance', 'Complete badminton apparel set with shirt, shorts, socks, performance fabric', 89.99, 45, 105, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Set Performance', 'Complete badminton apparel set with shirt, shorts, socks, performance fabric', 79.99, 45, 115, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Set Training', 'Complete badminton apparel set with shirt, shorts, socks, training fabric', 59.99, 45, 130, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Set Training', 'Complete badminton apparel set with shirt, shorts, socks, training fabric', 49.99, 45, 140, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Set Training', 'Complete badminton apparel set with shirt, shorts, socks, training fabric', 39.99, 45, 150, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Set Casual', 'Complete badminton apparel set with shirt, shorts, socks, casual fabric', 69.99, 45, 125, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Set Casual', 'Complete badminton apparel set with shirt, shorts, socks, casual fabric', 59.99, 45, 135, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Set Casual', 'Complete badminton apparel set with shirt, shorts, socks, casual fabric', 49.99, 45, 145, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Set Competition', 'Complete badminton apparel set with shirt, shorts, socks, competition fabric', 109.99, 45, 90, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Set Competition', 'Complete badminton apparel set with shirt, shorts, socks, competition fabric', 99.99, 45, 100, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Set Competition', 'Complete badminton apparel set with shirt, shorts, socks, competition fabric', 89.99, 45, 110, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Set Premium', 'Complete badminton apparel set with shirt, shorts, socks, premium fabric', 119.99, 45, 85, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Set Premium', 'Complete badminton apparel set with shirt, shorts, socks, premium fabric', 109.99, 45, 95, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Set Premium', 'Complete badminton apparel set with shirt, shorts, socks, premium fabric', 99.99, 45, 105, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Set Elite', 'Complete badminton apparel set with shirt, shorts, socks, elite fabric', 129.99, 45, 80, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Set Elite Pro', 'Complete badminton apparel set with shirt, shorts, socks, elite fabric', 119.99, 45, 90, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 46: Racket Bags (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Racket Bag Pro', 'Professional racket bag with multiple compartments, padded protection, shoulder strap', 49.99, 46, 120, NULL, NULL, NULL, NULL, FALSE),
('Victor Racket Bag Elite', 'Professional racket bag with multiple compartments, padded protection, shoulder strap', 44.99, 46, 130, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Racket Bag Pro', 'Professional racket bag with multiple compartments, padded protection, shoulder strap', 39.99, 46, 140, NULL, NULL, NULL, NULL, FALSE),
('Yonex Racket Bag Performance', 'Performance racket bag with compartments, padded protection, shoulder strap', 54.99, 46, 115, NULL, NULL, NULL, NULL, FALSE),
('Victor Racket Bag Performance', 'Performance racket bag with compartments, padded protection, shoulder strap', 49.99, 46, 125, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Racket Bag Performance', 'Performance racket bag with compartments, padded protection, shoulder strap', 44.99, 46, 135, NULL, NULL, NULL, NULL, FALSE),
('Yonex Racket Bag Training', 'Training racket bag with compartments, basic protection, shoulder strap', 29.99, 46, 150, NULL, NULL, NULL, NULL, FALSE),
('Victor Racket Bag Training', 'Training racket bag with compartments, basic protection, shoulder strap', 24.99, 46, 160, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Racket Bag Training', 'Training racket bag with compartments, basic protection, shoulder strap', 19.99, 46, 170, NULL, NULL, NULL, NULL, FALSE),
('Yonex Racket Bag Casual', 'Casual racket bag with simple design, basic protection, shoulder strap', 34.99, 46, 145, NULL, NULL, NULL, NULL, FALSE),
('Victor Racket Bag Casual', 'Casual racket bag with simple design, basic protection, shoulder strap', 29.99, 46, 155, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Racket Bag Casual', 'Casual racket bag with simple design, basic protection, shoulder strap', 24.99, 46, 165, NULL, NULL, NULL, NULL, FALSE),
('Yonex Racket Bag Competition', 'Competition racket bag with premium compartments, advanced protection, shoulder strap', 59.99, 46, 110, NULL, NULL, NULL, NULL, FALSE),
('Victor Racket Bag Competition', 'Competition racket bag with premium compartments, advanced protection, shoulder strap', 54.99, 46, 120, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Racket Bag Competition', 'Competition racket bag with premium compartments, advanced protection, shoulder strap', 49.99, 46, 130, NULL, NULL, NULL, NULL, FALSE),
('Yonex Racket Bag Premium', 'Premium racket bag with ultimate compartments, maximum protection, shoulder strap', 64.99, 46, 105, NULL, NULL, NULL, NULL, FALSE),
('Victor Racket Bag Premium', 'Premium racket bag with ultimate compartments, maximum protection, shoulder strap', 59.99, 46, 115, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Racket Bag Premium', 'Premium racket bag with ultimate compartments, maximum protection, shoulder strap', 54.99, 46, 125, NULL, NULL, NULL, NULL, FALSE),
('Yonex Racket Bag Elite', 'Elite racket bag with professional compartments, elite protection, shoulder strap', 69.99, 46, 100, NULL, NULL, NULL, NULL, FALSE),
('Victor Racket Bag Elite Pro', 'Elite racket bag with professional compartments, elite protection, shoulder strap', 64.99, 46, 110, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 47: Racket Grips (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Super Grap', 'Premium racket grip with excellent grip, moisture-wicking, comfortable feel, 3-pack', 12.99, 47, 200, NULL, NULL, NULL, NULL, FALSE),
('Victor GR-262', 'Premium racket grip with excellent grip, moisture-wicking, comfortable feel, 3-pack', 11.99, 47, 210, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning GP100', 'Premium racket grip with excellent grip, moisture-wicking, comfortable feel, 3-pack', 10.99, 47, 220, NULL, NULL, NULL, NULL, FALSE),
('Yonex AC102EX', 'Performance racket grip with good grip, moisture-wicking, comfortable, 3-pack', 14.99, 47, 195, NULL, NULL, NULL, NULL, FALSE),
('Victor GR-233', 'Performance racket grip with good grip, moisture-wicking, comfortable, 3-pack', 13.99, 47, 205, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning GP200', 'Performance racket grip with good grip, moisture-wicking, comfortable, 3-pack', 12.99, 47, 215, NULL, NULL, NULL, NULL, FALSE),
('Yonex AC108', 'Training racket grip with basic grip, moisture-wicking, comfortable, 3-pack', 8.99, 47, 230, NULL, NULL, NULL, NULL, FALSE),
('Victor GR-200', 'Training racket grip with basic grip, moisture-wicking, comfortable, 3-pack', 7.99, 47, 240, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning GP300', 'Training racket grip with basic grip, moisture-wicking, comfortable, 3-pack', 6.99, 47, 250, NULL, NULL, NULL, NULL, FALSE),
('Yonex AC102', 'Casual racket grip with comfortable feel, basic grip, 3-pack', 9.99, 47, 225, NULL, NULL, NULL, NULL, FALSE),
('Victor GR-150', 'Casual racket grip with comfortable feel, basic grip, 3-pack', 8.99, 47, 235, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning GP400', 'Casual racket grip with comfortable feel, basic grip, 3-pack', 7.99, 47, 245, NULL, NULL, NULL, NULL, FALSE),
('Yonex AC102EX Pro', 'Competition racket grip with advanced grip, moisture-wicking, performance feel, 3-pack', 16.99, 47, 190, NULL, NULL, NULL, NULL, FALSE),
('Victor GR-262 Pro', 'Competition racket grip with advanced grip, moisture-wicking, performance feel, 3-pack', 15.99, 47, 200, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning GP100 Pro', 'Competition racket grip with advanced grip, moisture-wicking, performance feel, 3-pack', 14.99, 47, 210, NULL, NULL, NULL, NULL, FALSE),
('Yonex Super Grap Pro', 'Premium racket grip with ultimate grip, moisture-wicking, premium feel, 3-pack', 18.99, 47, 185, NULL, NULL, NULL, NULL, FALSE),
('Victor GR-262 Elite', 'Premium racket grip with ultimate grip, moisture-wicking, premium feel, 3-pack', 17.99, 47, 195, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning GP100 Elite', 'Premium racket grip with ultimate grip, moisture-wicking, premium feel, 3-pack', 16.99, 47, 205, NULL, NULL, NULL, NULL, FALSE),
('Yonex AC102EX Elite', 'Elite racket grip with maximum grip, moisture-wicking, elite feel, 3-pack', 19.99, 47, 180, NULL, NULL, NULL, NULL, FALSE),
('Victor GR-262 World', 'Elite racket grip with maximum grip, moisture-wicking, elite feel, 3-pack', 18.99, 47, 190, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 48: Racket Strings (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex BG80', 'Premium racket string with excellent durability, control, power, 10m length', 24.99, 48, 150, NULL, NULL, NULL, NULL, FALSE),
('Victor VBS-66N', 'Premium racket string with excellent durability, control, power, 10m length', 23.99, 48, 160, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.1', 'Premium racket string with excellent durability, control, power, 10m length', 22.99, 48, 170, NULL, NULL, NULL, NULL, FALSE),
('Yonex BG65', 'Performance racket string with good durability, control, power, 10m length', 19.99, 48, 180, NULL, NULL, NULL, NULL, FALSE),
('Victor VBS-70', 'Performance racket string with good durability, control, power, 10m length', 18.99, 48, 190, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.5', 'Performance racket string with good durability, control, power, 10m length', 17.99, 48, 200, NULL, NULL, NULL, NULL, FALSE),
('Yonex BG65Ti', 'Training racket string with basic durability, control, power, 10m length', 14.99, 48, 210, NULL, NULL, NULL, NULL, FALSE),
('Victor VBS-63', 'Training racket string with basic durability, control, power, 10m length', 13.99, 48, 220, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.10', 'Training racket string with basic durability, control, power, 10m length', 12.99, 48, 230, NULL, NULL, NULL, NULL, FALSE),
('Yonex BG66UM', 'Casual racket string with comfortable feel, basic durability, 10m length', 16.99, 48, 200, NULL, NULL, NULL, NULL, FALSE),
('Victor VBS-68', 'Casual racket string with comfortable feel, basic durability, 10m length', 15.99, 48, 210, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.7', 'Casual racket string with comfortable feel, basic durability, 10m length', 14.99, 48, 220, NULL, NULL, NULL, NULL, FALSE),
('Yonex BG80 Power', 'Competition racket string with advanced durability, control, power, 10m length', 26.99, 48, 140, NULL, NULL, NULL, NULL, FALSE),
('Victor VBS-66N Pro', 'Competition racket string with advanced durability, control, power, 10m length', 25.99, 48, 150, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.1 Pro', 'Competition racket string with advanced durability, control, power, 10m length', 24.99, 48, 160, NULL, NULL, NULL, NULL, FALSE),
('Yonex BG80 Elite', 'Premium racket string with ultimate durability, control, power, 10m length', 28.99, 48, 130, NULL, NULL, NULL, NULL, FALSE),
('Victor VBS-66N Elite', 'Premium racket string with ultimate durability, control, power, 10m length', 27.99, 48, 140, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning No.1 Elite', 'Premium racket string with ultimate durability, control, power, 10m length', 26.99, 48, 150, NULL, NULL, NULL, NULL, FALSE),
('Yonex BG80 World', 'Elite racket string with maximum durability, control, power, 10m length', 29.99, 48, 125, NULL, NULL, NULL, NULL, FALSE),
('Victor VBS-66N World', 'Elite racket string with maximum durability, control, power, 10m length', 28.99, 48, 135, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 49: Wristbands & Headbands (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Wristband Pro', 'Professional wristband with sweat-absorbing fabric, comfortable fit, 2-pack', 9.99, 49, 250, NULL, NULL, NULL, NULL, FALSE),
('Victor Wristband Elite', 'Professional wristband with sweat-absorbing fabric, comfortable fit, 2-pack', 8.99, 49, 260, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Wristband Pro', 'Professional wristband with sweat-absorbing fabric, comfortable fit, 2-pack', 7.99, 49, 270, NULL, NULL, NULL, NULL, FALSE),
('Yonex Headband Pro', 'Professional headband with sweat-absorbing fabric, comfortable fit, 2-pack', 12.99, 49, 240, NULL, NULL, NULL, NULL, FALSE),
('Victor Headband Elite', 'Professional headband with sweat-absorbing fabric, comfortable fit, 2-pack', 11.99, 49, 250, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Headband Pro', 'Professional headband with sweat-absorbing fabric, comfortable fit, 2-pack', 10.99, 49, 260, NULL, NULL, NULL, NULL, FALSE),
('Yonex Wristband Performance', 'Performance wristband with sweat-absorbing fabric, comfortable, 2-pack', 10.99, 49, 245, NULL, NULL, NULL, NULL, FALSE),
('Victor Wristband Performance', 'Performance wristband with sweat-absorbing fabric, comfortable, 2-pack', 9.99, 49, 255, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Wristband Performance', 'Performance wristband with sweat-absorbing fabric, comfortable, 2-pack', 8.99, 49, 265, NULL, NULL, NULL, NULL, FALSE),
('Yonex Headband Performance', 'Performance headband with sweat-absorbing fabric, comfortable, 2-pack', 13.99, 49, 235, NULL, NULL, NULL, NULL, FALSE),
('Victor Headband Performance', 'Performance headband with sweat-absorbing fabric, comfortable, 2-pack', 12.99, 49, 245, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Headband Performance', 'Performance headband with sweat-absorbing fabric, comfortable, 2-pack', 11.99, 49, 255, NULL, NULL, NULL, NULL, FALSE),
('Yonex Wristband Training', 'Training wristband with basic sweat-absorbing, comfortable, 2-pack', 6.99, 49, 275, NULL, NULL, NULL, NULL, FALSE),
('Victor Wristband Training', 'Training wristband with basic sweat-absorbing, comfortable, 2-pack', 5.99, 49, 285, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Wristband Training', 'Training wristband with basic sweat-absorbing, comfortable, 2-pack', 4.99, 49, 295, NULL, NULL, NULL, NULL, FALSE),
('Yonex Headband Training', 'Training headband with basic sweat-absorbing, comfortable, 2-pack', 8.99, 49, 265, NULL, NULL, NULL, NULL, FALSE),
('Victor Headband Training', 'Training headband with basic sweat-absorbing, comfortable, 2-pack', 7.99, 49, 275, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Headband Training', 'Training headband with basic sweat-absorbing, comfortable, 2-pack', 6.99, 49, 285, NULL, NULL, NULL, NULL, FALSE),
('Yonex Wristband Set', 'Complete set with wristbands and headbands, sweat-absorbing, comfortable, 4-pack', 19.99, 49, 230, NULL, NULL, NULL, NULL, FALSE),
('Victor Wristband Set Elite', 'Complete set with wristbands and headbands, sweat-absorbing, comfortable, 4-pack', 17.99, 49, 240, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 50: Badminton Equipment (subcategory_id: 10, category_id: 2)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Yonex Badminton Net Pro', 'Professional badminton net with official dimensions, durable material, easy setup', 89.99, 50, 80, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Net Elite', 'Professional badminton net with official dimensions, durable material, easy setup', 79.99, 50, 90, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Net Pro', 'Professional badminton net with official dimensions, durable material, easy setup', 69.99, 50, 100, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Posts Pro', 'Professional badminton posts with adjustable height, sturdy construction, easy setup', 149.99, 50, 60, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Posts Elite', 'Professional badminton posts with adjustable height, sturdy construction, easy setup', 139.99, 50, 70, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Posts Pro', 'Professional badminton posts with adjustable height, sturdy construction, easy setup', 129.99, 50, 80, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Court Mat', 'Professional badminton court mat with non-slip surface, durable material, easy installation', 299.99, 50, 50, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Court Mat', 'Professional badminton court mat with non-slip surface, durable material, easy installation', 279.99, 50, 55, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Court Mat', 'Professional badminton court mat with non-slip surface, durable material, easy installation', 259.99, 50, 60, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Net Set', 'Complete badminton net set with net, posts, and accessories, easy setup', 199.99, 50, 70, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Net Set Elite', 'Complete badminton net set with net, posts, and accessories, easy setup', 189.99, 50, 75, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Net Set Pro', 'Complete badminton net set with net, posts, and accessories, easy setup', 179.99, 50, 80, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Training Equipment', 'Complete training equipment set with targets, cones, and accessories', 49.99, 50, 120, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Training Equipment', 'Complete training equipment set with targets, cones, and accessories', 44.99, 50, 130, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Training Equipment', 'Complete training equipment set with targets, cones, and accessories', 39.99, 50, 140, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Court Lighting', 'Professional court lighting system with LED lights, adjustable brightness, easy installation', 399.99, 50, 40, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Court Lighting', 'Professional court lighting system with LED lights, adjustable brightness, easy installation', 379.99, 50, 45, NULL, NULL, NULL, NULL, FALSE),
('Li-Ning Badminton Court Lighting', 'Professional court lighting system with LED lights, adjustable brightness, easy installation', 359.99, 50, 50, NULL, NULL, NULL, NULL, FALSE),
('Yonex Badminton Scoreboard', 'Electronic scoreboard with LED display, easy operation, battery-powered', 199.99, 50, 65, NULL, NULL, NULL, NULL, FALSE),
('Victor Badminton Scoreboard Elite', 'Electronic scoreboard with LED display, easy operation, battery-powered', 189.99, 50, 70, NULL, NULL, NULL, NULL, FALSE);

-- Child Category 51: Hiking Boots (subcategory_id: 11, category_id: 3)
INSERT INTO products (name, description, price, child_category_id, stock, discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance) VALUES
('Salomon Quest 4 GTX', 'Premium hiking boots with Gore-Tex waterproofing, excellent grip, ankle support', 199.99, 51, 60, NULL, NULL, NULL, NULL, FALSE),
('Merrell Moab 3', 'Durable hiking boots with Vibram sole, waterproof, comfortable fit', 129.99, 51, 80, NULL, NULL, NULL, NULL, FALSE),
('Columbia Newton Ridge Plus', 'Reliable hiking boots with waterproof construction, good grip, affordable', 89.99, 51, 100, NULL, NULL, NULL, NULL, FALSE),
('Keen Targhee III', 'Sturdy hiking boots with waterproof membrane, excellent traction, wide fit', 149.99, 51, 70, NULL, NULL, NULL, NULL, FALSE),
('Timberland White Ledge', 'Classic hiking boots with waterproof construction, durable leather, comfortable', 119.99, 51, 85, NULL, NULL, NULL, NULL, FALSE),
('La Sportiva Nucleo High GTX', 'Technical hiking boots with Gore-Tex, excellent grip, lightweight', 229.99, 51, 50, NULL, NULL, NULL, NULL, FALSE),
('Oboz Bridger B-Dry', 'Supportive hiking boots with waterproof membrane, excellent traction, comfortable', 159.99, 51, 65, NULL, NULL, NULL, NULL, FALSE),
('Vasque Breeze LT GTX', 'Lightweight hiking boots with Gore-Tex, excellent breathability, comfortable', 179.99, 51, 58, NULL, NULL, NULL, NULL, FALSE),
('Lowa Renegade GTX Mid', 'Premium hiking boots with Gore-Tex, excellent support, durable construction', 199.99, 51, 55, NULL, NULL, NULL, NULL, FALSE),
('Scarpa Zodiac Plus GTX', 'Technical hiking boots with Gore-Tex, excellent grip, lightweight design', 249.99, 51, 45, NULL, NULL, NULL, NULL, FALSE),
('Adidas Terrex Swift R3 GTX', 'Modern hiking boots with Gore-Tex, excellent grip, comfortable fit', 169.99, 51, 62, NULL, NULL, NULL, NULL, FALSE),
('The North Face Hedgehog Fastpack GTX', 'Lightweight hiking boots with Gore-Tex, excellent traction, comfortable', 149.99, 51, 68, NULL, NULL, NULL, NULL, FALSE),
('Asolo Fugitive GTX', 'Premium hiking boots with Gore-Tex, excellent support, durable construction', 219.99, 51, 52, NULL, NULL, NULL, NULL, FALSE),
('Zamberlan Vioz GTX', 'Italian hiking boots with Gore-Tex, excellent craftsmanship, durable', 279.99, 51, 40, NULL, NULL, NULL, NULL, FALSE),
('Hanwag Tatra II GTX', 'Premium hiking boots with Gore-Tex, excellent support, comfortable fit', 249.99, 51, 43, NULL, NULL, NULL, NULL, FALSE),
('Meindl Island MFS', 'German hiking boots with Gore-Tex, excellent quality, comfortable fit', 229.99, 51, 47, NULL, NULL, NULL, NULL, FALSE),
('Aku Tribute II GTX', 'Italian hiking boots with Gore-Tex, excellent grip, lightweight', 199.99, 51, 54, NULL, NULL, NULL, NULL, FALSE),
('Crispi Monaco GTX', 'Premium hiking boots with Gore-Tex, excellent support, durable construction', 269.99, 51, 38, NULL, NULL, NULL, NULL, FALSE),
('Danner Mountain 600', 'American hiking boots with waterproof construction, excellent grip, comfortable', 189.99, 51, 56, NULL, NULL, NULL, NULL, FALSE),
('Altra Lone Peak Hiker', 'Zero-drop hiking boots with wide toe box, excellent comfort, lightweight', 149.99, 51, 64, NULL, NULL, NULL, NULL, FALSE);

