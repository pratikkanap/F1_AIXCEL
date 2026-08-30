import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/client";
import "./ChatPanel.css";

function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // {role: 'user'|'model', text}
  const [history, setHistory] = useState([]); // Gemini-format history sent back to backend
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(userText, history);
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      setHistory(data.history);
    } catch (err) {
      const detail = err?.response?.data?.detail || err.message || "Unknown error";
      const friendlyText = detail.includes("RESOURCE_EXHAUSTED")
        ? "I'm getting a lot of questions right now — give me about 30 seconds and try again."
        : `Error: ${detail}`;
      setMessages((prev) => [
        ...prev,
        { role: "model", text: friendlyText },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "CLOSE" : "ASK F1 Chatbot"}
      </button>

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <span className="chat-header-bar" />
            <h3>F1 KNOWLEDGE CHAT</h3>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <p className="chat-empty">
                Ask about results, standings, race calendars, or general F1 knowledge.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="chat-bubble model loading">Thinking...</div>}
            <div ref={scrollRef} />
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              SEND
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatPanel;