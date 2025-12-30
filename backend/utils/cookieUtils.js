/**
 * Cookie Utilities
 * Helper functions for setting and clearing HTTP-only cookies
 *
 * @author Thang Truong
 * @date 2025-01-09
 */

/**
 * Convert time string to milliseconds
 * Supports formats: '15m', '1h', '7d', '30d', etc.
 * @param {string} timeString - Time string (e.g., '15m', '7d')
 * @returns {number} Time in milliseconds
 */
const timeStringToMs = (timeString) => {
  const match = timeString.match(/^(\d+)([smhd])$/);
  if (!match) {
    // Default fallback: assume minutes if format is invalid
    const minutes = parseInt(timeString) || 15;
    return minutes * 60 * 1000;
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s": // seconds
      return value * 1000;
    case "m": // minutes
      return value * 60 * 1000;
    case "h": // hours
      return value * 60 * 60 * 1000;
    case "d": // days
      return value * 24 * 60 * 60 * 1000;
    default:
      return value * 60 * 1000; // Default to minutes
  }
};

/**
 * Set access token cookie
 * @param {Object} res - Express response object
 * @param {string} token - Access token
 */
export const setAccessTokenCookie = (res, token) => {
  const expiryTime = process.env.ACCESS_TOKEN_EXPIRY || "2m";
  const maxAge = timeStringToMs(expiryTime);

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
  });
};

/**
 * Set refresh token cookie
 * @param {Object} res - Express response object
 * @param {string} token - Refresh token
 */
export const setRefreshTokenCookie = (res, token) => {
  const expiryTime = process.env.REFRESH_TOKEN_EXPIRY || "5m";
  const maxAge = timeStringToMs(expiryTime);

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
  });
};

/**
 * Clear access token cookie
 * @param {Object} res - Express response object
 */
export const clearAccessTokenCookie = (res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

/**
 * Clear refresh token cookie
 * @param {Object} res - Express response object
 */
export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

/**
 * Clear both token cookies
 * @param {Object} res - Express response object
 */
export const clearAllTokenCookies = (res) => {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);
};
