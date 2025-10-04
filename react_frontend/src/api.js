/**
 * Centralized Axios instance for API calls.
 * - baseURL defaults to http://localhost:3001 for local dev
 * - withCredentials disabled to avoid CORS credential restrictions
 * - 20s timeout
 * - Simple one-time retry on network error/timeouts
 */

import axios from "axios";

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the base URL for API calls from environment or default. */
  const envBase = process.env.REACT_APP_API_BASE;
  return (envBase && envBase.trim()) || "http://localhost:3001";
}

// Expose the effective base URL as a constant for consumers.
export const API_BASE = getApiBaseUrl();

// Helpful runtime log once at module init to see which base URL is in use.
if (typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.info(
    "[API] Using base URL:",
    API_BASE,
    "(set REACT_APP_API_BASE to change)"
  );
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Map axios/network errors into a friendlier shape for the UI
function toUserError(error) {
  const isAxios = !!error.isAxiosError;
  if (!isAxios) {
    return { message: "Unexpected error", detail: String(error) };
  }
  if (error.code === "ECONNABORTED") {
    return {
      message: "Request timed out",
      hint:
        "Backend may be unreachable or slow. Check that the server is running at " +
        API_BASE,
    };
  }
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data || {};
    const detail = typeof data === "string" ? data : data.detail || data.message;
    return {
      message: data.message || `Request failed with status ${status}`,
      status,
      detail: detail || null,
    };
  }
  // Network or CORS error: no response received
  return {
    message: "Network error",
    hint:
      "Possible CORS or connectivity issue. Ensure the backend is running at " +
      API_BASE +
      " and CORS allows http://localhost:3000.",
    detail: error.message,
  };
}

// Simple one-time retry for network/timeouts
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config || {};
    const shouldRetry =
      !config.__retried &&
      (!error.response || error.code === "ECONNABORTED"); // network/timeout
    if (shouldRetry) {
      config.__retried = true;
      try {
        return await api.request(config);
      } catch (e) {
        // Fall through to rejection with mapped error
        return Promise.reject(toUserError(e));
      }
    }
    return Promise.reject(toUserError(error));
  }
);

export default api;
