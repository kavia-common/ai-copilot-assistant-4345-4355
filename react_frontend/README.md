# React Frontend for AI Copilot

The frontend provides a simple UI to ask questions and display AI-generated answers. It communicates with the FastAPI backend via a configurable base URL.

## Overview
At startup, the app reads REACT_APP_API_BASE and logs the effective backend base URL in the browser console as “[API] Using base URL: …”. All API requests are made relative to that URL.

## Prerequisites
- Node.js 18+ and npm
- Running backend (default at http://localhost:3001)

## Environment variables
Copy `.env.example` to `.env` and adjust if needed (or define variables in your shell before starting the dev server).

Required variables:
- REACT_APP_API_BASE: absolute base URL to the backend API (defaults to http://localhost:3001)
- REACT_APP_SITE_URL: site URL for future features (defaults to http://localhost:3000)

Example:
```
REACT_APP_API_BASE=http://localhost:3001
REACT_APP_SITE_URL=http://localhost:3000
```

Never put secrets like OPENAI_API_KEY in the frontend environment. The backend reads OPENAI_API_KEY.

### Switching backend port
The app prefers the backend on port 3001. If your FastAPI backend runs on a different port (e.g., 8000), set:
```
REACT_APP_API_BASE=http://localhost:8000
```
Then restart the React dev server (`npm start`) so the new env var is applied.

## Running locally (ports and commands)
- Install dependencies:
  npm install
- Start the dev server on port 3000:
  npm start
Open http://localhost:3000 in your browser.

If you changed REACT_APP_API_BASE, confirm the browser console shows the intended base URL.

## Health checks and API endpoints
- GET `${REACT_APP_API_BASE}/api/health` verifies backend health.
- POST `${REACT_APP_API_BASE}/api/ask` with JSON body { "question": "..." } returns an AI-generated answer.

In the UI:
- Use the input to enter a question and press “Ask.” The app handles network errors and displays a friendly message while logging details to the console.

## Axios configuration
- Centralized axios instance at `src/api.js`
  - baseURL: `process.env.REACT_APP_API_BASE || "http://localhost:3001"`
  - withCredentials: false
  - timeout: 20000 ms
  - interceptors: one-time retry on network/timeout; improved error mapping to an Error-like object with message, status, hint, and optional detail.

## End-to-end verification
1) Confirm backend health:
   - Visit `${REACT_APP_API_BASE}/api/health` in your browser or use curl.
2) Start the frontend at http://localhost:3000.
3) Submit a question via the UI. If OPENAI_API_KEY is not configured on the backend, you will get a friendly 400 error explaining the missing key. Otherwise, an answer is returned.
4) Inspect logs:
   - Browser console shows “[API] Using base URL: …” and any structured error logs.
   - Backend server logs show request handling and errors.

## Troubleshooting
Network Error:
- Indicates the request did not reach the backend (connectivity or CORS). Ensure the backend is running at REACT_APP_API_BASE and CORS allows http://localhost:3000.
- Verify REACT_APP_API_BASE matches the backend’s URL and restart the dev server after changes.

CORS errors:
- The backend allows http://localhost:3000 and http://127.0.0.1:3000 by default. If your frontend runs elsewhere, update FRONTEND_ORIGIN on the backend and restart.

4xx/5xx mapping:
- The frontend maps non-2xx responses to a readable error message. For 400 errors, you may see messages like “Question must not be empty” or “Missing OPENAI_API_KEY…”. For 502, hints indicate upstream provider/network issues. 500 indicates an unexpected error.

Missing OPENAI_API_KEY:
- The backend can start without a key but will return 400 on /api/ask with a helpful detail and action. Set the key in the backend environment only.

Where to see logs:
- Browser devtools console for frontend logs and detailed error info.
- FastAPI server console for backend logs and stack traces when applicable.
