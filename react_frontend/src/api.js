/**
 * Centralized Axios instance for API calls.
 * - baseURL defaults to http://localhost:3001 for local dev
 * - withCredentials disabled to avoid CORS credential restrictions
 * - 20s timeout
 * - Simple one-time retry on network error/timeouts
 * - Improved error mapping and message surfacing
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

/**
 * Safely stringify any server error payload for console debugging.
 * Avoids throwing on circular structures and keeps UI messages clean.
 */
// PUBLIC_INTERFACE
export function safeStringify(value) {
  /** Safely stringify unknown values for console logging. */
  try {
    if (typeof value === "string") return value;
    return JSON.stringify(value, null, 2);
  } catch (_e) {
    try {
      return String(value);
    } catch (_e2) {
      return "[unserializable error payload]";
    }
  }
}

/**
 * Map axios/network errors into a friendlier shape for the UI (Error-like object)
 * Ensures err.message is informative and preserves status/detail fields when available.
 */
function toUserError(error) {
  const isAxios = !!error.isAxiosError;
  if (!isAxios) {
    const e = new Error("Unexpected error");
    e.detail = String(error);
    return e;
  }

  // Timeout
  if (error.code === "ECONNABORTED") {
    const e = new Error("Request timed out");
    e.hint =
      "Backend may be unreachable or slow. Check that the server is running at " +
      API_BASE;
    return e;
  }

  // Server responded with a status outside 2xx
  if (error.response) {
    const { status, data } = error.response;
    let serverMsg = "";
    if (typeof data === "string") {
      serverMsg = data;
    } else if (data && typeof data === "object") {
      serverMsg = data.message || data.detail || "";
    }
    const message =
      serverMsg ||
      (status ? `Request failed with status ${status}` : "Request failed");

    const e = new Error(message);
    e.status = status || null;
    // Include raw detail for optional UI display
    e.detail =
      typeof data === "string" ? data : data?.detail || data?.message || null;
    return e;
  }

  // Network or CORS error: no response received
  const e = new Error("Network error");
  e.hint =
    "Possible CORS or connectivity issue. Ensure the backend is running at " +
    API_BASE +
    " and CORS allows http://localhost:3000.";
  e.detail = error.message;
  return e;
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
        // Reject with mapped user-friendly error
        return Promise.reject(toUserError(e));
      }
    }

    // Reject with mapped user-friendly error (preserve message)
    return Promise.reject(toUserError(error));
  }
);

export default api;
