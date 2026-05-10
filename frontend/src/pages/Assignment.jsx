import { useState, useRef, useEffect } from "react";
import AppointmentForm from "../components/AppointmentForm";
function Assignment() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showForm, setShowForm] = useState(false);

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

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
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      setChat([...newChat, { role: "bot", text: data.reply }]);
    } catch (err) {setChat([...newChat, { role: "bot", text: data.reply }]);

// ⭐ detect booking intent
if (data.reply.toLowerCase().includes("appointment")) {
  setTimeout(()=>setShowForm(true),1000);
}
      setChat([...newChat, { role: "bot", text: "Server error 😢" }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏥 AI Hospital Assistant</h2>
               <div style={styles.quickBtns}>
  <button onClick={() => { setMessage("I want to book appointment"); setTimeout(sendMessage,200); }}>
    📅 Book Appointment
  </button>

  <button onClick={() => { setMessage("Show hospital departments"); setTimeout(sendMessage,200); }}>
    🏥 Departments
  </button>

  <button onClick={() => { setMessage("I have emergency"); setTimeout(sendMessage,200); }}>
    🚨 Emergency
  </button>
</div>
        <div style={styles.chatBox}>
          {chat.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "#007bff" : "#eee",
                color: msg.role === "user" ? "white" : "black"
              }}
            >
              {msg.text}
            </div>
          ))}

          {loading && <div>Typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            style={styles.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe your problem..."
          />
          <button style={styles.button} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
      {showForm && <AppointmentForm onClose={()=>setShowForm(false)} />}
    </div>
  );
}

const styles = {
  page: {
    background: "#eef2f7",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  },
  card: {
    width: "420px",
    height: "600px",
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "20px"
  },
  title: { textAlign: "center", marginBottom: "10px" },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "10px"
  },
  message: {
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "75%",
    fontSize: "14px"
  },
  inputArea: { display: "flex", gap: "10px", marginTop: "10px" },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "12px 18px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  },
  quickBtns: {
  display: "flex",
  gap: "8px",
  marginBottom: "10px"
},
};

export default Assignment;