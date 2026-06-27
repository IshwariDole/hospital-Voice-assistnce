import { useState, useEffect, useRef } from "react";
import AppointmentForm from "../components/AppointmentForm";
import PatientForm from "./PatientForm";
import Toast from "../components/Toast";
import { Moon, Sun, Stethoscope, Menu, X, Send, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Assignment() {
  const nav = useNavigate();

  // Theme
  const [dark, setDark] = useState(false);

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mobile right panel (forms)
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  // Chat
  const [chat, setChat] = useState([
    { role: "bot", text: "Hi 👋 I am your AI Hospital Assistant. How can I help you?" },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // Appointment Form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", department: "", time: "" });

  // Toast
  const [toast, setToast] = useState(null);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Voice input
  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("Speech recognition not supported in this browser", "error");
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
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);
    recognition.start();

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setMessage(text);
      setListening(false);
      showToast("Voice captured!", "success");
      inputRef.current?.focus();
    };

    recognition.onerror = () => {
      showToast("Couldn't capture voice. Try again.", "error");
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  };

  // Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    const newChat = [...chat, { role: "user", text: userMessage }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    // Auto-detect booking details (Name, Department, Time)
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
      const res = await fetch("https://hospital-voice-assistnce.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const aiReply = data.reply;

      setChat([...newChat, { role: "bot", text: aiReply }]);

      if (aiReply.toLowerCase().includes("appointment")) {
        setShowForm(true);
      }
    } catch {
      setChat([
        ...newChat,
        { role: "bot", text: "Sorry, connection error. Please try again. 😢" },
      ]);
      showToast("Server error. Check your connection.", "error");
    }

    setLoading(false);
  };

  // Colour tokens
  const pageBg = dark
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900";
  const cardBg = dark
    ? "bg-gray-800"
    : "bg-white/80 backdrop-blur-lg";
  const sidebarBg = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const inputCls = dark
    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
    : "bg-white border-gray-200";

  return (
    <div className={`h-[100dvh] flex overflow-hidden transition-colors duration-300 ${pageBg}`}>

      {/* ── Toast ── */}
      {toast && <Toast message={toast.msg} type={toast.type} />}

      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside
        className={`
          fixed md:relative z-50 md:z-auto
          h-full w-72 md:w-60 flex flex-col justify-between
          p-5 border-r shadow-2xl md:shadow-lg
          sidebar-transition
          ${sidebarBg}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Top section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-lg font-bold text-blue-600">🏥 AI Hospital</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`md:hidden p-2 rounded-xl transition ${dark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => { setShowMobilePanel(true); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition text-sm font-semibold"
            >
              📅 Book Appointment
            </button>

            <button
              onClick={() => { nav("/doctors"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition text-sm font-medium active:scale-95 ${
                dark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Stethoscope size={16} /> Our Doctors
            </button>

            <button
              onClick={() => { nav("/"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition text-sm font-medium active:scale-95 ${
                dark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              🚪 Logout
            </button>
          </nav>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition text-sm font-semibold active:scale-95 ${
            dark
              ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900"
              : "bg-gray-900 hover:bg-gray-700 text-white"
          }`}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-w-0">

        {/* ── Chat Section ── */}
        <div className="flex-1 flex flex-col p-3 md:p-5 min-h-0">

          {/* Mobile top bar */}
          <div className={`flex items-center justify-between mb-3 md:hidden p-3 rounded-2xl shadow-sm ${cardBg}`}>
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-xl transition ${dark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-blue-600 text-sm">🏥 AI Hospital Assistant</h2>
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-xl transition ${dark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Chat Card */}
          <div className={`flex-1 flex flex-col rounded-3xl p-4 md:p-6 shadow-xl overflow-hidden ${cardBg}`}>

            {/* Desktop heading */}
            <h2 className="text-xl font-bold mb-4 hidden md:block">🤖 Chat Assistant</h2>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 overscroll-contain">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex chat-msg ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5 shadow-sm">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : dark
                          ? "bg-gray-700 text-white rounded-bl-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start chat-msg">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5">
                    🤖
                  </div>
                  <div className={`px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm ${dark ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div className="typing-dots">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Listening indicator */}
            {listening && (
              <div className="flex items-center gap-2 px-1 py-2 text-red-500 text-xs font-semibold">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Listening — speak now...
              </div>
            )}

            {/* Input row */}
            <div className="flex gap-2 mt-3">
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Describe your problem..."
                className={`flex-1 px-4 py-3 rounded-2xl text-sm outline-none border transition min-w-0 ${inputCls}`}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                title="Send"
                className="bg-blue-600 hover:bg-blue-700 active:scale-90 disabled:opacity-40 text-white p-3 rounded-2xl transition shrink-0"
              >
                <Send size={16} />
              </button>
              <button
                onClick={toggleListening}
                title={listening ? "Stop" : "Speak"}
                className={`relative p-3 rounded-2xl text-white transition shrink-0 active:scale-90 ${
                  listening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
                {listening && <span className="mic-ring" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Panel (desktop only) ── */}
        <div className="hidden md:block w-[380px] p-5 overflow-y-auto">
          <div className={`min-h-full rounded-3xl p-6 shadow-xl ${cardBg}`}>
            <h2 className="text-xl font-bold mb-5">📝 Patient Registration</h2>
            <PatientForm dark={dark} showToast={showToast} />
            {showForm && (
              <>
                <hr className={`my-6 ${dark ? "border-gray-600" : "border-gray-200"}`} />
                <AppointmentForm
                  dark={dark}
                  formData={formData}
                  closeForm={() => setShowForm(false)}
                  showToast={showToast}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          MOBILE FORMS FULL-SCREEN PANEL
      ══════════════════════════════════ */}
      {showMobilePanel && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          <div
            className={`flex-1 overflow-y-auto overscroll-contain ${
              dark ? "bg-gray-900 text-white" : "bg-gray-50"
            }`}
          >
            {/* Header */}
            <div
              className={`sticky top-0 z-10 flex items-center justify-between px-5 py-4 shadow-sm ${
                dark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-lg font-bold">📝 Patient Registration</h2>
              <button
                onClick={() => setShowMobilePanel(false)}
                className={`p-2 rounded-xl transition ${dark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Forms */}
            <div className="p-5 space-y-4">
              <PatientForm dark={dark} showToast={showToast} />
              <AppointmentForm
                dark={dark}
                formData={formData}
                closeForm={() => { setShowForm(false); setShowMobilePanel(false); }}
                showToast={showToast}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
