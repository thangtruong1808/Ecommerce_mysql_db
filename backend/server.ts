/**
 * Express Server
 * Main server file for the ecommerce backend API
 * @author Thang Truong
 * @date 2025-12-17
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnv } from "./config/loadEnv.js";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
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
import shippingRoutes from "./routes/shippingRoutes.js";

// Load backend/.env. db.js loads the same file first, before other imports read process.env.
// Walking upward also finds it when this file is running from dist/.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envResult = loadEnv(__dirname);
if (envResult.error) {
  console.warn("backend/.env was not found, using environment variables or defaults");
}
console.log("Environment variables loaded successfully.");

// Connect to database
connectDB();
console.log("Database connected successfully.");

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting - more lenient for normal usage
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS: allow FRONTEND_URL and CORS_EXTRA_ORIGINS as comma-separated lists (apex + www, staging, etc.)
function parseAllowedOrigins(...sources: Array<string | undefined>): string[] {
  const urls = [];
  for (const src of sources) {
    if (src == null || String(src).trim() === "") continue;
    for (const part of String(src).split(",")) {
      const trimmed = part.trim().replace(/\/+$/, "");
      if (trimmed) urls.push(trimmed);
    }
  }
  return urls;
}

const allowedOrigins = [
  ...new Set([
    ...parseAllowedOrigins(
      process.env.FRONTEND_URL,
      process.env.CORS_EXTRA_ORIGINS
    ),
    "https://ecommerce-mysql-db-2839.vercel.app",
    "https://badmintonecommerce.store",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://[::1]:3000",
  ]),
];

function isLoopbackOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/+$/, "");

    if (
      allowedOrigins.includes(normalizedOrigin) ||
      isLoopbackOrigin(normalizedOrigin)
    ) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS origin: ${normalizedOrigin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Middleware: CORS before Helmet so preflight and responses always get ACAO headers
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(cookieParser()); // Parse cookies
app.use("/api/payments", paymentRoutes); // Stripe webhook route (raw body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api", reviewRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api", commentRoutes);
app.use("/api", likeRoutes);
app.use("/api", voucherRoutes);
app.use("/api/product-views", productViewRoutes); // Product view tracking

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin", mediaRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/subcategories", subcategoryRoutes);
app.use("/api/admin/child-categories", childCategoryRoutes);
app.use("/api/admin/carts", cartAdminRoutes);

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
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

app.listen(PORT, () => {
  // Server started successfully
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
