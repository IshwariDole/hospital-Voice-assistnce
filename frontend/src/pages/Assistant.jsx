import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "../components/ChatMessage";
import { FaMicrophone } from "react-icons/fa";

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I am your AI Hospital Assistant. How can I help you?"
    }
  ]);

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE FUNCTION
  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    // Fake bot reply (later we connect backend)
    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: "Thanks! I will help you with that 😊"
      };
      setMessages(prev => [...prev, botReply]);
    }, 800);

    setInput("");
  };

  // ENTER key send
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* HEADER */}
      <div className="bg-white shadow-md p-4 flex items-center gap-3">
        <div className="text-2xl">🤖</div>
        <h1 className="text-xl font-semibold">AI Hospital Assistant</h1>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} msg={msg} />
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-4 shadow-lg flex gap-3">
        <input
          type="text"
          placeholder="Describe your problem..."
          className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          Send
        </button>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl">
          <FaMicrophone />
        </button>
      </div>
    </div>
  );
};

export default Assistant;