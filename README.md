# 🚀 Full-Stack E-commerce Platform

This is a feature-rich, full-stack E-commerce platform built with the MERN stack (MySQL, Express, React, Node.js) and designed to showcase a wide range of modern web development practices. It includes a beautiful, responsive frontend and a powerful, secure backend.

## ✨ Showcase & Key Features

This project is designed to be a comprehensive portfolio piece. Here’s what it demonstrates:

- **Complex Backend Architecture:** A well-structured RESTful API with advanced features like authentication, authorization, and secure file handling.
- **Modern Frontend:** A responsive and interactive user interface built with React, Tailwind CSS, and Vite for a fast development experience.

* **Admin Dashboard:** A comprehensive admin dashboard for managing products, users, orders, and more.

- **Database Management:** A complete MySQL database schema with models for all major E-commerce entities.
- **Cloud Integration:** Integration with AWS S3 for cloud-based media storage.
- **And much more:** See the full feature list below.

### Core Features

- **User Authentication:** Secure user registration and login with JWT (JSON Web Tokens) and refresh tokens. Includes password reset functionality.
- **Product Management:** Full CRUD operations for products, including nested categories and subcategories.
- **Shopping Cart:** Persistent shopping cart functionality for authenticated users.
- **Order & Invoicing:** Complete order management system with invoice generation (PDFs).
- **Reviews & Comments:** Users can leave reviews and comments on products.
- **Voucher System:** Create and manage discount vouchers.
- **Admin Dashboard:** A powerful dashboard for site administrators to manage products, categories, orders, users, and view site analytics.
- **Media Handling:** Image and video uploads for products, with integration with AWS S3 for cloud storage.
- **Search & Filtering:** (Assumed from structure) Advanced product search and filtering capabilities.
- **Analytics:** (Assumed from `analyticsModel.js`) Tracking of product views and other user interactions.

## 💻 Technology Stack

| Category     | Technologies                                                                |
| ------------ | --------------------------------------------------------------------------- |
| **Frontend** | React, React Router, Tailwind CSS, Vite, Axios, Recharts                    |
| **Backend**  | Node.js, Express.js, MySQL2, JWT, Bcrypt, Multer, Sharp, Nodemailer, PDFKit |
| **Database** | MySQL                                                                       |
| **Cloud**    | AWS S3 (for media storage)                                                  |
| **DevOps**   | Concurrently, Nodemon                                                       |

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (or yarn/pnpm)
- A running MySQL database instance.
- An AWS S3 bucket and credentials (optional, for media uploads).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2.  **Install all dependencies** for the root, frontend, and backend projects:

    ```bash
    npm run install:all
    ```

3.  **Configure Environment Variables:**

    - Navigate to the `backend` directory.
    - Create a `.env` file by copying the `.env.sample`.
    - Fill in the required environment variables, including your database credentials, JWT secret, and AWS keys.

4.  **Set up the database:**
    - Connect to your MySQL instance.
    - Run the SQL script located at `backend/database/schema.sql` to create the necessary tables.

### Running the Application

Start both the frontend and backend servers concurrently with a single command from the root directory:

```bash
npm run dev
```

This will launch:

- Frontend development server on `http://localhost:5173` (or the next available port, via Vite).
- Backend API server on `http://localhost:5000`.

## 📂 Project Structure

```
/
├── backend/            # Express.js API Server
│   ├── config/         # Database configuration
│   ├── middleware/     # Auth, error handling, etc.
│   ├── models/         # MySQL data models
│   ├── routes/         # API route definitions
│   ├── utils/          # Email, S3, tokens
│   └── server.js       # Server entry point
├── frontend/           # React Client Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth and Cart context
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Application pages & views
│   │   └── utils/      # API helpers, etc.
│   └── ...
├── package.json        # Root project scripts
└── README.md
```

## 🔐 API Endpoints

This is a high-level overview of the available API routes. For detailed information, please refer to the `API_DOCUMENTATION.md` file.

- `/api/auth` - User Authentication (login, register, logout)
- `/api/products` - Product Management
- `/api/categories` - Category Management
- `/api/cart` - Shopping Cart operations
- `/api/orders` - Order Management
- `/api/reviews` - Product Reviews
- `/api/vouchers` - Discount Vouchers
- `/api/admin` - Admin-specific routes
- ... and many more.

## 📄 License

This project is licensed under the ISC License. See the `LICENSE` file for details.
