/**
 * Authentication Routes
 * Handles user registration, login, logout, and token refresh
 * Uses HTTP-only cookies for token storage
 *
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import * as userModel from "../models/userModel.js";
import * as refreshTokenModel from "../models/refreshTokenModel.js";
import * as passwordResetModel from "../models/passwordResetModel.js";
import * as userAddressModel from "../models/userAddressModel.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getTokenExpiration,
} from "../utils/tokenUtils.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAllTokenCookies,
} from "../utils/cookieUtils.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";
import { validateSession } from "../middleware/sessionMiddleware.js";
// import { ref } from "pdfkit";
import jwt from "jsonwebtoken";
const router = express.Router();

/**
 * GET /api/auth/session-check
 * Validates user session on initial app load using a dedicated middleware.
 * This single endpoint handles AT validation, RT refresh, and returns the final session state.
 * @author Thang Truong
 * @date 2025-12-28
 */
router.get("/session-check", validateSession, (req, res) => {
  res.json(req.sessionData);
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const userExists = await userModel.findUserByEmail(email);

      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userId = await userModel.createUser(name, email, hashedPassword);
      const user = await userModel.findUserById(userId);

      // Generate tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      const refreshTokenExpiresAt = getTokenExpiration(refreshToken).getTime();
      // Store refresh token in database
      const expiresAt = getTokenExpiration(refreshToken);
      await refreshTokenModel.createRefreshToken(
        user.id,
        refreshToken,
        expiresAt
      );

      // Set tokens as HTTP-only cookies
      setAccessTokenCookie(res, accessToken);
      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        refreshTokenExpiresAt: refreshTokenExpiresAt,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * POST /api/auth/login
 * Login user and generate tokens
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await userModel.findUserByEmail(email);

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          // Generate tokens
          const accessToken = generateAccessToken(user.id);
          // // vvvv ADD THIS DEBUGGING BLOCK vvvv
          // try {
          //   // const jwt = require("jsonwebtoken");
          //   const decodedForDebug = jwt.decode(accessToken);
          //   if (decodedForDebug) {
          //     const issuedAt = new Date(decodedForDebug.iat * 1000);
          //     const expiresAt = new Date(decodedForDebug.exp * 1000);
          //     const lifetimeInSeconds =
          //       decodedForDebug.exp - decodedForDebug.iat;
          //     console.log(">>>> [DEBUG] Immediately Decoded Token Details:");
          //     console.log(
          //       "Issued At (iat):",
          //       issuedAt.toLocaleString("en-AU", {
          //         timeZone: "Australia/Melbourne",
          //       })
          //     );
          //     console.log(
          //       "Expires At (exp):",
          //       expiresAt.toLocaleString("en-AU", {
          //         timeZone: "Australia/Melbourne",
          //       })
          //     );
          //     console.log("Lifetime (seconds):", lifetimeInSeconds); // Should be 120
          //   }
          // } catch (e) {
          //   console.log("Debug decode failed", e);
          // }
          // // ^^^^ END DEBUGGING BLOCK ^^^^

          const refreshToken = generateRefreshToken(user.id);
          const accessTokenExpiresAt =
            getTokenExpiration(accessToken).getTime();
          const refreshTokenExpiresAt =
            getTokenExpiration(refreshToken).getTime();
          // Store refresh token in database
          const expiresAt = getTokenExpiration(refreshToken);
          await refreshTokenModel.createRefreshToken(
            user.id,
            refreshToken,
            expiresAt
          );

          // Set tokens as HTTP-only cookies
          setAccessTokenCookie(res, accessToken);
          setRefreshTokenCookie(res, refreshToken);

          res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessTokenExpiresAt: accessTokenExpiresAt,
            refreshTokenExpiresAt: refreshTokenExpiresAt,
          });
        } else {
          // Return 200 to avoid browser console error noise on expected wrong creds
          res.json({ message: "Invalid email or password" });
        }
      } else {
        // Return 200 to avoid browser console error noise on expected wrong creds
        res.json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const tokenRecord = await refreshTokenModel.findRefreshToken(refreshToken);
    if (!tokenRecord) {
      clearAllTokenCookies(res);
      return res
        .status(401)
        .json({ message: "Refresh token not found, please log in again" });
    }
    await refreshTokenModel.deleteRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);
    const newRefreshTokenExpiresAt = getTokenExpiration(newRefreshToken);
    await refreshTokenModel.createRefreshToken(
      decoded.id,
      newRefreshToken,
      newRefreshTokenExpiresAt
    );
    setAccessTokenCookie(res, newAccessToken);
    setRefreshTokenCookie(res, newRefreshToken);
    const accessTokenExpiresAt = getTokenExpiration(newAccessToken).getTime();
    res.json({
      message: "Token refreshed successfully",
      accessTokenExpiresAt: accessTokenExpiresAt,
      refreshTokenExpiresAt: newRefreshTokenExpiresAt.getTime(),
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      clearAllTokenCookies(res);
      return res.status(401).json({ message: "force-logout" });
    }
    clearAllTokenCookies(res);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and invalidate refresh token
 */
router.post("/logout", protect, async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Delete refresh token from database
      await refreshTokenModel.deleteRefreshToken(refreshToken);
    }

    // Clear both token cookies
    clearAllTokenCookies(res);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/auth/me
 * Silent auth check - returns user if authenticated, null if not
 * Never returns 401, always returns 200 with user or null
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get("/me", optionalAuth, async (req, res) => {
  try {
    if (req.user && req.token) {
      const accessTokenExpiresAt = getTokenExpiration(req.token).getTime();
      res.json({ user: req.user, accessTokenExpiresAt });
    } else if (req.user) {
      // Fallback in case token is not attached, though it should be
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  } catch (error) {
    res.json({ user: null });
  }
});

/**
 * GET /api/auth/profile
 * Get current user profile (protected)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put(
  "/profile",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please include a valid email"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await userModel.updateUser(req.user.id, updateData);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        created_at: updatedUser.created_at,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please include a valid email")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const user = await userModel.findUserByEmail(email);

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({
          message: "If that email exists, a password reset link has been sent.",
        });
      }

      // Delete expired tokens for this user
      await passwordResetModel.deleteExpiredTokens(user.id);

      // Create reset token (expires in 1 hour)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      const resetToken = await passwordResetModel.createResetToken(
        user.id,
        expiresAt
      );

      // Send reset email
      try {
        await sendPasswordResetEmail(user.email, resetToken, user.name);
      } catch (emailError) {
        // Still return success to prevent email enumeration
      }

      res.json({
        message: "If that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      // Always return success to prevent email enumeration, even on errors
      res.json({
        message: "If that email exists, a password reset link has been sent.",
      });
    }
  }
);

/**
 * POST /api/auth/reset-password
 * Reset password using token
 */
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { token, password } = req.body;

      // Find valid token
      const tokenRecord = await passwordResetModel.findResetToken(token);
      if (!tokenRecord) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user password
      await userModel.updateUser(tokenRecord.user_id, {
        password: hashedPassword,
      });

      // Mark token as used
      await passwordResetModel.markTokenAsUsed(token);

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
);

/**
 * GET /api/auth/addresses
 * Get all addresses for current user
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get("/addresses", protect, async (req, res) => {
  try {
    const addresses = await userAddressModel.getUserAddresses(req.user.id);
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/auth/addresses
 * Create a new address for current user
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post(
  "/addresses",
  protect,
  [
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("postal_code")
      .trim()
      .notEmpty()
      .withMessage("Postal code is required"),
    body("country").trim().notEmpty().withMessage("Country is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const addressId = await userAddressModel.createAddress(
        req.user.id,
        req.body
      );
      const address = await userAddressModel.getAddressById(
        addressId,
        req.user.id
      );
      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * PUT /api/auth/addresses/:id
 * Update an address for current user
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put(
  "/addresses/:id",
  protect,
  [
    body("address")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Address cannot be empty"),
    body("city")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("City cannot be empty"),
    body("postal_code")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Postal code cannot be empty"),
    body("country")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Country cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const addressId = parseInt(req.params.id);
      const address = await userAddressModel.updateAddress(
        addressId,
        req.user.id,
        req.body
      );
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.json(address);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * DELETE /api/auth/addresses/:id
 * Delete an address for current user
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete("/addresses/:id", protect, async (req, res) => {
  try {
    const addressId = parseInt(req.params.id);
    const deleted = await userAddressModel.deleteAddress(
      addressId,
      req.user.id
    );
    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
