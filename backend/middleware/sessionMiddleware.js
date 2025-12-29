import crypto from "crypto";

/**
 * Middleware to ensure a guest has a session ID for tracking purposes.
 * If a 'guest_session_id' cookie exists, it uses it.
 * Otherwise, it generates a new one and sets the cookie.
 * @author Thang Truong
 * @date 2025-12-28
 */
export const getSessionId = (req, res, next) => {
  let guestSessionId = req.cookies.guest_session_id;

  if (!guestSessionId) {
    guestSessionId = crypto.randomBytes(16).toString("hex");
    res.cookie("guest_session_id", guestSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      sameSite: "strict",
    });
  }

  req.guestSessionId = guestSessionId;
  next();
};

/**
 * Session Check Middleware
 * Validates a user's session on initial application load.
 *
 * This middleware encapsulates the full session validation logic:
 * 1. Checks for a valid Access Token.
 * 2. If Access Token is invalid/missing, it checks for a valid Refresh Token.
 * 3. If Refresh Token is valid, it issues a new Access Token.
 * 4. It attaches the final user state and token info to the request object.
 *
 * This allows for a single, clean API endpoint for the frontend to call on startup.
 *
 * @author Thang Truong
 * @date 2025-12-28
 */
import * as userModel from "../models/userModel.js";
import * as refreshTokenModel from "../models/refreshTokenModel.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  getTokenExpiration,
} from "../utils/tokenUtils.js";
import {
  setAccessTokenCookie,
  clearAllTokenCookies,
} from "../utils/cookieUtils.js";
export const validateSession = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies || {};
  try {
    if (accessToken) {
      try {
        const decodedAccess = verifyAccessToken(accessToken);
        const user = await userModel.findUserById(decodedAccess.id);
        if (user) {
          req.sessionData = {
            user,
            accessTokenExpiresAt: getTokenExpiration(accessToken).getTime(),
          };
          return next();
        }
      } catch (error) {
        // Access token is invalid or expired, proceed to refresh token
      }
    }
    if (refreshToken) {
      try {
        const decodedRefresh = verifyRefreshToken(refreshToken);
        const tokenRecord = await refreshTokenModel.findRefreshToken(
          refreshToken
        );
        if (tokenRecord) {
          const user = await userModel.findUserById(decodedRefresh.id);
          if (user) {
            const newAccessToken = generateAccessToken(user.id);
            setAccessTokenCookie(res, newAccessToken);
            req.sessionData = {
              user,
              accessTokenExpiresAt:
                getTokenExpiration(newAccessToken).getTime(),
            };
            return next();
          }
        }
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          clearAllTokenCookies(res);
          // Send a specific response for the frontend to handle logout
          return res.status(401).json({
            user: null,
            accessTokenExpiresAt: null,
            error: "force-logout",
          });
        }
        // For other errors (e.g., invalid token), clear cookies and proceed
        clearAllTokenCookies(res);
      }
    }
    // Default to a logged-out state if all checks fail
    req.sessionData = { user: null, accessTokenExpiresAt: null };
    next();
  } catch (error) {
    // Catch any unexpected server errors
    console.error("Unexpected error in validateSession:", error);
    req.sessionData = { user: null, accessTokenExpiresAt: null };
    next();
  }
};
