import { useState, useEffect, useRef } from "react";
import AppointmentForm from "../components/AppointmentForm";
import PatientForm from "./PatientForm";
import { Moon, Sun, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Assignment() {
  const nav = useNavigate();
  const [dark, setDark] = useState(false);
  const [chat, setChat] = useState([
    {
      role: "bot",
      text: "Hi 👋 I am your AI Hospital Assistant. How can I help you?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const chatEndRef = useRef(null);

  // auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setMessage(speechText);
    };
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const aiReply = data.reply;

      setChat([...newChat, { role: "bot", text: aiReply }]);

      // auto open booking form
      if (aiReply.toLowerCase().includes("appointment")) {
        setShowForm(true);
      }
    } catch {
      setChat([...newChat, { role: "bot", text: "Server error 😢" }]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-10">
            🏥 AI Hospital
          </h1>

          <button onClick={() => setShowForm(true)} className="sidebar-btn">
            📅 Book Appointment
          </button>

          <button onClick={() => nav("/doctors")} className="sidebar-btn">
            <Stethoscope size={18} /> Doctors
          </button>
        </div>

        <button onClick={() => setDark(!dark)} className="sidebar-btn">
          {dark ? <Sun /> : <Moon />} Toggle Theme
        </button>
      </div>

      {/* CHAT SECTION */}
      <div className="flex-1 flex flex-col p-6">
        <div className="glass-card flex-1 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">🤖 Chat Assistant</h2>

          {/* messages */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`max-w-md px-4 py-2 rounded-xl ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && <p className="text-gray-400">Typing...</p>}
            <div ref={chatEndRef} />
          </div>

          {/* input */}
          <div className="flex gap-3 mt-4">
            <input
              className="input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your problem..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage} className="primary-btn">
              Send
            </button>

            <button
              onClick={startListening}
              className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-xl"
            >
              🎤
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[420px] p-6">
        <div className="glass-card h-full overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            📝 Patient Registration
          </h2>
          <PatientForm />

          {showForm && (
            <>
              <hr className="my-6" />
              <AppointmentForm onClose={() => setShowForm(false)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
