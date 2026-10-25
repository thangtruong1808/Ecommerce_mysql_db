import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import adminApiRoutes from "./admin/index.js";

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(protect, admin, adminApiRoutes);

export default router;