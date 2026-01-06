
import express from "express";
import statsRoutes from "./statsRoutes.js";
import userAdminRoutes from "./userAdminRoutes.js";
import productAdminRoutes from "./productAdminRoutes.js";
import orderAdminRoutes from "./orderAdminRoutes.js";
import invoiceAdminRoutes from "./invoiceAdminRoutes.js";
import reviewAdminRoutes from "./reviewAdminRoutes.js";
import commentAdminRoutes from "./commentAdminRoutes.js";
import voucherAdminRoutes from "./voucherAdminRoutes.js";
import productViewAdminRoutes from "./productViewAdminRoutes.js";
import bulkOperationsAdminRoutes from "./bulkOperationsAdminRoutes.js";

const router = express.Router();

router.use("/stats", statsRoutes);
router.use("/users", userAdminRoutes);
router.use("/products", productAdminRoutes);
router.use("/orders", orderAdminRoutes);
router.use("/invoices", invoiceAdminRoutes);
router.use("/reviews", reviewAdminRoutes);
router.use("/comments", commentAdminRoutes);
router.use("/vouchers", voucherAdminRoutes);
router.use("/product-views", productViewAdminRoutes);
router.use("/bulk", bulkOperationsAdminRoutes);

export default router;
