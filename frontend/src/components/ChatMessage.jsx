import React from "react";

const ChatMessage = ({ msg }) => {
  const isUser = msg.sender === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl shadow text-sm
        ${isUser 
          ? "bg-blue-600 text-white rounded-br-none" 
          : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};

export default ChatMessage;