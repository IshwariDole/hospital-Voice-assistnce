import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../components/AppointmentForm";
import PatientForm     from "./PatientForm";
import Toast           from "../components/Toast";

/* ── Timestamp helper ── */
const ts = () => new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });

/* ── Quick-reply chips (shown after first bot message) ── */
const CHIPS = [
  { label: "Book appointment",  icon: "📅" },
  { label: "Find a doctor",     icon: "👨‍⚕️" },
  { label: "Medical help",      icon: "💊" },
  { label: "Emergency contact", icon: "🚨" },
];

/* ── Sidebar nav items ── */
const NAV = [
  { label:"Book Appointment",   icon:"📅", id:"book"    },
  { label:"Our Doctors",        icon:"👨‍⚕️", id:"doctors" },
  { label:"Patient Records",    icon:"📋", id:"records" },
  { label:"Medical Help",       icon:"💊", id:"help"    },
];

/* ── Animated AI avatar ── */
function BotAvatar({ spinning }) {
  return (
    <div style={{ position:"relative", width:34, height:34, flexShrink:0 }}>
      {/* Gradient ring — spins when bot is typing */}
      <div
        className={spinning ? "ring-spin" : ""}
        style={{
          position:"absolute", inset:-2,
          borderRadius:"50%",
          background:"conic-gradient(from 0deg, #1D6AE5, #38BDF8, #1D6AE5)",
          opacity: spinning ? 1 : 0.6,
          transition:"opacity 0.3s",
        }}
      />
      {/* Inner circle */}
      <div style={{
        position:"absolute", inset:2, borderRadius:"50%",
        background:"white", display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:15,
      }}>🤖</div>
    </div>
  );
}

/* ── Typing indicator ── */
function TypingBubble() {
  return (
    <div className="msg-in" style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
      <BotAvatar spinning />
      <div style={{
        background:"white", border:"1.5px solid #DDE6F5",
        borderRadius:"18px 18px 18px 4px",
        padding:"14px 18px",
        boxShadow:"0 2px 8px rgba(11,29,53,0.06)",
        display:"flex", gap:5, alignItems:"center",
      }}>
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
}

export default function Assignment() {
  const nav = useNavigate();

  /* ── State ── */
  const [dark, setDark]           = useState(false);
  const [sideOpen, setSideOpen]   = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [toast, setToast]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState("");
  const [listening, setListening] = useState(false);
  const [chat, setChat] = useState([
    {
      role:"bot",
      text:"Hello! 👋 I'm your MediAssist AI. I can help you book appointments, find the right department, or answer health questions. How can I help?",
      time: ts(),
      chips: true,
    },
  ]);

  const chatEndRef  = useRef(null);
  const inputRef    = useRef(null);
  const recognRef   = useRef(null);

  /* Auto-scroll chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [chat, loading]);

  /* Toast helper */
  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* ── Voice ── */
  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast("Speech not supported in this browser", "error"); return; }

    if (listening) { recognRef.current?.stop(); setListening(false); return; }

    const r = new SR();
    recognRef.current = r;
    r.lang = "en-IN";
    r.continuous = false;
    r.interimResults = false;
    setListening(true);
    r.start();

    r.onresult = e => {
      setMessage(e.results[0][0].transcript);
      setListening(false);
      showToast("Voice captured!", "success");
      inputRef.current?.focus();
    };
    r.onerror = () => { showToast("Couldn't hear you. Try again.", "error"); setListening(false); };
    r.onend   = () => setListening(false);
  };

  /* ── Send message ── */
  const send = async (text) => {
    const msg = (text || message).trim();
    if (!msg) return;

    const newChat = [...chat, { role:"user", text:msg, time:ts() }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    /* Auto-detect booking intent from comma-separated input */
    if (msg.includes(",")) {
      const parts = msg.split(",");
      if (parts.length >= 2) setShowForm(true);
    }

    try {
      const res  = await fetch("https://hospital-voice-assistnce.onrender.com/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const reply = data.reply || "I'm here to help! Could you describe your concern?";

      setChat([...newChat, { role:"bot", text:reply, time:ts() }]);
      if (reply.toLowerCase().includes("appointment")) setShowForm(true);
    } catch {
      setChat([...newChat, {
        role:"bot",
        text:"I couldn't connect to the server right now. Please try again shortly. 🔄",
        time:ts(),
      }]);
      showToast("Connection error", "error");
    }
    setLoading(false);
  };

  /* ── Chip tap ── */
  const chipTap = (chip) => {
    send(chip.label);
    if (chip.id === "book" || chip.label === "Book appointment") { setShowForm(true); }
  };

  /* ── Sidebar nav tap ── */
  const navTap = (id) => {
    setSideOpen(false);
    if (id === "doctors")  { nav("/doctors"); return; }
    if (id === "book")     { setShowForm(true); setPanelOpen(true); return; }
    if (id === "records")  { setPanelOpen(true); return; }
  };

  /* ── Theme colours ── */
  const bg       = dark ? "#111827" : "#F7FAFE";
  const cardBg   = dark ? "#1F2937" : "#FFFFFF";
  const chatBg   = dark ? "#111827" : "#F0F5FF";
  const borderC  = dark ? "rgba(255,255,255,0.08)" : "#DDE6F5";
  const mutedC   = dark ? "rgba(255,255,255,0.45)" : "#4B5E7A";

  return (
    <div style={{
      height:"100dvh", display:"flex", overflow:"hidden",
      background: bg, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",
      transition:"background 0.3s",
    }}>

      {/* ─── Toast ─── */}
      {toast && <Toast message={toast.msg} type={toast.type} />}

      {/* ─── Mobile backdrop ─── */}
      {sideOpen && (
        <div
          onClick={() => setSideOpen(false)}
          style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
            zIndex:40, backdropFilter:"blur(4px)",
          }}
        />
      )}

      {/* ═══════════════════════════════
          SIDEBAR — always dark navy
      ═══════════════════════════════ */}
      <aside
        className={sideOpen ? "drawer-in" : ""}
        style={{
          position: "fixed",
          zIndex: 50,
          top:0, left:0, bottom:0,
          width: 240,
          background: "#0B1D35",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          transform: sideOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",

          /* Always visible on desktop */
          ...(typeof window !== "undefined" && window.innerWidth >= 768 ? {} : {}),
        }}

        /* Desktop: always visible */
        data-sidebar="true"
      >
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32, paddingLeft:4 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#1D6AE5,#38BDF8)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
          }}>🏥</div>
          <div>
            <div style={{ color:"white", fontWeight:800, fontSize:15 }}>MediAssist</div>
            <div style={{ color:"rgba(255,255,255,0.38)", fontSize:10, marginTop:1 }}>AI Hospital</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.28)", letterSpacing:"0.8px", padding:"0 8px 8px", textTransform:"uppercase" }}>
            Navigation
          </div>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => navTap(n.id)}
              style={{
                display:"flex", alignItems:"center", gap:10,
                width:"100%", padding:"10px 12px",
                borderRadius:10, border:"none",
                background: "transparent",
                color: "rgba(255,255,255,0.75)",
                fontFamily:"inherit", fontSize:14, fontWeight:600,
                cursor:"pointer", textAlign:"left",
                transition:"background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.color="white"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}
            >
              <span style={{ fontSize:16 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:16, display:"flex", flexDirection:"column", gap:8 }}>
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10, border:"none",
              background:"rgba(255,255,255,0.06)",
              color:"rgba(255,255,255,0.7)",
              fontFamily:"inherit", fontSize:13, fontWeight:600,
              cursor:"pointer", transition:"background 0.15s",
            }}
          >
            <span>{dark ? "☀️" : "🌙"}</span>
            {dark ? "Light mode" : "Dark mode"}
          </button>

          {/* Sign out */}
          <button
            onClick={() => nav("/")}
            style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10, border:"none",
              background:"transparent",
              color:"rgba(255,255,255,0.45)",
              fontFamily:"inherit", fontSize:13, fontWeight:600,
              cursor:"pointer",
            }}
          >
            <span>🚪</span> Sign out
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════
          MAIN AREA (right of sidebar)
      ═══════════════════════════════ */}
      <div style={{
        flex:1, display:"flex", overflow:"hidden",
        marginLeft:0,          /* sidebar uses fixed positioning */
      }}>

        {/* ── Desktop sidebar spacer ── */}
        <div style={{ width:240, flexShrink:0, display:"none" }} className="md-sidebar-spacer" />

        {/* ═══════════════
            CHAT SECTION
        ═══════════════ */}
        <div style={{
          flex:1, display:"flex", flexDirection:"column",
          padding:16, gap:12, minWidth:0, overflow:"hidden",
        }}>

          {/* Mobile top bar */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"10px 14px",
            background: cardBg,
            borderRadius:16,
            border:`1px solid ${borderC}`,
            boxShadow:"0 2px 8px rgba(11,29,53,0.06)",
            flexShrink:0,
          }}>
            {/* Hamburger */}
            <button
              onClick={() => setSideOpen(true)}
              style={{
                width:36, height:36, borderRadius:10,
                background: dark ? "rgba(255,255,255,0.08)" : "#F0F5FF",
                border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18,
              }}
            >☰</button>

            {/* AI status */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <BotAvatar spinning={false} />
              <div>
                <div style={{ fontWeight:700, fontSize:13, color: dark?"white":"#0B1D35" }}>MediAssist AI</div>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:1 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#059669", display:"inline-block" }} />
                  <span style={{ fontSize:10, color:"#059669", fontWeight:700 }}>Online</span>
                </div>
              </div>
            </div>

            {/* Mobile forms button */}
            <button
              onClick={() => setPanelOpen(true)}
              style={{
                width:36, height:36, borderRadius:10,
                background: "linear-gradient(135deg,#1D6AE5,#38BDF8)",
                border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, color:"white",
              }}
            >📋</button>
          </div>

          {/* Chat messages */}
          <div style={{
            flex:1, overflowY:"auto", overscrollBehavior:"contain",
            display:"flex", flexDirection:"column", gap:16,
            padding:"4px 4px 8px",
          }}>
            {chat.map((msg, i) => (
              <div key={i} className="msg-in">
                {/* Bot message */}
                {msg.role === "bot" && (
                  <div>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                      <BotAvatar spinning={false} />
                      <div style={{ maxWidth:"76%" }}>
                        <div style={{
                          background: cardBg,
                          border:`1.5px solid ${borderC}`,
                          borderRadius:"18px 18px 18px 4px",
                          padding:"12px 16px",
                          fontSize:14, lineHeight:1.55,
                          color: dark ? "rgba(255,255,255,0.9)" : "#0B1D35",
                          boxShadow:"0 2px 8px rgba(11,29,53,0.06)",
                        }}>
                          {msg.text}
                        </div>
                        <div style={{ fontSize:10, color:mutedC, marginTop:4, marginLeft:4 }}>{msg.time}</div>
                      </div>
                    </div>

                    {/* Quick-reply chips — only on first message */}
                    {msg.chips && (
                      <div style={{
                        display:"flex", flexWrap:"wrap", gap:8,
                        marginTop:12, marginLeft:42,
                      }}>
                        {CHIPS.map(c => (
                          <button
                            key={c.label}
                            className="chip"
                            onClick={() => chipTap(c)}
                            style={{
                              background: dark ? "rgba(255,255,255,0.06)" : undefined,
                              borderColor: dark ? "rgba(255,255,255,0.15)" : undefined,
                              color: dark ? "rgba(255,255,255,0.7)" : undefined,
                            }}
                          >
                            <span>{c.icon}</span>{c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* User message */}
                {msg.role === "user" && (
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <div style={{ maxWidth:"76%", textAlign:"right" }}>
                      <div style={{
                        display:"inline-block",
                        background:"linear-gradient(135deg,#1D6AE5,#1558C9)",
                        borderRadius:"18px 18px 4px 18px",
                        padding:"12px 16px",
                        fontSize:14, lineHeight:1.55, color:"white",
                        boxShadow:"0 4px 16px rgba(29,106,229,0.30)",
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize:10, color:mutedC, marginTop:4, marginRight:4 }}>{msg.time}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && <TypingBubble />}
            <div ref={chatEndRef} />
          </div>

          {/* Listening bar */}
          {listening && (
            <div style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"8px 16px", borderRadius:100,
              background:"rgba(220,38,38,0.10)",
              border:"1px solid rgba(220,38,38,0.2)",
              alignSelf:"center", flexShrink:0,
            }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#DC2626", display:"inline-block", animation:"mic-pulse 1s infinite" }} />
              <span style={{ fontSize:12, fontWeight:700, color:"#DC2626" }}>Listening… speak now</span>
            </div>
          )}

          {/* Input row */}
          <div style={{
            display:"flex", gap:8, flexShrink:0,
            paddingBottom:"env(safe-area-inset-bottom)",
          }}>
            <div style={{
              flex:1,
              display:"flex", alignItems:"center",
              background: cardBg,
              borderRadius:14,
              border:`1.5px solid ${listening ? "#DC2626" : borderC}`,
              transition:"border-color 0.2s",
              overflow:"hidden",
              boxShadow:`0 2px 8px rgba(11,29,53,0.06)`,
            }}>
              <input
                ref={inputRef}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask me anything or describe your symptoms…"
                style={{
                  flex:1, padding:"13px 16px",
                  border:"none", outline:"none", background:"transparent",
                  fontFamily:"inherit", fontSize:14,
                  color: dark ? "rgba(255,255,255,0.9)" : "#0B1D35",
                }}
              />
              {/* Inline mic button */}
              <button
                onClick={toggleVoice}
                className={listening ? "mic-active" : ""}
                style={{
                  width:40, height:40, borderRadius:10, border:"none",
                  background: listening ? "#DC2626" : "transparent",
                  color: listening ? "white" : mutedC,
                  cursor:"pointer", display:"flex",
                  alignItems:"center", justifyContent:"center",
                  fontSize:18, margin:"0 4px",
                  transition:"all 0.2s",
                }}
                title={listening ? "Stop recording" : "Start voice input"}
              >
                {listening ? "🔴" : "🎙️"}
              </button>
            </div>

            <button
              onClick={() => send()}
              disabled={!message.trim()}
              style={{
                width:48, height:48, borderRadius:14, border:"none",
                background: message.trim()
                  ? "linear-gradient(135deg,#1D6AE5,#1558C9)"
                  : dark ? "rgba(255,255,255,0.08)" : "#DDE6F5",
                color: message.trim() ? "white" : mutedC,
                cursor: message.trim() ? "pointer" : "not-allowed",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, transition:"all 0.2s", flexShrink:0,
                boxShadow: message.trim() ? "0 4px 16px rgba(29,106,229,0.35)" : "none",
              }}
              title="Send"
            >
              ➤
            </button>
          </div>
        </div>

        {/* ═══════════════════
            RIGHT FORMS PANEL (desktop)
        ═══════════════════ */}
        <div style={{
          width:360, flexShrink:0,
          padding:"16px 16px 16px 0",
          overflowY:"auto",
          display:"none",    /* hidden on mobile via CSS below */
        }} className="forms-panel">
          <div style={{
            background: cardBg,
            borderRadius:20,
            border:`1px solid ${borderC}`,
            padding:"24px 20px",
            boxShadow:"0 2px 12px rgba(11,29,53,0.07)",
            minHeight:"100%",
          }}>
            {/* Section heading */}
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontSize:16, fontWeight:800, color: dark?"white":"#0B1D35", letterSpacing:"-0.3px" }}>
                📋 Patient Registration
              </h2>
              <p style={{ fontSize:12, color:mutedC, marginTop:4 }}>Register a new patient record</p>
            </div>

            <PatientForm dark={dark} showToast={showToast} />

            {/* Divider */}
            <div style={{
              display:"flex", alignItems:"center", gap:12, margin:"24px 0",
            }}>
              <div style={{ flex:1, height:1, background:borderC }} />
              <button
                onClick={() => setShowForm(!showForm)}
                style={{
                  padding:"6px 14px", borderRadius:100,
                  border:`1.5px solid ${borderC}`,
                  background:"transparent",
                  fontFamily:"inherit", fontSize:12, fontWeight:700,
                  color: dark ? "rgba(255,255,255,0.6)" : "#4B5E7A",
                  cursor:"pointer",
                }}
              >
                {showForm ? "▲ Hide" : "📅 Book Appointment"}
              </button>
              <div style={{ flex:1, height:1, background:borderC }} />
            </div>

            {showForm && (
              <div className="msg-in">
                <div style={{ marginBottom:16 }}>
                  <h3 style={{ fontSize:15, fontWeight:800, color: dark?"white":"#0B1D35" }}>📅 Appointment</h3>
                  <p style={{ fontSize:12, color:mutedC, marginTop:3 }}>Book your consultation slot</p>
                </div>
                <AppointmentForm
                  dark={dark}
                  closeForm={() => setShowForm(false)}
                  showToast={showToast}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
          MOBILE FULL-SCREEN FORMS PANEL
      ═══════════════════════════════════ */}
      {panelOpen && (
        <div
          className="panel-up"
          style={{
            position:"fixed", inset:0, zIndex:60,
            background: bg,
            display:"flex", flexDirection:"column",
            fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",
          }}
        >
          {/* Panel header */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"16px 20px",
            background: cardBg,
            borderBottom:`1px solid ${borderC}`,
            flexShrink:0,
          }}>
            <h2 style={{ fontSize:16, fontWeight:800, color: dark?"white":"#0B1D35" }}>Patient & Appointment</h2>
            <button
              onClick={() => setPanelOpen(false)}
              style={{
                width:34, height:34, borderRadius:10,
                background: dark?"rgba(255,255,255,0.08)":"#F0F5FF",
                border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, color: dark?"white":"#0B1D35",
              }}
            >✕</button>
          </div>

          {/* Panel body */}
          <div style={{ flex:1, overflowY:"auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:24 }}>
            <div>
              <h3 style={{ fontSize:14, fontWeight:800, color: dark?"white":"#0B1D35", marginBottom:16 }}>📋 Patient Registration</h3>
              <PatientForm dark={dark} showToast={showToast} />
            </div>

            <div style={{ height:1, background:borderC }} />

            <div>
              <h3 style={{ fontSize:14, fontWeight:800, color: dark?"white":"#0B1D35", marginBottom:16 }}>📅 Book Appointment</h3>
              <AppointmentForm
                dark={dark}
                closeForm={() => setPanelOpen(false)}
                showToast={showToast}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Inline style for desktop sidebar & forms panel ── */}
      <style>{`
        @media (min-width: 768px) {
          aside[data-sidebar="true"] {
            position: relative !important;
            transform: none !important;
            animation: none !important;
          }
          .forms-panel { display: flex !important; }
          .md-sidebar-spacer { display: none !important; }
        }
      `}</style>
    </div>
  );
}
