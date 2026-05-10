function ChatBubble({ text, sender }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-xs ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default ChatBubble;