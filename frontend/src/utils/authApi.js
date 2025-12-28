/**
 * Authentication API Functions
 * Handles all authentication-related API calls
 * @author Thang Truong
 * @date 2025-01-28
 */

import axios from "axios";

/**
 * Fetch current user - silent auth check
 * Uses /api/auth/me which never returns 401, always returns user or null
 * If fetch fails and refresh token exists, tries to refresh access token first
 * @param {Function} setUser - Function to set user state
 * @param {Function} setError - Function to set error state
 * @param {Function} setLoading - Function to set loading state
 * @param {Object} isFetchingUserRef - Ref to track if fetching user
 * @param {Object} userFetchedTimeRef - Ref to track when user was fetched
 * @param {Function} hasRefreshToken - Function to check if refresh token exists
 * @author Thang Truong
 * @date 2025-01-28
 */
export const fetchUser = async (
  setUser,
  setError,
  setLoading,
  isFetchingUserRef,
  userFetchedTimeRef,
  hasRefreshToken,
  setTokenExpiresAt,
  isRefreshingTokenRef
) => {
  if (isFetchingUserRef.current) return;
  isFetchingUserRef.current = true;

  try {
    const response = await axios.get("/api/auth/me");

    if (response.data.user && response.data.accessTokenExpiresAt) {
      setUser(response.data.user);
      setTokenExpiresAt(response.data.accessTokenExpiresAt);
      setError(null);
    } else {
      // This 'else' block is now the primary path for expired tokens on startup.
      // It uses the isRefreshingTokenRef as a lock to prevent race conditions.
      if (
        hasRefreshToken &&
        hasRefreshToken() &&
        !isRefreshingTokenRef.current
      ) {
        isRefreshingTokenRef.current = true;
        try {
          // Attempt to refresh the token
          const refreshResponse = await axios.post(
            "/api/auth/refresh",
            {},
            { withCredentials: true }
          );

          if (
            refreshResponse.status === 200 &&
            refreshResponse.data.accessTokenExpiresAt
          ) {
            // If refresh succeeds, retry fetching the user with the new token
            const retryResponse = await axios.get("/api/auth/me");

            if (
              retryResponse.data.user &&
              retryResponse.data.accessTokenExpiresAt
            ) {
              // If retry also succeeds, set both user and expiry time
              setUser(retryResponse.data.user);
              setTokenExpiresAt(retryResponse.data.accessTokenExpiresAt);
              setError(null);
            } else {
              setUser(null);
              setTokenExpiresAt(null);
            }
          } else {
            setUser(null);
            setTokenExpiresAt(null);
          }
        } catch (err) {
          setUser(null);
          setTokenExpiresAt(null);
        } finally {
          isRefreshingTokenRef.current = false;
        }
      } else if (!hasRefreshToken || !hasRefreshToken()) {
        // Only log out if there's no refresh token. If there is one but a refresh is already in progress, do nothing.
        setUser(null);
        setError(null);
        setTokenExpiresAt(null);
      }
    }
  } catch (error) {
    // The interceptor should handle 401s. If we get here, it's another error.
    setUser(null);
    setTokenExpiresAt(null);
    setError(error.message || "Session could not be restored.");
  } finally {
    setLoading(false);
    isFetchingUserRef.current = false;
    userFetchedTimeRef.current = Date.now();
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
  setTokenExpiresAt
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
      const { accessTokenExpiresAt, ...userData } = data;
      setUser(userData);
      setTokenExpiresAt(accessTokenExpiresAt);
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
export const register = async (name, email, password, setUser, setError) => {
  try {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });
    setUser(response.data);
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
export const logout = async (setUser, setError, setTokenExpiresAt) => {
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
