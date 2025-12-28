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
  hasRefreshToken
) => {
  // Prevent duplicate calls (React StrictMode in development)
  if (isFetchingUserRef.current) return;
  isFetchingUserRef.current = true;

  try {
    // Use silent auth check endpoint that never returns 401
    const response = await axios.get("/api/auth/me");
    if (response.data.user) {
      setUser(response.data.user);
      setError(null);
    } else {
      // If /api/auth/me returns null user, try to refresh access token if refresh token exists
      // This handles cases where access token expired but refresh token is still valid
      if (hasRefreshToken && hasRefreshToken()) {
        // Refresh token exists - try to refresh access token, then retry fetchUser
        try {
          const refreshResponse = await axios.post(
            "/api/auth/refresh",
            {},
            {
              validateStatus: (status) => status === 200 || status === 401,
              _silent: true,
              withCredentials: true,
            }
          );
          if (refreshResponse.status === 200) {
            // Token refreshed successfully - retry fetching user
            try {
              const retryResponse = await axios.get("/api/auth/me");
              if (retryResponse.data.user) {
                setUser(retryResponse.data.user);
                setError(null);
              }
              // If still no user after refresh, preserve current user state (don't clear)
            } catch {
              // If retry fails, preserve current user state (don't clear)
            }
          }
          // If refresh fails, preserve current user state (don't clear)
        } catch {
          // If refresh fails, preserve current user state (don't clear)
        }
      } else {
        // No refresh token exists - clear user
        setUser(null);
        setError(null);
      }
    }
  } catch (error) {
    // Handle 429 errors gracefully - don't clear user on rate limit
    if (error.response?.status === 429) {
      error._silent = true;
      if (error.config) {
        error.config._silent = true;
      }
      // Don't clear user on rate limit - just set loading to false
      setLoading(false);
      isFetchingUserRef.current = false;
      userFetchedTimeRef.current = Date.now();
      return;
    }
    // If error occurs but refresh token exists, try to refresh access token first
    if (hasRefreshToken && hasRefreshToken()) {
      // Refresh token exists - try to refresh access token, then retry fetchUser
      try {
        const refreshResponse = await axios.post(
          "/api/auth/refresh",
          {},
          {
            validateStatus: (status) => status === 200 || status === 401,
            _silent: true,
            withCredentials: true,
          }
        );
        if (refreshResponse.status === 200) {
          // Token refreshed successfully - retry fetching user
          try {
            const retryResponse = await axios.get("/api/auth/me");
            if (retryResponse.data.user) {
              setUser(retryResponse.data.user);
              setError(null);
            }
            // If still no user after refresh, don't clear (keep current state)
          } catch {
            // If retry fails, don't clear user - keep current state
          }
        } else {
          // Refresh token returned 401 - don't clear user immediately
          // The refresh token might still be valid, just a temporary issue
          // Only clear if we're absolutely sure it's expired (handled by interceptor)
          // Preserve current user state to prevent unnecessary logout
        }
      } catch {
        // If refresh fails, don't clear user - keep current state
        // The token might still be valid, just a network issue
      }
    } else {
      // No refresh token exists - clear user
      setUser(null);
      setError(null);
    }
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
export const login = async (email, password, setUser, setError) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/auth/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.withCredentials = true;
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || "{}");
        // Check if response has error message (backend returns 200 with message for wrong creds)
        if (data.message && !data._id) {
          const message = data.message || "Invalid email or password";
          setError(message);
          resolve({ success: false, error: message });
        } else if (xhr.status === 200 && data._id) {
          // Success: response has user data
          console.log("Logged in user:", data);
          console.log("Logged in user with accessToken:", data.accessToken);

          setUser(data);

          setError(null);
          resolve({ success: true });
        } else {
          const message = data?.message || "Invalid email or password";
          setError(message);
          resolve({ success: false, error: message });
        }
      } catch {
        setError("Invalid email or password");
        resolve({ success: false, error: "Invalid email or password" });
      }
    };
    xhr.onerror = () => {
      setError("Login failed. Please try again.");
      resolve({ success: false, error: "Login failed. Please try again." });
    };
    xhr.send(JSON.stringify({ email, password }));
  });
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
export const logout = async (setUser, setError) => {
  try {
    await axios.post("/api/auth/logout");
  } catch {
    // Silent fail
  } finally {
    setUser(null);
    setError(null);
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
