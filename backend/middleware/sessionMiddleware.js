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
import { setAccessTokenCookie } from "../utils/cookieUtils.js";

export const validateSession = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // 1. Try to validate with Access Token first
    if (accessToken) {
      const decodedAccess = verifyAccessToken(accessToken);
      if (decodedAccess) {
        const user = await userModel.findUserById(decodedAccess.id);
        if (user) {
          // Attach user and token info to request and proceed
          req.sessionData = {
            user,
            accessTokenExpiresAt: getTokenExpiration(accessToken).getTime(),
          };
          return next();
        }
      }
    }

    // 2. Access Token failed. Try to use Refresh Token.
    if (refreshToken) {
      const decodedRefresh = verifyRefreshToken(refreshToken);
      if (decodedRefresh) {
        // Check if refresh token is in the database
        const tokenRecord = await refreshTokenModel.findRefreshToken(refreshToken);
        if (tokenRecord) {
          const user = await userModel.findUserById(decodedRefresh.id);
          if (user) {
            // All checks passed. Issue a new Access Token.
            const newAccessToken = generateAccessToken(user.id);
            setAccessTokenCookie(res, newAccessToken); // Set new AT cookie on the response

            // Attach user and *new* token info to request
            req.sessionData = {
              user,
              accessTokenExpiresAt: getTokenExpiration(newAccessToken).getTime(),
            };
            return next();
          }
        }
      }
    }

    // 3. Both tokens failed or are missing.
    req.sessionData = { user: null, accessTokenExpiresAt: null };
    next();
  } catch (error) {
    // On any unexpected error, default to a logged-out state.
    req.sessionData = { user: null, accessTokenExpiresAt: null };
    next();
  }
};