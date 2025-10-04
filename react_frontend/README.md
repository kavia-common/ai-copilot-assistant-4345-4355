# React Frontend for AI Copilot

The frontend provides a simple UI to ask questions and display AI-generated answers.

## Environment
- REACT_APP_API_BASE: absolute base URL to the backend API (defaults to http://localhost:3001)
- REACT_APP_SITE_URL: site URL for future features (defaults to http://localhost:3000)

Copy `.env.example` to `.env` and adjust if needed.

## Axios configuration
- Centralized axios instance at `src/api.js`
  - baseURL: `process.env.REACT_APP_API_BASE || "http://localhost:3001"`
  - withCredentials: false
  - timeout: 20000 ms
  - interceptors: one-time retry on network/timeout; improved error mapping

## Troubleshooting Network/CORS errors
- Ensure backend is running on the expected port: `http://localhost:3001`
- Frontend should run on `http://localhost:3000`
- CORS is configured on the backend for: `http://localhost:3000`, `http://127.0.0.1:3000`, and `FRONTEND_ORIGIN` if set.
- Set REACT_APP_API_BASE to match the backend if using a different host/port.
