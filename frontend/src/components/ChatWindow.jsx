export default function ChatWindow({ messages = [] }) {
  return (
    <div className="w-[400px] h-[400px] bg-white shadow-lg rounded-xl p-4 overflow-y-auto mb-4">
      <h2 className="text-xl font-bold mb-3">AI Receptionist</h2>

      {messages.length === 0 && (
        <p className="text-gray-400">Start conversation...</p>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 my-2 rounded-lg ${
            msg.sender === "user"
              ? "bg-blue-200 text-right"
              : "bg-gray-200 text-left"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}