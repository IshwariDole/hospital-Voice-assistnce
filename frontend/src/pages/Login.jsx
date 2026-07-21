import { useState } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "2,400+", label: "Patients served" },
  { value: "18",     label: "Departments"      },
  { value: "24 / 7", label: "AI availability"  },
];

const features = [
  { icon: "🎙️", text: "Voice-first appointment booking"   },
  { icon: "🤖", text: "AI triage in seconds"              },
  { icon: "📋", text: "Instant digital patient records"   },
];

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail]     = useState("");
  const [pass,  setPass]      = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); nav("/dashboard"); }, 800);
  };

  return (
    <div className="page-in" style={{
      minHeight: "100dvh",
      display: "flex",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>

      {/* ── Left dark panel ── */}
      <div style={{
        flex: "0 0 48%",
        background: "linear-gradient(155deg, #0B1D35 0%, #0F2847 60%, #0a2255 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
        position: "relative",
        overflow: "hidden",
      }} className="hidden md:flex">

        {/* Background decoration */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,106,229,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "linear-gradient(135deg, #1D6AE5, #38BDF8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>🏥</div>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px" }}>MediAssist</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 1 }}>AI Hospital System</div>
            </div>
          </div>
        </div>

        {/* Centre copy */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(56,189,248,0.15)", borderRadius: 100,
            padding: "5px 14px", marginBottom: 24,
          }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#38BDF8", display:"inline-block" }} />
            <span style={{ color: "#38BDF8", fontSize: 12, fontWeight: 700 }}>AI-Powered Healthcare</span>
          </div>

          <h1 style={{
            color: "white", fontSize: 38, fontWeight: 800,
            lineHeight: 1.15, letterSpacing: "-0.8px", marginBottom: 16,
          }}>
            Healthcare that<br />
            <span style={{ color: "#38BDF8" }}>listens to you</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.65, maxWidth: 320, marginBottom: 40 }}>
            Book appointments by voice, get instant AI triage, and manage your health records — all in one place.
          </p>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0,
                }}>{f.icon}</div>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "flex", gap: 32,
          paddingTop: 28,
          borderTop: "1px solid rgba(255,255,255,0.10)",
        }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ color: "white", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "#F7FAFE",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Mobile logo */}
          <div style={{ textAlign: "center", marginBottom: 36 }} className="md:hidden">
            <div style={{
              width: 56, height: 56, borderRadius: 18, margin: "0 auto 12px",
              background: "linear-gradient(135deg, #0B1D35, #1D6AE5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
            }}>🏥</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: "#0B1D35" }}>MediAssist</div>
            <div style={{ color: "#4B5E7A", fontSize: 13, marginTop: 4 }}>AI Hospital System</div>
          </div>

          {/* Desktop heading */}
          <div style={{ marginBottom: 32 }} className="hidden md:block">
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0B1D35", letterSpacing: "-0.5px", marginBottom: 6 }}>
              Welcome back
            </h2>
            <p style={{ color: "#4B5E7A", fontSize: 14 }}>Sign in to your patient portal</p>
          </div>

          {/* Form card */}
          <form onSubmit={handleLogin} style={{
            background: "white",
            borderRadius: 24,
            padding: "32px 28px",
            boxShadow: "0 4px 32px rgba(11,29,53,0.09), 0 1px 4px rgba(11,29,53,0.05)",
          }}>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4B5E7A", marginBottom: 7, letterSpacing: "0.4px", textTransform: "uppercase" }}>
                Email address
              </label>
              <input
                type="email"
                className="field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4B5E7A", marginBottom: 7, letterSpacing: "0.4px", textTransform: "uppercase" }}>
                Password
              </label>
              <input
                type="password"
                className="field"
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: loading ? "#8EB8F7" : "linear-gradient(135deg, #1D6AE5, #1558C9)",
                color: "white",
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s, transform 0.1s",
                boxShadow: loading ? "none" : "0 6px 24px rgba(29,106,229,0.35)",
                letterSpacing: "-0.2px",
              }}
              onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#8B9AB3", fontSize: 12, marginTop: 20 }}>
            MediAssist © 2025 · Powered by MERN + Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
