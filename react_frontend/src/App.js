import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setAnswer("");
    if (!question.trim()) {
      setErr("Please enter a question.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/ask`, { question });
      setAnswer(res.data?.answer ?? "");
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.message ||
        "Something went wrong.";
      setErr(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">AI Copilot</div>
      </header>

      <main className="container">
        <section className="card">
          <h1 className="title">Ask the Copilot</h1>
          <form onSubmit={submit} className="form">
            <input
              className="input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question..."
              aria-label="Question"
            />
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Asking..." : "Ask"}
            </button>
          </form>
          {err && <div className="alert error">{err}</div>}
        </section>

        <section className="card">
          <h2 className="subtitle">Response</h2>
          {answer ? (
            <div className="answer">{answer}</div>
          ) : (
            <div className="muted">Your answer will appear here.</div>
          )}
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} AI Copilot</span>
      </footer>
    </div>
  );
}

export default App;
