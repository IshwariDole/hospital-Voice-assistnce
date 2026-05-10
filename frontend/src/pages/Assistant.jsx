import { useState } from "react";
import Header from "../components/Header";
import ChatWindow from "../components/ChatWindow";
import MicButton from "../components/MicButton";

function Assistant() {
  const [messages, setMessages] = useState([
    { text: "Hello 👋 How can I help you today?", sender: "bot" },
  ]);

  const handleMicClick = () => {
    alert("Mic clicked 🎤 (speech coming next)");
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <ChatWindow messages={messages} />

      <div className="p-4 flex justify-center">
        <MicButton onClick={handleMicClick} />
      </div>
    </div>
  );
}

export default Assistant;