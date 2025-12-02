/**
 * Cookie Utilities
 * Helper functions for setting and clearing HTTP-only cookies
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

/**
 * Set access token cookie
 * @param {Object} res - Express response object
 * @param {string} token - Access token
 */
export const setAccessTokenCookie = (res, token) => {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Set refresh token cookie
 * @param {Object} res - Express response object
 * @param {string} token - Refresh token
 */
export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

/**
 * Clear access token cookie
 * @param {Object} res - Express response object
 */
export const clearAccessTokenCookie = (res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}

/**
 * Clear refresh token cookie
 * @param {Object} res - Express response object
 */
export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}

/**
 * Clear both token cookies
 * @param {Object} res - Express response object
 */
export const clearAllTokenCookies = (res) => {
  clearAccessTokenCookie(res)
  clearRefreshTokenCookie(res)
}

