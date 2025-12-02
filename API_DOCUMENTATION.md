# Ecommerce API Documentation - Products Endpoints

**Base URL:** `http://localhost:5000/api`

**Author:** Thang Truong  
**Date:** 2024-12-19

---

## ⚠️ Important: Public Endpoints Don't Require Authentication

**The following endpoints are PUBLIC and do NOT require login:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/clearance` - Get clearance products
- `GET /api/products/categories` - Get categories
- `GET /api/products/subcategories` - Get subcategories

**If you're getting "Not authorized" error on these endpoints, try:**
1. **Clear Cookies in Postman:**
   - Go to Postman Settings → General
   - Click "Clear Cookies" or disable "Automatically follow redirects"
   - Or manually delete cookies: Click the "Cookies" link below the URL bar

2. **Check Request Headers:**
   - Make sure you're NOT sending any `Authorization` header
   - Make sure you're NOT sending any `Cookie` header manually

3. **Verify the URL:**
   - Correct: `http://localhost:5000/api/products?page=1&limit=12`
   - Make sure there are no typos

4. **Test with a fresh request:**
   - Create a new request in Postman
   - Don't copy from a previous authenticated request
   - Make sure no environment variables are setting auth headers

---

## Test User Credentials

**Default Password for ALL users:** `Password123!`

### Admin User (for admin endpoints):
- **Email:** `admin@ecommerce.com`
- **Password:** `Password123!`
- **Role:** admin

### Regular Users (for testing protected user endpoints):
- **Email:** `john.smith@email.com`
- **Password:** `Password123!`
- **Role:** user

Other test users (all with password `Password123!`):
- `sarah.johnson@email.com`
- `michael.brown@email.com`
- `emily.davis@email.com`
- `david.wilson@email.com`
- `jessica.martinez@email.com`
- `robert.taylor@email.com`
- `amanda.anderson@email.com`
- `james.thomas@email.com`

---

## Table of Contents
1. [Public Endpoints](#public-endpoints)
2. [Protected Endpoints (Admin Only)](#protected-endpoints-admin-only)
3. [Authentication](#authentication)

---

## Public Endpoints

### 1. Get All Products
Get a paginated list of products with optional filtering, sorting, and search.

**Endpoint:** `GET /api/products`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `limit` | integer | No | 12 | Items per page |
| `category` | integer | No | null | Filter by category ID |
| `subcategory` | integer | No | null | Filter by subcategory ID |
| `childCategory` | integer | No | null | Filter by child category ID |
| `minPrice` | float | No | null | Minimum price filter |
| `maxPrice` | float | No | null | Maximum price filter |
| `search` | string | No | null | Search in product name/description |
| `sortBy` | string | No | 'created_at' | Sort field (created_at, name, price, rating, stock) |
| `sortOrder` | string | No | 'DESC' | Sort order (ASC or DESC) |

**Example Request:**
```
GET http://localhost:5000/api/products?page=1&limit=12&sortBy=price&sortOrder=ASC
```

**Example Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": "99.99",
      "stock": 50,
      "rating": "4.50",
      "num_reviews": 10,
      "discount_type": null,
      "discount_value": null,
      "discount_start_date": null,
      "discount_end_date": null,
      "is_on_clearance": false,
      "discounted_price": 99.99,
      "has_discount": false,
      "category_id": 1,
      "category_name": "Technology",
      "subcategory_id": 1,
      "subcategory_name": "Smartphones",
      "child_category_id": 1,
      "child_category_name": "iPhone & iOS Devices",
      "images": [
        {
          "id": 1,
          "product_id": 1,
          "image_url": "/uploads/images/product-123.jpg",
          "is_primary": true
        }
      ],
      "created_at": "2024-12-19T10:00:00.000Z",
      "updated_at": "2024-12-19T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

---

### 2. Get Single Product
Get detailed information about a specific product including images and videos.

**Endpoint:** `GET /api/products/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

**Example Request:**
```
GET http://localhost:5000/api/products/1
```

**Example Response:**
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "price": "99.99",
  "stock": 50,
  "rating": "4.50",
  "num_reviews": 10,
  "discount_type": null,
  "discount_value": null,
  "discount_start_date": null,
  "discount_end_date": null,
  "is_on_clearance": false,
  "discounted_price": 99.99,
  "has_discount": false,
  "category_id": 1,
  "category_name": "Technology",
  "subcategory_id": 1,
  "subcategory_name": "Smartphones",
  "child_category_id": 1,
  "child_category_name": "iPhone & iOS Devices",
  "images": [
    {
      "id": 1,
      "product_id": 1,
      "image_url": "/uploads/images/product-123.jpg",
      "is_primary": true
    }
  ],
  "videos": [],
  "created_at": "2024-12-19T10:00:00.000Z",
  "updated_at": "2024-12-19T10:00:00.000Z"
}
```

---

### 3. Get Clearance Products
Get all products currently on clearance (with active discounts).

**Endpoint:** `GET /api/products/clearance`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `limit` | integer | No | 12 | Items per page |
| `sortBy` | string | No | 'created_at' | Sort field (created_at, name, price, rating, stock) |
| `sortOrder` | string | No | 'DESC' | Sort order (ASC or DESC) |

**Example Request:**
```
GET http://localhost:5000/api/products/clearance?page=1&limit=12
```

**Example Response:**
Same structure as "Get All Products" but only includes products with active discounts.

---

### 4. Get All Categories
Get all categories with their nested subcategories and child categories (3-level hierarchy).

**Endpoint:** `GET /api/products/categories`

**Example Request:**
```
GET http://localhost:5000/api/products/categories
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Technology",
    "description": "Technology products",
    "subcategories": [
      {
        "id": 1,
        "name": "Smartphones",
        "description": "Smartphone products",
        "child_categories": [
          {
            "id": 1,
            "name": "iPhone & iOS Devices",
            "description": "Apple iOS devices"
          }
        ]
      }
    ]
  }
]
```

---

### 5. Get All Subcategories
Get all subcategories with their parent category information.

**Endpoint:** `GET /api/products/subcategories`

**Example Request:**
```
GET http://localhost:5000/api/products/subcategories
```

**Example Response:**
```json
[
  {
    "id": 1,
    "category_id": 1,
    "name": "Smartphones",
    "description": "Smartphone products",
    "category_name": "Technology",
    "created_at": "2024-12-19T10:00:00.000Z",
    "updated_at": "2024-12-19T10:00:00.000Z"
  }
]
```

---

### 6. Get Subcategories by Category
Get all subcategories for a specific category.

**Endpoint:** `GET /api/products/subcategories/:categoryId`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categoryId` | integer | Yes | Category ID |

**Example Request:**
```
GET http://localhost:5000/api/products/subcategories/1
```

**Example Response:**
```json
[
  {
    "id": 1,
    "category_id": 1,
    "name": "Smartphones",
    "description": "Smartphone products",
    "created_at": "2024-12-19T10:00:00.000Z",
    "updated_at": "2024-12-19T10:00:00.000Z"
  }
]
```

---

## Protected Endpoints (Admin Only)

**Note:** All protected endpoints require authentication via HTTP-only cookies (accessToken). You must be logged in as an admin user.

### 7. Create Product
Create a new product (Admin only).

**Endpoint:** `POST /api/products`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description here",
  "price": 99.99,
  "child_category_id": 1,
  "stock": 50,
  "discount_type": "percentage",
  "discount_value": 10,
  "discount_start_date": "2024-12-20T00:00:00.000Z",
  "discount_end_date": "2024-12-31T23:59:59.000Z",
  "is_on_clearance": false
}
```

**Required Fields:**
- `name` (string)
- `description` (string)
- `price` (number)
- `child_category_id` (integer)
- `stock` (integer)

**Optional Fields:**
- `discount_type` (string: "percentage" or "fixed")
- `discount_value` (number)
- `discount_start_date` (ISO datetime string)
- `discount_end_date` (ISO datetime string)
- `is_on_clearance` (boolean)

**Example Request:**
```
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "iPhone 16 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "child_category_id": 1,
  "stock": 25
}
```

**Example Response:**
```json
{
  "id": 1,
  "name": "iPhone 16 Pro",
  "description": "Latest iPhone with advanced features",
  "price": "999.99",
  "stock": 25,
  "rating": "0.00",
  "num_reviews": 0,
  "discount_type": null,
  "discount_value": null,
  "discount_start_date": null,
  "discount_end_date": null,
  "is_on_clearance": false,
  "created_at": "2024-12-19T10:00:00.000Z",
  "updated_at": "2024-12-19T10:00:00.000Z"
}
```

---

### 8. Update Product
Update an existing product (Admin only).

**Endpoint:** `PUT /api/products/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

**Headers:**
```
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 89.99,
  "child_category_id": 2,
  "stock": 30,
  "discount_type": "percentage",
  "discount_value": 15,
  "discount_start_date": "2024-12-20T00:00:00.000Z",
  "discount_end_date": "2024-12-31T23:59:59.000Z",
  "is_on_clearance": true
}
```

**Example Request:**
```
PUT http://localhost:5000/api/products/1
Content-Type: application/json

{
  "price": 89.99,
  "stock": 30
}
```

**Example Response:**
Returns the updated product object (same structure as Get Single Product).

---

### 9. Delete Product
Delete a product (Admin only).

**Endpoint:** `DELETE /api/products/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

**Example Request:**
```
DELETE http://localhost:5000/api/products/1
```

**Example Response:**
```json
{
  "message": "Product deleted successfully"
}
```

---

### 10. Upload Product Images
Upload one or multiple images for a product (Admin only).

**Endpoint:** `POST /api/products/:id/images`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `images` | file[] | Yes | Image files (max 10, jpeg/jpg/png/gif/webp, max 5MB each) |

**Example Request (Postman):**
1. Select POST method
2. URL: `http://localhost:5000/api/products/1/images`
3. Go to Body tab
4. Select "form-data"
5. Add key "images" with type "File"
6. Select one or more image files
7. Send request

**Example Response:**
```json
{
  "message": "Images uploaded successfully",
  "images": [
    "/uploads/images/product-1234567890-123456789.jpg",
    "/uploads/images/product-1234567890-123456790.jpg"
  ]
}
```

---

### 11. Upload Product Video
Upload a video for a product (Admin only, optional feature).

**Endpoint:** `POST /api/products/:id/videos`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `video` | file | Yes | Video file (mp4/webm/ogg/mov, max 100MB) |
| `title` | string | No | Video title |
| `description` | string | No | Video description |
| `thumbnail_url` | string | No | Thumbnail image URL |
| `duration` | integer | No | Video duration in seconds |

**Example Request (Postman):**
1. Select POST method
2. URL: `http://localhost:5000/api/products/1/videos`
3. Go to Body tab
4. Select "form-data"
5. Add key "video" with type "File", select video file
6. (Optional) Add key "title" with type "Text", enter video title
7. (Optional) Add key "description" with type "Text", enter description
8. Send request

**Example Response:**
```json
{
  "message": "Video uploaded successfully",
  "video": "/uploads/videos/product-1234567890-123456789.mp4"
}
```

---

## Test User Credentials

**Default Password for ALL users:** `Password123!`

### Admin User (for admin endpoints):
- **Email:** `admin@ecommerce.com`
- **Password:** `Password123!`
- **Role:** admin

### Regular Users (for testing protected user endpoints):
- **Email:** `john.smith@email.com`
- **Password:** `Password123!`
- **Role:** user

Other test users (all with password `Password123!`):
- `sarah.johnson@email.com`
- `michael.brown@email.com`
- `emily.davis@email.com`
- `david.wilson@email.com`
- `jessica.martinez@email.com`
- `robert.taylor@email.com`
- `amanda.anderson@email.com`
- `james.thomas@email.com`

---

## Authentication

### How to Authenticate in Postman

1. **Login First:**
   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json
   
   {
     "email": "admin@example.com",
     "password": "yourpassword"
   }
   ```

2. **Enable Cookie Handling:**
   - In Postman, go to Settings → General
   - Enable "Automatically follow redirects"
   - Enable "Send cookies"

3. **For Admin Endpoints:**
   - Make sure you're logged in as a user with `role: "admin"`
   - Postman will automatically send the HTTP-only cookie with subsequent requests

### Alternative: Manual Cookie Setup

If automatic cookie handling doesn't work:

1. After login, check the response headers for `Set-Cookie`
2. Copy the cookie value
3. In your request, go to Headers tab
4. Add header:
   ```
   Cookie: accessToken=your_token_here; refreshToken=your_refresh_token_here
   ```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "All required fields are missing"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to fetch products",
  "error": "Error stack trace (development only)"
}
```

---

## Notes

- All prices are returned as strings in decimal format
- Dates are returned in ISO 8601 format
- Image and video URLs are relative paths (e.g., `/uploads/images/filename.jpg`)
- To access uploaded files, use: `http://localhost:5000/uploads/images/filename.jpg`
- Pagination starts at page 1
- Maximum 10 images can be uploaded per request
- Video file size limit: 100MB
- Image file size limit: 5MB per file

---

## Testing Tips for Postman

1. **Start with Public Endpoints:** Test GET endpoints first (no authentication needed)
2. **Test Authentication:** Login and verify cookies are set
3. **Test Admin Endpoints:** Use admin credentials to test protected endpoints
4. **Use Environment Variables:** Create a Postman environment with:
   - `base_url`: `http://localhost:5000/api`
   - `product_id`: `1` (for testing)
5. **Save Requests:** Create a Postman collection for easy testing

---

**Last Updated:** 2024-12-19  
**Author:** Thang Truong

