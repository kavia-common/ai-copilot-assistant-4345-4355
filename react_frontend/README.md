# React Frontend for AI Copilot

This is the web UI for interacting with the AI Copilot.

## Theme
Corporate Navy
- Primary: #1E3A8A
- Secondary: #F59E0B
- Background: #F3F4F6
- Surface: #FFFFFF
- Text: #111827

## Run
- Copy `.env.example` to `.env` and adjust the `REACT_APP_BACKEND_URL` if needed (defaults to http://localhost:3001).
- Install dependencies: `npm install`
- Start: `npm start` (opens http://localhost:3000)

The app calls POST `${REACT_APP_BACKEND_URL}/api/ask` with `{ question }`.
