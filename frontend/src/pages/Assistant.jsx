import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaMicrophone, FaMoon, FaSun } from "react-icons/fa";

const Assistant = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I am your AI Hospital Assistant. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Fake Bot Reply
    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: "Thanks 😊 Your appointment request is being processed.",
      };

      setMessages((prev) => [...prev, botReply]);
    }, 1000);

    setInput("");
  };

  // Enter Key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      className={`h-screen flex justify-center items-center transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      {/* CHAT CONTAINER */}
      <div
        className={`w-full max-w-3xl h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* HEADER */}
        <div
          className={`p-5 flex justify-between items-center shadow-md ${
            darkMode ? "bg-gray-950 text-white" : "bg-blue-600 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🤖</div>

            <div>
              <h1 className="font-bold text-xl">AI Hospital Assistant</h1>

              <p className="text-sm opacity-80">Online Now</p>
            </div>
          </div>

          {/* THEME BUTTON */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl bg-white/20 p-3 rounded-full hover:scale-110 transition"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* CHAT AREA */}
        <div
          className={`flex-1 overflow-y-auto p-5 ${
            darkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-5 py-3 rounded-2xl max-w-[75%] text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : darkMode
                      ? "bg-gray-700 text-white rounded-bl-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT AREA */}
        <div
          className={`p-4 border-t flex items-center gap-3 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          }`}
        >
          <input
            type="text"
            placeholder="Type your message..."
            className={`flex-1 rounded-full px-5 py-3 outline-none ${
              darkMode ? "bg-gray-700 text-white" : "border border-gray-300"
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          {/* SEND BUTTON */}
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition"
          >
            <FaPaperPlane />
          </button>

          {/* MIC BUTTON */}
          <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition">
            <FaMicrophone />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
