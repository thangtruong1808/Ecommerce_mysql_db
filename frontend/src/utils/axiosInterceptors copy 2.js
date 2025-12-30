/**
 * Axios Interceptors for Proactive and Reactive Token Refresh
 * This file sets up both request and response interceptors to handle token refreshes.
 * 1. A request interceptor proactively refreshes the token if it's about to expire.
 * 2. A response interceptor reactively refreshes the token if an API call returns a 401 error.
 * Both interceptors share a single queue and refreshing flag to prevent race conditions.
 * @author Thang Truong
 * @date 2025-12-28 (Refactored)
 */
import axios from "axios";
import { handleTokenExpiration } from "./authUtils.js";

let isRefreshing = false;
let requestQueue = [];

const processQueue = (error, token = null) => {
  requestQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  requestQueue = [];
};

const authEndpoints = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
];

/**
 * Sets up Axios interceptors for authentication.
 * @param {Function} setUser - Function to set the user state.
 * @param {Function} setError - Function to set the error state.
 * @param {Object} isRedirectingRef - Ref to track if a redirect is in progress.
 * @param {Function} getTokenExpiresAt - A function that returns the stored token expiration timestamp.
 * @param {Function} setTokenExpiresAt - A function to update the token expiration timestamp.
 * @returns {Function} A function to eject the interceptors.
 */
export const setupAuthInterceptors = (interceptorProps) => {
  const {
    setUser,
    setError,
    isRedirectingRef,
    getTokenExpiresAt,
    setTokenExpiresAt,
    setRefreshTokenExpiresAt,
  } = interceptorProps;
  const requestInterceptor = axios.interceptors.request.use(
    async (config) => {
      // Ignore auth endpoints
      if (authEndpoints.some((endpoint) => config.url.includes(endpoint))) {
        return config;
      }

      const expiresAt = getTokenExpiresAt();
      // Refresh if token is present and will expire in the next 60 seconds
      if (expiresAt && expiresAt - Date.now() < 60000) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { data } = await axios.post(
              "/api/auth/refresh",
              {},
              { withCredentials: true }
            );
            setTokenExpiresAt(data.accessTokenExpiresAt);
            if (data.refreshTokenExpiresAt) {
              setRefreshTokenExpiresAt(data.refreshTokenExpiresAt);
            }
            processQueue(null);
            isRefreshing = false;
          } catch (error) {
            processQueue(error);
            if (error.response?.data?.message === "force-logout") {
              await handleTokenExpiration(setUser, setError, isRedirectingRef);
            }
            isRefreshing = false;
            return Promise.reject(error);
          }
        }

        // Wait for the token to be refreshed
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        }).then(() => {
          return config; // Retry the original request
        });
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (
        authEndpoints.some((endpoint) => originalRequest.url.includes(endpoint))
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        }).then(() => {
          originalRequest._retry = true;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios
          .post("/api/auth/refresh", {}, { withCredentials: true })
          .then((res) => {
            setTokenExpiresAt(res.data.accessTokenExpiresAt);
            if (res.data.refreshTokenExpiresAt) {
              setRefreshTokenExpiresAt(res.data.refreshTokenExpiresAt);
            }
            processQueue(null);
            resolve(axios(originalRequest));
          })
          .catch(async (err) => {
            processQueue(err);
            if (err.response?.data?.message === "force-logout") {
              await handleTokenExpiration(setUser, setError, isRedirectingRef);
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
  );

  return () => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
  };
};
