/* eslint-disable no-console */
import React, { useState } from "react";
import api, { API_BASE, safeStringify } from "./api";

/**
 * PUBLIC_INTERFACE
 * App component for the AI Copilot frontend.
 * - Uses centralized axios instance (src/api.js)
 * - Reads backend base URL from REACT_APP_API_BASE or defaults to http://localhost:3001
 * - Sends POST /api/ask with { question }
 * - Health check uses GET /api/health
 * - Surfaces detailed backend errors and CORS/network hints
 * - Clears UI error messages before each request
 */
function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = API_BASE;

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setError(null); // clear previous UI errors
    setAnswer("");
    setLoading(true);
    try {
      // axios throws for non-2xx; interceptor maps to friendly Error
      const res = await api.post("/api/ask", { question });
      setAnswer(res?.data?.answer || "");
    } catch (err) {
      if (err instanceof Error) {
        // Log extra server payload details to console (not UI)
        const serverPayload =
          // axios error mapping preserves response on original error, but our interceptor returns Error.
          // So we cannot rely on err.response here; instead just log detail if present.
          err.detail ? safeStringify(err.detail) : undefined;

        console.error("❌ Error:", err.message, {
          url: `${baseUrl}/api/ask`,
          status: err.status,
          hint: err.hint,
          detail: serverPayload,
        });
        setError(err);
      } else {
        console.error("❌ Unknown error:", err);
        setError(new Error("Unexpected error occurred."));
      }
    } finally {
      setLoading(false);
    }
  };

  // Example: health check (could be wired to a button or useEffect if needed)
  async function checkHealth() {
    try {
      await api.get("/api/health");
      console.info("Health check OK");
    } catch (err) {
      if (err instanceof Error) {
        const extra = err.detail ? safeStringify(err.detail) : undefined;
        console.warn("Health check failed:", err.message, {
          status: err.status,
          detail: extra,
        });
      } else {
        console.warn("Health check failed with unknown error:", err);
      }
    }
  }
  // Avoid calling automatically to prevent noise; available for debugging.
  // checkHealth();

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Inter, system-ui, Arial, sans-serif",
        background: "#F3F4F6",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <header>
          <h1 style={{ color: "#1E3A8A", marginBottom: 8 }}>AI Copilot</h1>
          <p style={{ color: "#374151" }}>
            Ask a question and get an AI-generated answer.
          </p>
        </header>

        <main style={{ marginTop: 24 }}>
          <form onSubmit={handleAsk} style={{ marginTop: 16 }}>
            <label htmlFor="q" style={{ fontWeight: 600, color: "#111827" }}>
              Your question
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
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
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#F59E0B",
                  color: "#111827",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  fontWeight: 600,
                }}
              >
                {loading ? "Asking…" : "Ask"}
              </button>
            </div>
          </form>

          {error && (
            <div
              style={{
                marginTop: 16,
                color: "#991B1B",
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <strong>Error:</strong> {error.message}
              {error.status && <span> (status {error.status})</span>}
              {error.hint && (
                <div style={{ marginTop: 6 }}>
                  <em>Hint:</em> {error.hint}
                </div>
              )}
              {error.detail && (
                <details style={{ marginTop: 6 }}>
                  <summary>Details</summary>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {String(error.detail)}
                  </pre>
                </details>
              )}
            </div>
          )}

          {answer && (
            <div
              style={{
                marginTop: 16,
                background: "#FFFFFF",
                padding: 16,
                borderRadius: 8,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                border: "1px solid #E5E7EB",
              }}
            >
              <strong style={{ color: "#111827" }}>Answer</strong>
              <div
                style={{ marginTop: 8, whiteSpace: "pre-wrap", color: "#111827" }}
              >
                {answer}
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, fontSize: 12, color: "#6B7280" }}>
            Backend: {baseUrl}
            <button
              style={{
                marginLeft: 12,
                background: "transparent",
                border: "1px solid #CBD5E1",
                color: "#374151",
                padding: "4px 8px",
                borderRadius: 6,
                cursor: "pointer",
              }}
              type="button"
              onClick={checkHealth}
              title="Ping backend /api/health"
            >
              Check health
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
