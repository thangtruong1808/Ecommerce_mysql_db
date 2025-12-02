# Database Schema Documentation

## Overview
This MySQL database schema is designed for a full-featured ecommerce application. It supports user authentication, product management, shopping cart, orders, reviews, and admin functionality.

## Database Structure

### Core Tables

#### 1. **users**
Stores user account information.
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address (indexed)
- `password`: Hashed password
- `role`: User role ('user' or 'admin')
- `created_at`, `updated_at`: Timestamps

#### 2. **refresh_tokens**
Stores refresh tokens for JWT authentication with HTTP cookies.
- `id`: Primary key
- `user_id`: Foreign key to users
- `token`: Refresh token (indexed, unique)
- `expires_at`: Token expiration timestamp (indexed)
- `created_at`: Timestamp
- Used for refresh token rotation and revocation

#### 3. **categories**
Product categories for organization (top-level).
- `id`: Primary key
- `name`: Unique category name (indexed)
- `description`: Category description
- `created_at`, `updated_at`: Timestamps

#### 4. **subcategories**
Subcategories that belong to categories.
- `id`: Primary key
- `category_id`: Foreign key to categories
- `name`: Subcategory name (unique within category)
- `description`: Subcategory description
- `created_at`, `updated_at`: Timestamps
- Unique constraint on (category_id, name) - same subcategory name can exist in different categories

#### 5. **products**
Main product information (belongs to subcategories).
- `id`: Primary key
- `name`: Product name (indexed, fulltext)
- `description`: Product description (fulltext)
- `price`: Product price (indexed)
- `subcategory_id`: Foreign key to subcategories
- `stock`: Available inventory
- `rating`: Average rating (calculated, indexed)
- `num_reviews`: Number of reviews (calculated)
- `created_at`, `updated_at`: Timestamps

#### 6. **product_images**
Multiple images per product (one-to-many relationship).
- `id`: Primary key
- `product_id`: Foreign key to products
- `image_url`: URL/path to image
- `is_primary`: Flag for primary image
- `created_at`: Timestamp

#### 7. **product_videos**
Videos for products (OPTIONAL - not required, one-to-many relationship).
- Products can exist without any videos
- A product may have zero or more videos
- `id`: Primary key
- `product_id`: Foreign key to products
- `video_url`: URL/path to video
- `title`: Video title (nullable)
- `description`: Video description (nullable)
- `thumbnail_url`: Video thumbnail image (nullable)
- `duration`: Video duration in seconds (nullable)
- `is_primary`: Flag for primary video
- `created_at`: Timestamp

### User Management Tables

#### 8. **user_addresses**
Shipping addresses for users.
- `id`: Primary key
- `user_id`: Foreign key to users
- `address`: Street address
- `city`: City name
- `postal_code`: Postal/ZIP code
- `country`: Country name
- `is_default`: Default address flag
- `created_at`, `updated_at`: Timestamps

### Shopping Cart Tables

#### 9. **carts**
User shopping carts (one cart per user).
- `id`: Primary key
- `user_id`: Foreign key to users (unique)
- `created_at`, `updated_at`: Timestamps

#### 10. **cart_items**
Items in shopping carts.
- `id`: Primary key
- `cart_id`: Foreign key to carts
- `product_id`: Foreign key to products
- `quantity`: Item quantity
- Unique constraint on (cart_id, product_id) to prevent duplicates
- `created_at`, `updated_at`: Timestamps

### Order Management Tables

#### 11. **orders**
Order information.
- `id`: Primary key
- `user_id`: Foreign key to users
- `payment_method`: Payment method used
- `payment_result_id`: Payment transaction ID
- `payment_status`: Payment status
- `payment_update_time`: Payment update timestamp
- `payment_email`: Payment email
- `tax_price`: Tax amount
- `shipping_price`: Shipping cost
- `total_price`: Total order amount
- `is_paid`: Payment status flag
- `paid_at`: Payment timestamp
- `is_delivered`: Delivery status flag
- `delivered_at`: Delivery timestamp
- `created_at`, `updated_at`: Timestamps

#### 12. **order_items**
Items in each order.
- `id`: Primary key
- `order_id`: Foreign key to orders
- `product_id`: Foreign key to products (snapshot)
- `name`: Product name at time of order (snapshot)
- `image_url`: Product image at time of order (snapshot)
- `price`: Product price at time of order (snapshot)
- `quantity`: Item quantity

#### 13. **shipping_addresses**
Shipping address for each order (stored separately for order history).
- `id`: Primary key
- `order_id`: Foreign key to orders (unique)
- `address`: Street address
- `city`: City name
- `postal_code`: Postal/ZIP code
- `country`: Country name
- `created_at`: Timestamp

### Review System Tables

#### 14. **reviews**
Product reviews and ratings.
- `id`: Primary key
- `product_id`: Foreign key to products
- `user_id`: Foreign key to users
- `rating`: Rating (1-5, indexed)
- `comment`: Review text
- Unique constraint on (user_id, product_id) - one review per user per product
- `created_at`, `updated_at`: Timestamps

### Invoice System Tables

#### 15. **invoices**
Invoices generated when payment is made.
- `id`: Primary key
- `invoice_number`: Unique invoice number (format: INV-YYYYMMDD-XXXXX, indexed)
- `order_id`: Foreign key to orders (unique, one invoice per order)
- `user_id`: Foreign key to users
- `subtotal`: Subtotal amount
- `tax_amount`: Tax amount
- `shipping_amount`: Shipping cost
- `total_amount`: Total invoice amount
- `payment_method`: Payment method used
- `payment_status`: Payment status
- `billing_address`: Billing address (stored as TEXT)
- `shipping_address`: Shipping address (stored as TEXT)
- `email_sent`: Flag indicating if invoice email was sent
- `email_sent_at`: Timestamp when email was sent
- `pdf_path`: Path to generated PDF invoice file
- `created_at`: Timestamp

## Database Features

### Functions
- `generate_invoice_number()`: Generates unique invoice numbers in format INV-YYYYMMDD-XXXXX

### Triggers
Automatic triggers update product ratings when reviews are added, updated, or deleted:
- `update_product_rating_after_insert`: Updates rating after new review
- `update_product_rating_after_update`: Updates rating after review update
- `update_product_rating_after_delete`: Updates rating after review deletion

### Indexes
Comprehensive indexing for performance:
- Primary keys on all tables
- Foreign key indexes
- Search indexes (email, name, price, rating)
- Fulltext search on product name and description
- Composite indexes for common query patterns

### Constraints
- Foreign key constraints with appropriate CASCADE/RESTRICT actions
- Unique constraints (email, cart per user, review per user per product)
- Check constraints (rating range)
- NOT NULL constraints on required fields

## Relationships

```
users (1) ──< (many) refresh_tokens
users (1) ──< (many) user_addresses
users (1) ──< (1) carts
users (1) ──< (many) orders
users (1) ──< (many) reviews

categories (1) ──< (many) subcategories
subcategories (1) ──< (many) products

products (1) ──< (many) product_images
products (1) ──< (many) product_videos
products (1) ──< (many) cart_items
products (1) ──< (many) order_items
products (1) ──< (many) reviews

carts (1) ──< (many) cart_items

orders (1) ──< (many) order_items
orders (1) ──< (1) shipping_addresses
orders (1) ──< (1) invoices

users (1) ──< (many) invoices
```

## Sample Data
The schema includes sample categories to get started:
- Electronics
- Clothing
- Accessories
- Home & Garden
- Sports

## Usage

### Setup
```sql
-- Run the schema file
mysql -u root -p < schema.sql
```

### Connection String
```
mysql://username:password@localhost:3306/ecommerce_db
```

## Notes
- All tables use InnoDB engine for transaction support
- UTF8MB4 charset for full Unicode support
- Timestamps are automatically managed
- Product ratings are automatically calculated via triggers
- Order items store snapshots of product data for historical accuracy
- Invoices are automatically generated when payment is made
- Invoice numbers are auto-generated with date-based format
- Product videos are OPTIONAL and NOT REQUIRED - products can exist without any videos
- Videos are a one-to-many relationship (product may have zero or more videos)
- Role-based access: Users with 'admin' role can access admin dashboard

