# Badminton Stores Sample Data

This folder contains sample data for the Badminton Stores ecommerce application. The data is organized into separate SQL files based on database dependency order.

## Overview

This sample data set includes:
- **5 Categories**: Racquets, Bags, Shoes, Apparel, Accessories
- **30 Subcategories**: 5-7 subcategories per category
- **~120 Child Categories**: 3-5 child categories per subcategory
- **~400+ Products**: 2-5 products per child category
- **Product Images**: Template for product images (to be extended)

## File Structure and Execution Order

Files must be executed in the following order to respect foreign key dependencies:

1. **01_categories.sql** - Inserts 5 badminton categories
2. **02_subcategories.sql** - Inserts 30 subcategories (5-7 per category)
3. **03_child_categories.sql** - Inserts ~120 child categories (3-5 per subcategory)
4. **04_products.sql** - Inserts ~400+ products (2-5 per child category)
5. **05_product_images.sql** - Template for product images (to be extended)

## Execution Instructions

### Prerequisites
- MySQL database server running
- Database `ecommerce-mysql-db` created (see `schema.sql`)
- All tables created from `schema.sql`

### Step-by-Step Execution

1. **Connect to MySQL**:
   ```bash
   mysql -u your_username -p
   ```

2. **Select the database**:
   ```sql
   USE ecommerce-mysql-db;
   ```

3. **Execute files in order**:
   ```bash
   source database/badminton_sample_data/01_categories.sql;
   source database/badminton_sample_data/02_subcategories.sql;
   source database/badminton_sample_data/03_child_categories.sql;
   source database/badminton_sample_data/04_products.sql;
   source database/badminton_sample_data/05_product_images.sql;
   ```

   Or execute from command line:
   ```bash
   mysql -u your_username -p ecommerce-mysql-db < database/badminton_sample_data/01_categories.sql
   mysql -u your_username -p ecommerce-mysql-db < database/badminton_sample_data/02_subcategories.sql
   mysql -u your_username -p ecommerce-mysql-db < database/badminton_sample_data/03_child_categories.sql
   mysql -u your_username -p ecommerce-mysql-db < database/badminton_sample_data/04_products.sql
   mysql -u your_username -p ecommerce-mysql-db < database/badminton_sample_data/05_product_images.sql
   ```

## Data Statistics

### Categories (5 total)
1. Racquets
2. Bags
3. Shoes
4. Apparel
5. Accessories

### Subcategories (30 total)
- **Racquets**: 7 subcategories (Professional Rackets, Intermediate Rackets, Beginner Rackets, Lightweight Rackets, Heavy Rackets, Stringing Services, Racket Accessories)
- **Bags**: 6 subcategories (Racket Bags, Shoe Bags, Backpacks, Duffel Bags, Travel Bags, Drawstring Bags)
- **Shoes**: 7 subcategories (Professional Shoes, Indoor Court Shoes, Lightweight Shoes, Cushioned Shoes, Budget Shoes, Training Shoes, Competition Shoes)
- **Apparel**: 6 subcategories (Shirts, Shorts, Skirts, Socks, Sets, Jackets)
- **Accessories**: 7 subcategories (Grips, Strings, Wristbands, Headbands, Equipment, Towels, Water Bottles)

### Child Categories (~120 total)
- 3-5 child categories per subcategory
- Detailed, specific classifications for each subcategory

### Products (~400+ total)
- 2-5 products per child category
- **At least 1 clearance product per child category** (marked with `is_on_clearance = TRUE`)
- Realistic pricing ranges:
  - Racquets: $30-$300
  - Bags: $15-$150
  - Shoes: $40-$200
  - Apparel: $10-$100
  - Accessories: $5-$50
- Mix of discount types (percentage, fixed)
- Some products with active discounts, some without
- Realistic stock quantities (10-100+)
- Ratings and review counts included

### Product Images
- Template file provided (`05_product_images.sql`)
- Each product should have at least one primary image (`is_primary = TRUE`)
- Image URLs are currently NULL (placeholders)
- **Action Required**: Update image URLs after uploading to S3

## Product Features

### Clearance Products
- Every child category has at least one clearance product
- Clearance products have `is_on_clearance = TRUE`
- Typically have significant discounts (30-70% off)
- Realistic clearance pricing

### Discount Information
- Some products have active discounts with `discount_type`, `discount_value`, `discount_start_date`, and `discount_end_date`
- Discount types: `percentage` or `fixed`
- Discount periods set for 2025 (adjust as needed)

### Product Brands
Products feature realistic badminton brands:
- Yonex
- Victor
- Li-Ning
- Babolat
- Carlton (in some cases)

## Important Notes

### ID References
- All files use subqueries to reference parent records by name
- This ensures maintainability and avoids hardcoded IDs
- Example: `(SELECT id FROM categories WHERE name = 'Racquets')`

### Image URLs
- Product images currently have NULL `image_url` values
- After uploading images to S3, update using:
  ```sql
  UPDATE product_images 
  SET image_url = 'https://your-s3-bucket.s3.region.amazonaws.com/images/products/product-id/image.jpg' 
  WHERE product_id = (SELECT id FROM products WHERE name = 'Product Name');
  ```

### Database Name
- All files use `USE ecommerce-mysql-db;`
- Ensure your database name matches or update accordingly

### Date Ranges
- Discount dates are set for 2025
- Adjust `discount_start_date` and `discount_end_date` as needed for your use case

## Extending the Data

### Adding More Products
To add more products, follow the pattern in `04_products.sql`:
- Use subqueries to reference child categories by name
- Include all required fields
- Ensure at least one clearance product per child category

### Adding Product Images
To add product images:
1. Upload images to your S3 bucket
2. Update `05_product_images.sql` with INSERT statements
3. Use actual S3 URLs instead of NULL
4. Ensure each product has at least one primary image

### Adding More Categories/Subcategories
To extend the hierarchy:
1. Add categories in `01_categories.sql`
2. Add subcategories in `02_subcategories.sql` (reference categories by name)
3. Add child categories in `03_child_categories.sql` (reference subcategories by name)
4. Add products in `04_products.sql` (reference child categories by name)

## Troubleshooting

### Foreign Key Errors
- Ensure files are executed in the correct order (01 → 02 → 03 → 04 → 05)
- Verify that parent records exist before inserting child records

### Duplicate Key Errors
- Check for duplicate names in categories, subcategories, or child categories
- Ensure unique constraints are respected

### Missing References
- Verify that all subqueries can find matching records
- Check spelling of category/subcategory/child category names

## Author

**Thang Truong**  
Date: 2025-01-17

## License

This sample data is provided for development and testing purposes.

