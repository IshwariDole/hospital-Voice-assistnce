import React, { useState, useEffect, useRef } from "react";
import "./ChatAssistant.css";

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I am your AI Hospital Assistant. How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, newMsg]);

    // Fake bot reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sure 😊 Please tell me: • Your name • Department • Preferred time" }
      ]);
    }, 700);

    setInput("");
  };

  // 🎤 Speech to text
  const handleSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setInput(voiceText);
    };
  };

  return (
    <div className="chat-wrapper">
      
      {/* Header */}
      <div className="chat-header">
        <span className="robot">🤖</span>
        <h2>AI Hospital Assistant</h2>
      </div>

      {/* Chat Messages */}
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Describe your problem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button className="send-btn" onClick={handleSend}>
          Send
        </button>

        <button className="mic-btn" onClick={handleSpeech}>
          🎤
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;