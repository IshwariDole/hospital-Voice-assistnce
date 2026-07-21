import { useState, useEffect, useRef } from "react";
import "./ChatAssistant.css";

const ts = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const QUICK = [
  { icon: "📅", text: "Book appointment"  },
  { icon: "👨‍⚕️", text: "Find a specialist"  },
  { icon: "💊", text: "Ask about medicine" },
];

export default function ChatAssistant() {
  const [msgs, setMsgs]         = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I'm your MediAssist AI. How can I help you today?",
      time: ts(),
      showQuick: true,
    },
  ]);
  const [input, setInput]       = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading]   = useState(false);
  const endRef                  = useRef(null);
  const recognRef               = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    setMsgs(p => [...p, { sender: "user", text: msg, time: ts() }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMsgs(p => [...p, {
        sender: "bot",
        time: ts(),
        text: "Got it! Please share: your full name, preferred department, and a convenient time — I'll book it right away. 🏥",
      }]);
      setLoading(false);
    }, 1000);
  };

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported."); return; }

    if (listening) { recognRef.current?.stop(); setListening(false); return; }

    const r = new SR();
    recognRef.current = r;
    r.lang = "en-IN";
    r.start();
    setListening(true);

    r.onresult = e => {
      setInput(e.results[0][0].transcript);
      setListening(false);
      inputRef.current?.focus();
    };
    r.onerror = () => setListening(false);
    r.onend   = () => setListening(false);
  };

  return (
    <div className="ca2-root">

      {/* Header */}
      <div className="ca2-header">
        <div className="ca2-avatar-wrap">
          <div className="ca2-avatar">🤖</div>
          <div className="ca2-online-dot" />
        </div>
        <div className="ca2-header-text">
          <div className="ca2-title">MediAssist AI</div>
          <div className="ca2-status">● Online · Ready to help</div>
        </div>
      </div>

      {/* Messages */}
      <div className="ca2-body">
        {msgs.map((m, i) => (
          <div key={i} className={`ca2-row ca2-row--${m.sender} msg-in`}>
            {m.sender === "bot" && (
              <div className="ca2-bot-avatar">🤖</div>
            )}
            <div className="ca2-col">
              <div className={`ca2-bubble ca2-bubble--${m.sender}`}>
                {m.text}
              </div>
              <div className="ca2-time">{m.time}</div>

              {/* Quick replies */}
              {m.showQuick && (
                <div className="ca2-quick">
                  {QUICK.map(q => (
                    <button
                      key={q.text}
                      className="ca2-chip"
                      onClick={() => send(q.text)}
                    >
                      <span>{q.icon}</span> {q.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing dots */}
        {loading && (
          <div className="ca2-row ca2-row--bot msg-in">
            <div className="ca2-bot-avatar">🤖</div>
            <div className="ca2-bubble ca2-bubble--bot ca2-typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Listening bar */}
      {listening && (
        <div className="ca2-listen-bar">
          <span className="ca2-listen-dot" />
          Listening… speak now
        </div>
      )}

      {/* Input */}
      <div className="ca2-input-row">
        <div className={`ca2-input-wrap${listening ? " ca2-input-wrap--listening" : ""}`}>
          <input
            ref={inputRef}
            className="ca2-input"
            placeholder="Describe your concern…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
          />
          <button
            className={`ca2-mic${listening ? " ca2-mic--on" : ""}`}
            onClick={toggleMic}
            title={listening ? "Stop" : "Voice input"}
          >
            {listening ? "🔴" : "🎙️"}
          </button>
        </div>
        <button
          className="ca2-send"
          onClick={() => send()}
          disabled={!input.trim()}
          title="Send"
        >➤</button>
      </div>
    </div>
  );
}
