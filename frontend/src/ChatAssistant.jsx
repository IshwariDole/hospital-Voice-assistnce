import React, { useState, useEffect, useRef } from "react";
import "./ChatAssistant.css";
import { Send, Mic, MicOff } from "lucide-react";

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I am your AI Hospital Assistant. How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sure 😊 Please tell me: your name, department, and preferred time." },
      ]);
    }, 700);

    setInput("");
  };

  const handleSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  return (
    <div className="ca-wrapper">
      {/* Header */}
      <div className="ca-header">
        <span className="ca-robot">🤖</span>
        <div>
          <h2>AI Hospital Assistant</h2>
          <p>Online Now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="ca-body">
        {messages.map((msg, index) => (
          <div key={index} className={`ca-msg ${msg.sender}`}>
            {msg.sender === "bot" && <span className="ca-bot-icon">🤖</span>}
            <div className="ca-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Listening bar */}
      {listening && (
        <div className="ca-listening">
          <span className="ca-dot" /> Listening...
        </div>
      )}

      {/* Input */}
      <div className="ca-input-area">
        <input
          type="text"
          placeholder="Describe your problem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="ca-send-btn" onClick={handleSend} disabled={!input.trim()}>
          <Send size={16} />
        </button>
        <button
          className={`ca-mic-btn ${listening ? "listening" : ""}`}
          onClick={handleSpeech}
        >
          {listening ? <MicOff size={16} /> : <Mic size={16} />}
          {listening && <span className="ca-mic-ring" />}
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
