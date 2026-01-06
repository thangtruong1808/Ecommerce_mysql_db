
import express from "express";
import * as userModel from "../../models/userModel.js";
import { validateUserDeletion } from "../../middleware/validationMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * GET /api/admin/users
 * Get all users with pagination, search, and filters
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || null;
    const role = req.query.role || null;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder || "desc";
    const result = await userModel.getAllUsers(
      page,
      limit,
      search,
      role,
      sortBy,
      sortOrder
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user (name, email, role)
 */
router.put("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, role } = req.body;

    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (name || email) {
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      const updatedUser = await userModel.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    if (role) {
      const updatedUser = await userModel.updateUserRole(userId, role);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
router.delete("/:id", validateUserDeletion, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId === req.user.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    const db = (await import("../../config/db.js")).default;
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/users/quick-create
 * Quick create user from dashboard
 */
router.post("/quick-create", async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields: name, email, password" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await userModel.createUser(name, email, hashedPassword);

    if (role === "admin") {
      await userModel.updateUserRole(userId, role);
    }

    const user = await userModel.findUserById(userId);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/users/:id/role
 * Update user role inline
 */
router.put("/:id/role", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const updatedUser = await userModel.updateUserRole(userId, role);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/users/:id/status
 * Activate/deactivate user
 */
router.put("/:id/status", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isActive } = req.body;

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Cannot change your own status" });
    }

    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      ...user,
      isActive,
      message: "Status update would be implemented with status field",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/users/bulk-update
 * Bulk update user roles/status
 */
router.post("/bulk-update", async (req, res) => {
  try {
    const { userIds, updates } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ message: "userIds must be a non-empty array" });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

    if (userIds.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "Cannot update your own account in bulk" });
    }

    const db = (await import("../../config/db.js")).default;
    const placeholders = userIds.map(() => "?").join(",");

    const updateFields = [];
    const updateValues = [];

    if (updates.role && ["user", "admin"].includes(updates.role)) {
      updateFields.push("role = ?");
      updateValues.push(updates.role);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No valid updates provided" });
    }

    updateValues.push(...userIds);
    await db.execute(
      `UPDATE users SET ${updateFields.join(
        ", "
      )} WHERE id IN (${placeholders})`,
      updateValues
    );

    res.json({ message: `${userIds.length} users updated successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
