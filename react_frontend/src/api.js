/* Ensure base URL is configurable via env (REACT_APP_API_BASE) */
import axios from 'axios';

// PUBLIC_INTERFACE
export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

// PUBLIC_INTERFACE
export const api = axios.create({ 
  baseURL: API_BASE,
  timeout: 25000, // 25 second timeout for client
  headers: {
    'Content-Type': 'application/json',
  },
});

// PUBLIC_INTERFACE
export async function askQuestion(question) {
  /** Send a question to the backend and return { answer, model }. */
  const res = await api.post('/api/ask', { question });
  return res.data; // { answer, model }
}

// PUBLIC_INTERFACE
export async function health() {
  /** Call the backend health endpoint and return the JSON result. */
  const res = await api.get('/api/health');
  return res.data;
}
