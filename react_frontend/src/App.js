 /* eslint-disable no-console */
import React, { useState } from 'react';
import axios from 'axios';

/**
 * PUBLIC_INTERFACE
 * App component for the AI Copilot frontend.
 * - Reads backend base URL from REACT_APP_API_BASE or defaults to http://localhost:3001
 * - Sends POST /api/ask with { question }
 * - Surfaces backend error messages instead of generic "Network Error"
 */
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

// Central axios instance with baseURL
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setErrorMsg('');
    setAnswer('');
    setLoading(true);
    try {
      const res = await api.post('/api/ask', { question });
      setAnswer(res?.data?.answer || '');
    } catch (err) {
      const resp = err?.response;
      const backendMessage =
        resp?.data?.message ||
        resp?.data?.detail ||
        err?.message ||
        'Unknown error';
      console.error('Request failed:', {
        url: `${API_BASE}/api/ask`,
        status: resp?.status,
        data: resp?.data,
        error: String(err),
      });
      setErrorMsg(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, Arial, sans-serif', background: '#F3F4F6', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <header>
          <h1 style={{ color: '#1E3A8A', marginBottom: 8 }}>AI Copilot</h1>
          <p style={{ color: '#374151' }}>
            Ask a question and get an AI-generated answer.
          </p>
        </header>

        <main style={{ marginTop: 24 }}>
          <form onSubmit={handleAsk} style={{ marginTop: 16 }}>
            <label htmlFor="q" style={{ fontWeight: 600, color: '#111827' }}>Your question</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                id="q"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#F59E0B',
                  color: '#111827',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontWeight: 600,
                }}
              >
                {loading ? 'Asking…' : 'Ask'}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div style={{
              marginTop: 16,
              color: '#DC2626',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: 8,
              padding: 12
            }}>
              Error: {errorMsg}
            </div>
          )}

          {answer && (
            <div style={{
              marginTop: 16,
              background: '#FFFFFF',
              padding: 16,
              borderRadius: 8,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid #E5E7EB'
            }}>
              <strong style={{ color: '#111827' }}>Answer</strong>
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', color: '#111827' }}>{answer}</div>
            </div>
          )}

          <div style={{ marginTop: 24, fontSize: 12, color: '#6B7280' }}>
            Backend: {API_BASE}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
