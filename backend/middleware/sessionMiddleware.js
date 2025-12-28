/**
 * Session Middleware
 * Handles guest session ID management for both authenticated and guest users
 * @author Thang Truong
 * @date 2025-12-12
 */

import crypto from "crypto";

/**
 * Get or create session ID and cart ID from cookies
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getSessionId = (req, res, next) => {
  let sessionId = req.cookies?.guest_session_id;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    res.cookie("guest_session_id", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  req.guestSessionId = sessionId;
  req.guestCartId = req.cookies?.guest_cart_id
    ? parseInt(req.cookies.guest_cart_id)
    : null;
  next();
};
