# Ecommerce Full-Stack Application

A full-stack ecommerce application built with React (Tailwind CSS) and Express.js.

## Project Structure

```
Ecommerce/
├── frontend/          # React application with Tailwind CSS
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles with Tailwind
│   ├── package.json
│   └── vite.config.js
├── backend/           # Express.js API server
│   ├── routes/        # API routes
│   ├── models/        # Database models (when added)
│   ├── controllers/   # Route controllers (when added)
│   ├── middleware/    # Custom middleware (when added)
│   ├── server.js      # Express server entry point
│   └── package.json
├── package.json       # Root package.json with dev scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install all dependencies (root, frontend, and backend):
```bash
npm run install:all
```

Or install manually:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Running the Application

Start both frontend and backend servers with one command:

```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:3000`
- Backend API on `http://localhost:5000`

### Individual Commands

- Frontend only: `npm run dev:frontend`
- Backend only: `npm run dev:backend`
- Build frontend: `npm run build`

## Features

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Responsive design

### Backend
- Express.js REST API
- CORS enabled
- Product routes with CRUD operations
- Error handling middleware
- Environment variable support

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Next Steps

- Add MongoDB/Mongoose for database
- Implement user authentication
- Add shopping cart functionality
- Implement payment processing
- Add product images
- Add order management
- Add admin dashboard

## License

ISC

