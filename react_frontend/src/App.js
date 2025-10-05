import React, { useState } from 'react';
import { askQuestion, health } from './api';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setAnswer(''); setModel('');
    try {
      const data = await askQuestion(question);
      setAnswer(data.answer || '');
      setModel(data.model || '');
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Request failed';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const onHealthClick = async () => {
    try {
      await health();
      // optional: indicate success in UI
      // eslint-disable-next-line no-alert
      alert('Backend health OK');
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Backend health failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', color: '#111827' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#1E3A8A' }}>AI Copilot</h1>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: 8 }}
          />
          <button disabled={loading} style={{ background: '#F59E0B', color: '#111827', padding: '0.75rem 1rem', borderRadius: 8, border: 'none' }}>
            {loading ? 'Asking…' : 'Ask'}
          </button>
          <button type="button" onClick={onHealthClick} style={{ background: 'transparent', color: '#111827', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #CBD5E1' }}>
            Health
          </button>
        </form>
        {error && <p style={{ color: '#DC2626', marginTop: '1rem' }}>{error}</p>}
        {answer && (
          <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', marginTop: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Model: {model}</div>
            <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{answer}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
