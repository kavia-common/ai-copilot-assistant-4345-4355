# React Frontend

This UI talks to the FastAPI backend via `REACT_APP_API_BASE` (default http://localhost:3001).

Backend now uses Google Gemini for AI responses. No API keys are needed in the frontend; the secret is configured on the backend only.

Setup:
1. Copy `.env.example` to `.env` and adjust if needed.
2. Start backend (port 3001).
3. Start frontend (port 3000).

Endpoints used:
- POST /api/ask -> { answer, model }
- GET /api/health
