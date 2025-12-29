/**
 * Authentication API Functions
 * Handles all authentication-related API calls
 * @author Thang Truong
 * @date 2025-01-28
 */

import axios from "axios";

/**
 * Initialize Session
 * Calls the backend's dedicated session-check endpoint to validate the user's session
 * on initial application load. This single API call encapsulates all validation and
 * refresh logic on the backend.
 * @param {Function} setUser - Function to set user state
 * @param {Function} setTokenExpiresAt - Function to set token expiration state
 * @param {Function} setLoading - Function to set loading state
 * @author Thang Truong
 * @date 2025-12-28
 */
export const initializeSession = async (
  setUser,
  setTokenExpiresAt,
  setLoading,
  setRefreshTokenExpiresAt
) => {
  try {
    const { data } = await axios.get("/api/auth/session-check");
    if (data.user && data.accessTokenExpiresAt) {
      setUser(data.user);
      setTokenExpiresAt(data.accessTokenExpiresAt);
      if (data.refreshTokenExpiresAt) {
        setRefreshTokenExpiresAt(data.refreshTokenExpiresAt);
      }
    } else {
      setUser(null);
      setTokenExpiresAt(null);
      setRefreshTokenExpiresAt(null);
    }
  } catch (error) {
    // console.error("Session initialization failed:", error);
    setUser(null);
    setTokenExpiresAt(null);
    setRefreshTokenExpiresAt(null);
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};

/**
 * Login user - silently handles 401 errors without console logging
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @returns {Promise<Object>} Result object with success status
 * @author Thang Truong
 * @date 2025-12-12
 */
export const login = async (
  email,
  password,
  setUser,
  setError,
  setTokenExpiresAt,
  setRefreshTokenExpiresAt
) => {
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    const data = response.data;

    // The backend sends a 200 response even for failed logins, with a 'message' field.
    if (data.message && !data._id) {
      const message = data.message || "Invalid email or password";
      setError(message);
      return { success: false, error: message };
    }

    if (data._id && data.accessTokenExpiresAt) {
      // Separate user data from the expiration time
      const { accessTokenExpiresAt, refreshTokenExpiresAt, ...userData } = data;
      setUser(userData);
      setTokenExpiresAt(accessTokenExpiresAt);
      if (refreshTokenExpiresAt) {
        setRefreshTokenExpiresAt(refreshTokenExpiresAt);
      }
      setError(null);
      return { success: true };
    } else {
      const message = "Login failed: Invalid response from server.";
      setError(message);
      return { success: false, error: message };
    }
  } catch (error) {
    const message =
      error.response?.data?.message || "Login failed. Please try again.";
    setError(message);
    return { success: false, error: message };
  }
};

/**
 * Register new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @returns {Promise<Object>} Result object with success status
 * @author Thang Truong
 * @date 2025-12-12
 */
export const register = async (
  name,
  email,
  password,
  setUser,
  setError,
  setRefreshTokenExpiresAt
) => {
  try {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });
    const { refreshTokenExpiresAt, ...userData } = response.data;
    setUser(userData);
    if (refreshTokenExpiresAt) {
      setRefreshTokenExpiresAt(refreshTokenExpiresAt);
    }
    setError(null);
    return { success: true };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      "Registration failed";
    setError(message);
    return { success: false, error: message };
  }
};

/**
 * Logout user
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @author Thang Truong
 * @date 2025-12-12
 */
export const logout = async (
  setUser,
  setError,
  setTokenExpiresAt,
  setRefreshTokenExpiresAt
) => {
  try {
    await axios.post("/api/auth/logout");
  } catch {
    // Silent fail
  } finally {
    setUser(null);
    setError(null);
    if (setTokenExpiresAt) {
      setTokenExpiresAt(null);
    }
    if (setRefreshTokenExpiresAt) {
      setRefreshTokenExpiresAt(null);
    }
  }
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @returns {Promise<Object>} Result object with success status
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateProfile = async (userData, setUser, setError) => {
  try {
    const response = await axios.put("/api/auth/profile", userData);
    setUser(response.data);
    setError(null);
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || "Update failed";
    setError(message);
    return { success: false, error: message };
  }
};
