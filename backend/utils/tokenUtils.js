/**
 * Token Utilities
 * Helper functions for JWT token generation and validation
 *
 * @author Thang Truong
 * @date 2024-12-19
 */

import jwt from "jsonwebtoken";

// Security Note: Fallback secret is used only for development/testing
// In production, JWT_SECRET environment variable MUST be set
// TODO: Consider throwing error if JWT_SECRET is not set in production
const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_secret_change_in_production";
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "2m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "5m";

/**
 * Generate access token
 * @param {number} userId - User ID
 * @returns {string} - JWT access token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId, type: "access" }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate refresh token
 * @param {number} userId - User ID
 * @returns {string} - JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId, type: "refresh" }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token or null
 */
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "access") {
      return null;
    }
    return decoded;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token or null
 */
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "refresh") {
      return null;
    }
    return decoded;
  } catch (error) {
    throw error;
  }
};

/**
 * Get token expiration date
 * Converts JWT expiration timestamp (seconds) to JavaScript Date (milliseconds)
 * Note: The * 1000 multiplication is correct - JWT stores exp as Unix timestamp in seconds,
 * while JavaScript Date constructor expects milliseconds. This is a unit conversion,
 * not related to the number of users. Each token is processed independently.
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null
 * @author Thang Truong
 * @date 2025-01-28
 */
export const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      // JWT exp is in seconds, JavaScript Date needs milliseconds
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    return null;
  }
};
