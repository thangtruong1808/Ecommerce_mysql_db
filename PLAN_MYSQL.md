# Ecommerce Full-Stack Development Plan (MySQL Version)

## Project Overview
Build a production-ready ecommerce platform showcasing both frontend (React + Tailwind CSS) and backend (Express.js) skills. The application will demonstrate real-world patterns, best practices, and comprehensive feature implementation.

## Technology Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Axios for API calls
- React Hook Form for form handling
- React Toastify for notifications

**Backend:**
- Express.js REST API
- **MySQL** with mysql2 (replacing MongoDB/Mongoose)
- JWT for authentication (access token + refresh token)
- HTTP-only cookies for token storage (secure, httpOnly, sameSite)
- bcryptjs for password hashing
- cookie-parser for cookie handling
- Multer for file uploads
- Express Validator for input validation
- dotenv for environment variables
- Nodemailer for sending invoice emails
- PDF generation library (pdfkit or puppeteer) for invoices

## Database Schema

The MySQL database schema has been created in `database/schema.sql`. Key tables include:

- **users** - User accounts with authentication and role-based access (user/admin)
- **refresh_tokens** - Refresh tokens for JWT authentication (stored in HTTP cookies)
- **categories** - Top-level product categories
- **subcategories** - Subcategories that belong to categories (category → subcategory → product hierarchy)
- **products** - Product information with ratings (belongs to subcategories)
- **product_images** - Multiple images per product
- **product_videos** - Videos for products (optional)
- **user_addresses** - Shipping addresses
- **carts** - Shopping carts (one per user)
- **cart_items** - Items in shopping carts
- **orders** - Order information
- **order_items** - Items in each order (with snapshots)
- **shipping_addresses** - Shipping info per order
- **invoices** - Invoices generated when payment is made
- **reviews** - Product reviews and ratings

The schema includes:
- Foreign key constraints
- Indexes for performance
- Triggers to auto-update product ratings
- Fulltext search on products
- Unique constraints where needed

See `database/schema.sql` and `database/README.md` for full details.

## Phase 1: Database & Authentication Foundation

### Backend Setup
- **Database Connection** (`backend/config/db.js`):
  - MySQL connection using mysql2
  - Connection pooling
  - Error handling

- **Database Models/Queries** (`backend/models/`):
  - `userModel.js` - User queries (create, find, update)
  - `refreshTokenModel.js` - Refresh token queries (create, find, delete, cleanup expired)
  - `categoryModel.js` - Category queries
  - `subcategoryModel.js` - Subcategory queries (get by category, create, update, delete)
  - `productModel.js` - Product queries with joins (includes subcategory and category)
  - `cartModel.js` - Cart and cart item queries
  - `orderModel.js` - Order queries with joins
  - `invoiceModel.js` - Invoice queries and generation
  - `reviewModel.js` - Review queries

- **Authentication** (`backend/routes/authRoutes.js`, `backend/middleware/authMiddleware.js`):
  - POST `/api/auth/register` - User registration
    - Creates user account
    - Generates access token (short-lived, 15min) and refresh token (long-lived, 7 days)
    - Sets both tokens as HTTP-only cookies
    - Returns user data (no tokens in response body)
  - POST `/api/auth/login` - User login
    - Validates credentials
    - Generates access token and refresh token
    - Sets both tokens as HTTP-only cookies
    - Returns user data (no tokens in response body)
  - POST `/api/auth/refresh` - Refresh access token
    - Validates refresh token from cookie
    - Generates new access token
    - Sets new access token as HTTP-only cookie
    - Returns success status
  - POST `/api/auth/logout` - User logout
    - Invalidates refresh token in database
    - Clears both token cookies
    - Returns success status
  - GET `/api/auth/profile` - Get current user (protected)
    - Validates access token from cookie
    - Returns user profile
  - PUT `/api/auth/profile` - Update user profile (protected)
    - Validates access token from cookie
    - Updates user data
  - JWT middleware for protecting routes (reads access token from cookie)
  - Admin role middleware
  - Refresh token stored in database for revocation
  - Token rotation on refresh for security (check user.role === 'admin')
  - Role-based route protection

### Frontend Authentication
- **Auth Context** (`frontend/src/context/AuthContext.jsx`):
  - Global auth state management
  - Login, register, logout functions
  - Automatic token refresh on API calls
  - Protected route wrapper component
  - Axios interceptor for handling token refresh
  - Cookies automatically sent with requests (credentials: 'include')

- **Auth Pages** (`frontend/src/pages/`):
  - `Login.jsx` - Login form with validation
  - `Register.jsx` - Registration form
  - `Profile.jsx` - User profile management

## Phase 2: Product Management

### Backend Product Features
- **Enhanced Product Routes** (`backend/routes/productRoutes.js`):
  - GET `/api/products` - Get all products (with pagination, filtering, sorting, search using MySQL queries)
  - GET `/api/products/:id` - Get single product with reviews (JOIN queries with subcategory and category)
  - POST `/api/products` - Create product (admin only, requires subcategory_id)
  - PUT `/api/products/:id` - Update product (admin only)
  - DELETE `/api/products/:id` - Delete product (admin only)
  - GET `/api/products/categories` - Get all categories with their subcategories
  - GET `/api/products/subcategories` - Get all subcategories
  - GET `/api/products/subcategories/:categoryId` - Get subcategories by category ID

- **Product Controllers** (`backend/controllers/productController.js`):
  - Business logic separation
  - Error handling
  - MySQL query building for filters
  - JOIN queries to include category and subcategory information

- **File Upload** (`backend/middleware/uploadMiddleware.js`):
  - Multer configuration for product images and videos
  - Image/video validation and storage
  - POST `/api/products/:id/upload` - Upload product images
  - POST `/api/products/:id/videos` - Upload product videos (OPTIONAL - not required)
  - Store image URLs in product_images table
  - Store video URLs in product_videos table (videos are optional, products can exist without videos)

### Frontend Product Features
- **Product Pages**:
  - Enhanced `Products.jsx` - Product listing with:
    - Search functionality (using MySQL FULLTEXT search)
    - Category filters (top-level)
    - Subcategory filters (filtered by selected category)
    - Price range filters
    - Sort options (price, name, newest)
    - Pagination
    - Loading states
  - Enhanced `ProductDetail.jsx` - Product details with:
    - Image gallery (from product_images table)
    - Video player (from product_videos table, OPTIONAL - only display if videos exist)
    - Add to cart functionality
    - Stock availability
    - Related products section

- **Components**:
  - `ProductCard.jsx` - Reusable product card component (shows category and subcategory)
  - `SearchBar.jsx` - Search input component
  - `FilterSidebar.jsx` - Filter panel component (category and subcategory filters)
  - `CategoryFilter.jsx` - Category selection component
  - `SubcategoryFilter.jsx` - Subcategory selection component (depends on category)
  - `Pagination.jsx` - Pagination component
  - `ImageGallery.jsx` - Product image carousel
  - `VideoPlayer.jsx` - Product video player component

## Phase 3: Shopping Cart & Checkout

### Backend Cart Features
- **Cart Routes** (`backend/routes/cartRoutes.js`):
  - GET `/api/cart` - Get user's cart with items (JOIN with products)
  - POST `/api/cart` - Add item to cart (protected)
  - PUT `/api/cart/:itemId` - Update cart item quantity (protected)
  - DELETE `/api/cart/:itemId` - Remove item from cart (protected)
  - DELETE `/api/cart` - Clear cart (protected)

- **Cart Model** (`backend/models/cartModel.js`):
  - MySQL queries for cart operations
  - Handle cart creation if doesn't exist
  - Join with products for full item details

### Frontend Cart Features
- **Cart Context** (`frontend/src/context/CartContext.jsx`):
  - Cart state management
  - Add, remove, update quantity functions
  - Calculate totals

- **Cart Pages**:
  - Enhanced `Cart.jsx` - Shopping cart with:
    - Item list with quantity controls
    - Price calculations
    - Remove items
    - Proceed to checkout button
  - `Checkout.jsx` - Checkout process:
    - Shipping address form
    - Order summary
    - Payment method selection (mock)
    - Place order functionality

- **Components**:
  - `CartItem.jsx` - Individual cart item component
  - `OrderSummary.jsx` - Order totals component
  - `AddressForm.jsx` - Shipping address form

## Phase 4: Orders & Order Management

### Backend Order Features
- **Order Routes** (`backend/routes/orderRoutes.js`):
  - POST `/api/orders` - Create new order (protected)
    - Create order record
    - Create order_items (with product snapshots)
    - Create shipping_address
    - Update product stock
    - Clear user's cart
  - GET `/api/orders` - Get user's orders (protected, JOIN queries)
  - GET `/api/orders/:id` - Get order details (protected, multiple JOINs)
  - PUT `/api/orders/:id/pay` - Update order payment status (protected, mock)
    - Update order payment status
    - Generate invoice automatically
    - Send invoice email to buyer
    - Create invoice record in invoices table
  - GET `/api/orders/admin/all` - Get all orders (admin only)
  - PUT `/api/orders/:id/deliver` - Mark order as delivered (admin only)

- **Order Controllers** (`backend/controllers/orderController.js`):
  - Order creation logic with transactions
  - Stock validation
  - Order status management
  - Use MySQL transactions for data integrity

- **Invoice System** (`backend/routes/invoiceRoutes.js`, `backend/controllers/invoiceController.js`):
  - GET `/api/invoices` - Get user's invoices (protected)
  - GET `/api/invoices/:id` - Get invoice details (protected)
  - GET `/api/invoices/:id/pdf` - Download invoice PDF (protected)
  - POST `/api/invoices/:id/resend-email` - Resend invoice email (protected)
  - Automatic invoice generation on payment
  - PDF generation using library (e.g., pdfkit, puppeteer)
  - Email sending using nodemailer
  - Invoice number generation using database function

### Frontend Order Features
- **Order Pages**:
  - `OrderHistory.jsx` - List of user's past orders
  - `OrderDetails.jsx` - Detailed order view with status
  - `OrderConfirmation.jsx` - Order success page

- **Invoice Pages**:
  - `InvoiceList.jsx` - List of user's invoices
  - `InvoiceDetail.jsx` - Invoice details with download option

- **Components**:
  - `OrderCard.jsx` - Order list item component
  - `OrderStatus.jsx` - Order status indicator
  - `InvoiceCard.jsx` - Invoice list item component
  - `InvoiceView.jsx` - Invoice display component

## Phase 5: Reviews & Ratings

### Backend Review Features
- **Review Routes** (`backend/routes/reviewRoutes.js`):
  - POST `/api/products/:id/reviews` - Create review (protected, only for purchased products)
    - Check if user has purchased product
    - Insert review
    - Trigger will auto-update product rating
  - GET `/api/products/:id/reviews` - Get product reviews (JOIN with users)
  - PUT `/api/reviews/:id` - Update review (protected, own review only)
  - DELETE `/api/reviews/:id` - Delete review (protected, own review or admin)
    - Trigger will auto-update product rating

### Frontend Review Features
- **Review Components**:
  - `ReviewForm.jsx` - Review submission form
  - `ReviewList.jsx` - Display product reviews
  - `ReviewItem.jsx` - Individual review component
  - `StarRating.jsx` - Star rating display/input

- **Integration**:
  - Add reviews section to `ProductDetail.jsx`
  - Show average rating on product cards

## Phase 6: Admin Dashboard

### Backend Admin Features
- **Admin Routes** (`backend/routes/adminRoutes.js`):
  - All routes protected with admin middleware (role === 'admin')
  - GET `/api/admin/stats` - Dashboard statistics (aggregate queries)
    - Total sales, orders, users, products
    - Recent orders
    - Low stock products
  - GET `/api/admin/users` - Get all users (with pagination)
  - PUT `/api/admin/users/:id` - Update user (role, status)
  - DELETE `/api/admin/users/:id` - Delete user
  - GET `/api/admin/orders` - All orders with filters (complex JOINs)
  - GET `/api/admin/products` - All products with admin controls
  - GET `/api/admin/invoices` - All invoices with filters

### Frontend Admin Dashboard
- **Admin Pages** (`frontend/src/pages/admin/`):
  - All pages protected with admin-only route wrapper
  - `Dashboard.jsx` - Admin overview with:
    - Sales statistics
    - Recent orders
    - Low stock alerts
    - User count
  - `ProductManagement.jsx` - CRUD operations for products (admin only)
  - `OrderManagement.jsx` - Manage all orders (admin only)
  - `UserManagement.jsx` - Manage users (admin only)
  - `InvoiceManagement.jsx` - View all invoices (admin only)

- **Components**:
  - `AdminLayout.jsx` - Admin navigation layout
  - `StatsCard.jsx` - Statistics display component
  - `ProductForm.jsx` - Create/edit product form with image upload

## Phase 7: UI/UX Enhancements

### Frontend Improvements
- **Loading States**:
  - Skeleton loaders for products
  - Loading spinners
  - Progress indicators

- **Error Handling**:
  - Error boundaries
  - Error toast notifications
  - 404 page
  - Form validation feedback

- **Responsive Design**:
  - Mobile-first approach
  - Tablet and desktop breakpoints
  - Hamburger menu for mobile
  - Touch-friendly interactions

- **Performance**:
  - Image lazy loading
  - Code splitting
  - Optimistic UI updates
  - Debounced search

- **Components**:
  - `LoadingSpinner.jsx` - Reusable loading component
  - `ErrorMessage.jsx` - Error display component
  - `Modal.jsx` - Reusable modal component
  - `Toast.jsx` - Toast notification component
  - `Footer.jsx` - Site footer

## Phase 8: Additional Features

### Backend Enhancements
- **Validation** (`backend/middleware/validationMiddleware.js`):
  - Input validation using express-validator
  - Sanitization
  - Custom validation rules

- **Error Handling**:
  - Custom error classes
  - Centralized error handler
  - Error logging

- **Security**:
  - Rate limiting
  - Helmet.js for security headers
  - CORS configuration
  - Input sanitization
  - SQL injection prevention (using parameterized queries)

### Frontend Enhancements
- **State Management**:
  - Context API for global state
  - Local storage for cart persistence
  - Optimistic updates

- **User Experience**:
  - Wishlist functionality
  - Product comparison
  - Recently viewed products
  - Breadcrumb navigation

## Phase 9: Invoice System

### Backend Invoice Features
- **Invoice Generation**:
  - Automatic invoice creation when order payment is confirmed
  - Invoice number generation using database function (INV-YYYYMMDD-XXXXX format)
  - PDF generation for invoices
  - Email sending with invoice attachment
  - Invoice storage and retrieval

- **Invoice Routes** (`backend/routes/invoiceRoutes.js`):
  - GET `/api/invoices` - Get user's invoices (protected)
  - GET `/api/invoices/:id` - Get invoice details (protected)
  - GET `/api/invoices/:id/pdf` - Download invoice PDF (protected)
  - POST `/api/invoices/:id/resend-email` - Resend invoice email (protected)

- **Email Service** (`backend/services/emailService.js`):
  - Configure nodemailer
  - Invoice email template
  - PDF attachment handling
  - Email sending with error handling

### Frontend Invoice Features
- **Invoice Pages**:
  - `InvoiceList.jsx` - Display user's invoices
  - `InvoiceDetail.jsx` - View invoice details and download PDF

- **Components**:
  - `InvoiceCard.jsx` - Invoice list item
  - `InvoiceView.jsx` - Invoice display with download button

## Phase 10: Product Videos (Optional Feature)

### Backend Video Features
- **Note**: Videos are OPTIONAL - products can exist without videos
- **Video Routes** (`backend/routes/videoRoutes.js`):
  - POST `/api/products/:id/videos` - Upload product video (admin only, optional)
  - GET `/api/products/:id/videos` - Get product videos (returns empty array if none exist)
  - DELETE `/api/videos/:id` - Delete video (admin only)
  - PUT `/api/videos/:id` - Update video info (admin only)
- **Implementation Notes**:
  - Products do not require videos to be created
  - Video queries should handle cases where no videos exist (LEFT JOIN or separate query)
  - Video upload is completely optional

### Frontend Video Features
- **Video Components**:
  - `VideoPlayer.jsx` - Video player component (only render if videos exist)
  - `VideoUpload.jsx` - Video upload form (admin only, optional feature)
  - Integration in `ProductDetail.jsx` to conditionally display videos
  - Check if videos array exists and has length before rendering video section

## File Structure

```
Ecommerce/
├── database/
│   ├── schema.sql          # MySQL database schema
│   └── README.md           # Schema documentation
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   ├── context/           # Context providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   ├── services/          # API service functions
│   │   └── App.jsx
│   └── public/                # Static assets
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection
│   ├── models/                # MySQL query models
│   ├── routes/                # API routes
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validationMiddleware.js
│   ├── utils/                 # Utility functions
│   └── server.js
└── README.md
```

## Key MySQL Implementation Details

### Database Connection
- Use `mysql2` package with promises
- Connection pooling for performance
- Environment variables for credentials

### Query Patterns
- Use parameterized queries to prevent SQL injection
- JOIN queries for related data (products with categories, orders with items)
- Transactions for order creation (atomicity)
- Aggregate queries for statistics
- FULLTEXT search for product search

### Model Structure
- Each model file contains related query functions
- Functions return promises
- Error handling in each function
- Use async/await pattern

### Authentication Flow
- **Access Token**: Short-lived (15 minutes), stored in HTTP-only cookie
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie and database
- **Token Refresh**: Client calls `/api/auth/refresh` when access token expires
- **Security**: 
  - HTTP-only cookies prevent XSS attacks
  - SameSite attribute prevents CSRF attacks
  - Refresh tokens can be revoked from database
  - Token rotation on refresh

### Example Model Pattern
```javascript
// backend/models/userModel.js
import db from '../config/db.js'

export const createUser = async (name, email, hashedPassword) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  )
  return result.insertId
}

export const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )
  return rows[0]
}
```

## Implementation Priority

1. **Phase 1** - Foundation (Database, Auth) - Critical
2. **Phase 2** - Products (Enhanced features) - Critical
3. **Phase 3** - Cart & Checkout - Critical
4. **Phase 4** - Orders - Critical
5. **Phase 9** - Invoice System - Critical (when payment is made)
6. **Phase 5** - Reviews - Important
7. **Phase 6** - Admin Dashboard - Important (role-based access)
8. **Phase 10** - Product Videos - Important
9. **Phase 7** - UI/UX Polish - Important
10. **Phase 8** - Additional Features - Nice to have

## Success Metrics

- Complete user authentication flow with access token and refresh token
- Tokens stored in HTTP-only cookies (secure, httpOnly, sameSite)
- Automatic token refresh mechanism
- Token rotation on refresh for enhanced security
- Full product CRUD with search/filter
- Functional shopping cart and checkout
- Order management system
- Admin dashboard with statistics (role-based access)
- Invoice generation and email delivery
- Product videos support (optional - products can exist without videos)
- Responsive, polished UI
- Clean, maintainable code structure
- Proper error handling throughout
- Security best practices implemented (XSS and CSRF protection via cookies)
- SQL injection prevention
- Efficient database queries with proper indexing
- Role-based access control (admin vs user)

