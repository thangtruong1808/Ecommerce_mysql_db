/**
 * Express Server (Vercel Serverless)
 * Main server file for the ecommerce backend API
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

import { connectDB } from "../backend/config/db.js";

import productRoutes from "../backend/routes/productRoutes.js";
import authRoutes from "../backend/routes/authRoutes.js";
import cartRoutes from "../backend/routes/cartRoutes.js";
import orderRoutes from "../backend/routes/orderRoutes.js";
import reviewRoutes from "../backend/routes/reviewRoutes.js";
import adminRoutes from "../backend/routes/adminRoutes.js";
import invoiceRoutes from "../backend/routes/invoiceRoutes.js";
import commentRoutes from "../backend/routes/commentRoutes.js";
import likeRoutes from "../backend/routes/likeRoutes.js";
import voucherRoutes from "../backend/routes/voucherRoutes.js";
import mediaRoutes from "../backend/routes/mediaRoutes.js";
import categoryRoutes from "../backend/routes/categoryRoutes.js";
import subcategoryRoutes from "../backend/routes/subcategoryRoutes.js";
import childCategoryRoutes from "../backend/routes/childCategoryRoutes.js";
import cartAdminRoutes from "../backend/routes/cartAdminRoutes.js";
import productViewRoutes from "../backend/routes/productViewRoutes.js";

// Load env (Vercel also injects env vars automatically)
dotenv.config();

const app = express();

/* -------------------- DB CONNECTION (SAFE FOR SERVERLESS) -------------------- */
let isConnected = false;

async function connectOnce() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✅ Database connected");
  }
}

// Ensure DB is connected before every request
app.use(async (req, res, next) => {
  try {
    await connectOnce();
    next();
  } catch (err) {
    next(err);
  }
});

/* -------------------- MIDDLEWARE -------------------- */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- ROUTES -------------------- */

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/product-views", productViewRoutes);

// Admin routes
app.use("/api/admin", adminRoutes); // general admin endpoints
app.use("/api/admin/media", mediaRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/subcategories", subcategoryRoutes);
app.use("/api/admin/child-categories", childCategoryRoutes);
app.use("/api/admin/carts", cartAdminRoutes);

/* -------------------- HEALTH CHECK -------------------- */

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

/* -------------------- ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});

// Export for serverless
export const handler = serverless(app);

// Export app for local
// export default app;
