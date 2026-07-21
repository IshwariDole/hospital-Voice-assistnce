import { useState } from "react";
import axios from "axios";

const FIELDS = [
  { name: "name",     label: "Full Name",     type: "text",   placeholder: "Aisha Sharma",   icon: "👤" },
  { name: "age",      label: "Age",           type: "number", placeholder: "28",              icon: "🎂" },
  { name: "phone",    label: "Phone",         type: "tel",    placeholder: "+91 98765 43210", icon: "📱" },
  { name: "symptoms", label: "Symptoms",      type: "text",   placeholder: "Describe symptoms…", icon: "🩺", textarea: true },
];

export default function PatientForm({ dark, showToast }) {
  const [form, setForm]   = useState({ name:"", age:"", gender:"", phone:"", symptoms:"" });
  const [busy, setBusy]   = useState(false);
  const [done, setDone]   = useState(false);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    try {
      await axios.post("https://hospital-voice-assistnce.onrender.com/api/patients", form);
      setDone(true);
      showToast?.("Patient registered!", "success");
      setTimeout(() => { setForm({ name:"", age:"", gender:"", phone:"", symptoms:"" }); setDone(false); }, 2000);
    } catch {
      showToast?.("Registration failed. Try again.", "error");
    }
    setBusy(false);
  };

  const fld = `field${dark ? " dark-field" : ""}`;
  const lbl = {
    display: "block", fontSize: 11, fontWeight: 700,
    marginBottom: 6, letterSpacing: "0.4px", textTransform: "uppercase",
    color: dark ? "rgba(255,255,255,0.5)" : "#4B5E7A",
  };

  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* Name & Age side by side */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:10 }}>
        <div>
          <label style={lbl}>Full Name</label>
          <input name="name" className={fld} placeholder="Aisha Sharma" value={form.name} onChange={set} required />
        </div>
        <div>
          <label style={lbl}>Age</label>
          <input name="age" type="number" className={fld} placeholder="28" value={form.age} onChange={set} required />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label style={lbl}>Gender</label>
        <select name="gender" className={fld} value={form.gender} onChange={set} required>
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
          <option>Prefer not to say</option>
        </select>
      </div>

      {/* Phone */}
      <div>
        <label style={lbl}>Phone Number</label>
        <input name="phone" type="tel" className={fld} placeholder="+91 98765 43210" value={form.phone} onChange={set} required />
      </div>

      {/* Symptoms */}
      <div>
        <label style={lbl}>Symptoms</label>
        <textarea
          name="symptoms"
          className={fld}
          placeholder="Describe what you're experiencing…"
          value={form.symptoms}
          onChange={set}
          required
          rows={3}
          style={{ resize:"none", lineHeight:1.5 }}
        />
      </div>

      <button
        type="submit"
        disabled={busy || done}
        style={{
          width:"100%", padding:"12px 20px",
          borderRadius: 12, border:"none",
          background: done ? "#059669" : busy ? "#8EB8F7" : "linear-gradient(135deg,#1D6AE5,#1558C9)",
          color:"white", fontFamily:"inherit",
          fontSize:14, fontWeight:700, cursor: busy||done ? "not-allowed":"pointer",
          transition:"all 0.2s",
          boxShadow: done||busy ? "none" : "0 4px 16px rgba(29,106,229,0.30)",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        }}
      >
        {done ? "✓ Registered!" : busy ? "Saving…" : "Register Patient"}
      </button>
    </form>
  );
}
