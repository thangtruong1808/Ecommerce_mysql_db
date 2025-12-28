/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens from HTTP-only cookies
 *
 * @author Thang Truong
 * @date 2025-12-19
 */

import * as userModel from "../models/userModel.js";
import { verifyAccessToken } from "../utils/tokenUtils.js";

/**
 * Protect route - verify access token from cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify access token
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    // Get user from database
    const user = await userModel.findUserById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/**
 * Optional authentication middleware - sets req.user if token is valid, but doesn't require it
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @author Thang Truong
 * @date 2025-12-12
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      if (decoded) {
        const user = await userModel.findUserById(decoded.id);
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

/**
 * Admin only middleware - check if user is admin
 * Must be used after protect middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
