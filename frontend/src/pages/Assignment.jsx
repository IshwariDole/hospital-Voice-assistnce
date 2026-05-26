import { useState, useEffect, useRef } from "react";
import AppointmentForm from "../components/AppointmentForm";
import PatientForm from "./PatientForm";
import { Moon, Sun, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Assignment() {
  const nav = useNavigate();

  // 🌙 Theme
  const [dark, setDark] = useState(false);

  // 💬 Chat
  const [chat, setChat] = useState([
    {
      role: "bot",
      text: "Hi 👋 I am your AI Hospital Assistant. How can I help you?",
    },
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 📅 Appointment Form
  const [showForm, setShowForm] = useState(false);

  // 📋 Autofill Data
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    time: "",
  });

  const chatEndRef = useRef(null);

  // 🔽 Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat]);

  // 🎤 Voice Input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;

      setMessage(speechText);
    };
  };

  // 📤 Send Message
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    const newChat = [
      ...chat,
      {
        role: "user",
        text: userMessage,
      },
    ];

    setChat(newChat);
    setMessage("");
    setLoading(true);

    // 📅 Auto Detect Booking Details
    if (userMessage.includes(",")) {
      const parts = userMessage.split(",");

      if (parts.length >= 2) {
        setFormData({
          name: parts[0]?.trim(),
          department: parts[1]?.trim(),
          time: parts[2]?.trim() || "",
        });

        setShowForm(true);
      }
    }

    try {
      const res = await fetch(
        "https://hospital-voice-assistnce.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        },
      );

      const data = await res.json();

      const aiReply = data.reply;

      setChat([
        ...newChat,
        {
          role: "bot",
          text: aiReply,
        },
      ]);

      // 📅 Auto Open Form
      if (aiReply.toLowerCase().includes("appointment")) {
        setShowForm(true);
      }
    } catch (err) {
      setChat([
        ...newChat,
        {
          role: "bot",
          text: "Server error 😢",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      className={`h-screen flex transition-all duration-300 ${
        dark
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-black"
      }`}
    >
      {/* SIDEBAR */}
      <div
        className={`w-64 shadow-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
          dark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-10">
            🏥 AI Hospital
          </h1>

          {/* Appointment */}
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center gap-3 mb-4 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            📅 Book Appointment
          </button>

          {/* Doctors */}
          <button
            onClick={() => nav("/doctors")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              dark
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Stethoscope size={18} />
            Doctors
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition ${
            dark
              ? "bg-yellow-500 hover:bg-yellow-400 text-black"
              : "bg-black hover:bg-gray-800 text-white"
          }`}
        >
          {dark ? <Sun /> : <Moon />}
          Toggle Theme
        </button>
      </div>

      {/* CHAT SECTION */}
      <div className="flex-1 flex flex-col p-6">
        <div
          className={`flex-1 flex flex-col rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
            dark ? "bg-gray-800" : "bg-white/70 backdrop-blur-lg"
          }`}
        >
          {/* Header */}
          <h2 className="text-2xl font-bold mb-5">🤖 Chat Assistant</h2>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-5 py-3 rounded-2xl shadow-md text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : dark
                        ? "bg-gray-700 text-white rounded-bl-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && <p className="text-gray-400 text-sm">Typing...</p>}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div className="flex gap-3 mt-5">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your problem..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className={`flex-1 px-5 py-3 rounded-xl outline-none border transition ${
                dark
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />

            {/* SEND */}
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl transition"
            >
              Send
            </button>

            {/* MIC */}
            <button
              onClick={startListening}
              className="bg-green-500 hover:bg-green-600 text-white px-5 rounded-xl transition"
            >
              🎤
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[420px] p-6">
        <div
          className={`h-full overflow-y-auto rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
            dark ? "bg-gray-800" : "bg-white/70 backdrop-blur-lg"
          }`}
        >
          <h2 className="text-2xl font-bold mb-5">📝 Patient Registration</h2>

          <PatientForm dark={dark} />

          {showForm && (
            <>
              <hr className="my-6 border-gray-400" />

              <AppointmentForm
                dark={dark}
                formData={formData}
                closeForm={() => setShowForm(false)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
