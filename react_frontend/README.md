# React Frontend for AI Copilot

This UI talks to the FastAPI backend via REACT_APP_API_BASE (default http://localhost:3001).

The backend uses Google Gemini for AI responses. No API keys are needed in the frontend; secrets are configured on the backend only.

## Prerequisites
- Node.js 18+ and npm
- Backend running at http://localhost:3001

## Environment
Create `.env` (optional) to override defaults.

- REACT_APP_API_BASE: absolute base URL to the backend API (defaults to http://localhost:3001)

Example:
REACT_APP_API_BASE=http://localhost:3001

Note: The app reads REACT_APP_API_BASE at startup; restart `npm start` after changing it.

## Run locally
- Install deps:
  npm install
- Start dev server (port 3000):
  npm start
Open http://localhost:3000

## End-to-end verification
- Backend health: Visit http://localhost:3001/api/health in your browser (should return a JSON with ok: true).
- From the UI, enter a question and press Ask. The app posts to `${REACT_APP_API_BASE}/api/ask` and displays the answer and model.

## API usage in code
- Centralized axios instance in src/api.js using:
  - API base: `process.env.REACT_APP_API_BASE || 'http://localhost:3001'`
  - GET /api/health
  - POST /api/ask

## Troubleshooting
- Network/CORS errors:
  - Ensure backend is running at http://localhost:3001.
  - Frontend should run at http://localhost:3000.
  - The backend CORS allowlist includes http://localhost:3000 and http://127.0.0.1:3000 by default; if you use another origin, set FRONTEND_ORIGIN on the backend and restart.
- 400 errors on /api/ask:
  - Ensure the question is non-empty.
  - If the backend returns a configuration error, set GOOGLE_GEMINI_API_KEY in the backend .env and restart.
- 502 errors:
  - Indicates upstream provider/network issues; verify Gemini model name, API key, and connectivity.

## Data and Persistence
This application has no persistence in scope. Each interaction is stateless: the frontend sends the question; the backend calls Gemini and returns an answer.
