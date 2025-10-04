# React Frontend for AI Copilot

The frontend provides a simple UI to ask questions and display AI-generated answers.

## Environment
- REACT_APP_API_BASE: absolute base URL to the backend API (defaults to http://localhost:3001)
- REACT_APP_SITE_URL: site URL for future features (defaults to http://localhost:3000)

Copy `.env.example` to `.env` and adjust if needed.

### Switching backend port
The app prefers the backend on port 3001. If your FastAPI backend runs on a different port (e.g., 8000), set:
```
REACT_APP_API_BASE=http://localhost:8000
```
Then restart the React dev server (`npm start`) so the new env var is applied.

## Axios configuration
- Centralized axios instance at `src/api.js`
  - baseURL: `process.env.REACT_APP_API_BASE || "http://localhost:3001"`
  - withCredentials: false
  - timeout: 20000 ms
  - interceptors: one-time retry on network/timeout; improved error mapping
- At runtime, the app logs the effective base URL to the console: `[API] Using base URL: ...`

### Improved error logging and handling
- Non-2xx responses are handled by axios and mapped to a readable `Error` with:
  - `message` (UI-safe), optional `status`, optional `hint`, and optional `detail`.
- The UI displays `err.message` to avoid `[object Object]`.
- Additional server error payload details are logged to the browser console only.
- A utility `safeStringify()` is available from `src/api.js` for safely logging server payloads.

## API routes used
- POST `/api/ask` for sending the user's question.
- GET `/api/health` for health checks.

## Where to see detailed error info
- Open the browser devtools console to view structured error logs, including status codes and backend-provided details.

## Troubleshooting Network/CORS errors
- Ensure backend is running on the expected port: `http://localhost:3001` (or your configured `REACT_APP_API_BASE`)
- Frontend should run on `http://localhost:3000`
- CORS is configured on the backend for: `http://localhost:3000`, `http://127.0.0.1:3000`, and `FRONTEND_ORIGIN` if set.
- Set REACT_APP_API_BASE to match the backend if using a different host/port.
