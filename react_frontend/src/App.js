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
      // Enhanced error extraction to show backend error details
      let errorMessage = 'Request failed';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const data = err.response.data;
        
        if (typeof data === 'object') {
          // Construct detailed error message from backend response
          const parts = [];
          if (data.message) parts.push(data.message);
          if (data.detail) parts.push(data.detail);
          if (data.hint) parts.push(`Hint: ${data.hint}`);
          if (data.action) parts.push(`Action: ${data.action}`);
          
          errorMessage = parts.length > 0 ? parts.join(' - ') : JSON.stringify(data);
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        
        errorMessage = `[${err.response.status}] ${errorMessage}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = `Network Error: No response from server. Please check if the backend is running at ${process.env.REACT_APP_API_BASE || 'http://localhost:3001'}`;
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = err.message || 'Unknown error';
      }
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - the server took too long to respond';
      }
      
      console.error('API Error:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
      });
      
      setError(String(errorMessage));
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
      let errorMessage = 'Backend health check failed';
      if (err.response?.data) {
        errorMessage += `: ${JSON.stringify(err.response.data)}`;
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      // eslint-disable-next-line no-alert
      alert(errorMessage);
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
        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #DC2626', borderRadius: 8, padding: '1rem', marginTop: '1rem' }}>
            <div style={{ color: '#DC2626', fontWeight: 'bold', marginBottom: '0.5rem' }}>Error</div>
            <div style={{ color: '#991B1B', whiteSpace: 'pre-wrap' }}>{error}</div>
          </div>
        )}
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
