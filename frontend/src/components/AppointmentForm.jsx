import { useState } from "react";
import axios from "axios";

const DEPTS = [
  { value:"General Physician", icon:"🩺" },
  { value:"Cardiologist",      icon:"❤️" },
  { value:"Dermatologist",     icon:"🧴" },
  { value:"Orthopedic",        icon:"🦴" },
  { value:"Pediatrician",      icon:"👶" },
  { value:"Ophthalmologist",   icon:"👁️" },
  { value:"Neurologist",       icon:"🧠" },
];

export default function AppointmentForm({ dark, closeForm, showToast, prefillDept="" }) {
  const [form, setForm] = useState({
    name:"", age:"", gender:"", department: prefillDept, phone:"",
  });
  const [busy, setBusy]   = useState(false);
  const [done, setDone]   = useState(false);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    try {
      await axios.post("https://hospital-voice-assistnce.onrender.com/api/patients", form);
      setDone(true);
      showToast?.("Appointment booked! 🎉", "success");
      setTimeout(() => closeForm(), 1800);
    } catch {
      showToast?.("Booking failed. Try again.", "error");
    }
    setBusy(false);
  };

  const fld = `field${dark ? " dark-field" : ""}`;
  const lbl = {
    display:"block", fontSize:11, fontWeight:700,
    marginBottom:6, letterSpacing:"0.4px", textTransform:"uppercase",
    color: dark ? "rgba(255,255,255,0.5)" : "#4B5E7A",
  };

  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:10 }}>
        <div>
          <label style={lbl}>Full Name</label>
          <input name="name" className={fld} placeholder="Your name" value={form.name} onChange={set} required />
        </div>
        <div>
          <label style={lbl}>Age</label>
          <input name="age" type="number" className={fld} placeholder="28" value={form.age} onChange={set} required />
        </div>
      </div>

      <div>
        <label style={lbl}>Gender</label>
        <select name="gender" className={fld} value={form.gender} onChange={set} required>
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label style={lbl}>Department</label>
        <select name="department" className={fld} value={form.department} onChange={set} required>
          <option value="">Choose department</option>
          {DEPTS.map(d => (
            <option key={d.value} value={d.value}>{d.icon} {d.value}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={lbl}>Phone Number</label>
        <input name="phone" type="tel" className={fld} placeholder="+91 98765 43210" value={form.phone} onChange={set} required />
      </div>

      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button
          type="submit"
          disabled={busy || done}
          style={{
            flex:1, padding:"12px",
            borderRadius:12, border:"none",
            background: done ? "#059669" : busy ? "#8EB8F7" : "linear-gradient(135deg,#1D6AE5,#1558C9)",
            color:"white", fontFamily:"inherit",
            fontSize:14, fontWeight:700,
            cursor: busy||done ? "not-allowed" : "pointer",
            boxShadow: done||busy ? "none" : "0 4px 16px rgba(29,106,229,0.28)",
            transition:"all 0.2s",
          }}
        >
          {done ? "✓ Booked!" : busy ? "Booking…" : "Confirm Booking"}
        </button>

        <button
          type="button"
          onClick={closeForm}
          style={{
            padding:"12px 18px",
            borderRadius:12,
            border: `1.5px solid ${dark ? "rgba(255,255,255,0.15)" : "#DDE6F5"}`,
            background:"transparent",
            color: dark ? "rgba(255,255,255,0.65)" : "#4B5E7A",
            fontFamily:"inherit", fontSize:14, fontWeight:600,
            cursor:"pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
