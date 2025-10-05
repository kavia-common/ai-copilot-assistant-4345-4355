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

## Data and Persistence
This application does not include a database or any persistence layer as part of the current scope. The frontend is purely a UI that posts questions to the FastAPI backend; the backend forwards the request to the AI provider and returns an answer. No chat history or user data are stored, and each interaction is stateless.

If you want to add features such as chat history or user accounts in the future, you will need to provision a database and update the backend to implement storage and retrieval. The frontend will also require updates to present and manage persisted state. Until then, no database configuration is required for running this app.
