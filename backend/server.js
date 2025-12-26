/**
 * Express Server
 * Main server file for the ecommerce backend API
 * @author Thang Truong
 * @date 2025-12-17
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import voucherRoutes from "./routes/voucherRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subcategoryRoutes from "./routes/subcategoryRoutes.js";
import childCategoryRoutes from "./routes/childCategoryRoutes.js";
import cartAdminRoutes from "./routes/cartAdminRoutes.js";
import productViewRoutes from "./routes/productViewRoutes.js";

// Load environment variables from root .env file
// Note: db.js also loads dotenv, but we load it here too for other modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env");

// Load .env file and verify it was loaded
const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
  // .env file not found - using environment variables or defaults
}

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting - more lenient for normal usage
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration for cookies
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true, // Allow cookies
};

// Middleware
app.use(helmet()); // Security headers
app.use(limiter); // Apply rate limiting
app.use(cors(corsOptions)); // Enable CORS
app.use(cookieParser()); // Parse cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", reviewRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", commentRoutes);
app.use("/api", likeRoutes);
app.use("/api", voucherRoutes);
app.use("/api/admin", mediaRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/subcategories", subcategoryRoutes);
app.use("/api/admin/child-categories", childCategoryRoutes);
app.use("/api/admin/carts", cartAdminRoutes);
app.use("/api/product-views", productViewRoutes);

/**
 * Health check endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @author Thang Truong
 * @date 2025-12-17
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

/**
 * Error handling middleware
 * Handles all unhandled errors and returns appropriate error response
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @author Thang Truong
 * @date 2025-12-17
 */
app.use((err, req, res, next) => {
  // Error handled by error response
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => {
  // Server started successfully
});
