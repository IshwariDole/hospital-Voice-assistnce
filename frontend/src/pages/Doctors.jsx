import { useNavigate } from "react-router-dom";

const DOCTORS = [
  { name:"Dr. Priya Sharma",   dept:"Cardiology",       exp:"12 yrs", next:"Today, 3:00 PM",  available:true,  icon:"❤️",  color:"#FEE2E2", accent:"#DC2626" },
  { name:"Dr. Arjun Patel",    dept:"Dermatology",      exp:"8 yrs",  next:"Today, 5:30 PM",  available:true,  icon:"🧴",  color:"#FEF3C7", accent:"#D97706" },
  { name:"Dr. Faiz Khan",      dept:"Orthopedic",       exp:"15 yrs", next:"Tomorrow, 10 AM", available:false, icon:"🦴",  color:"#E0E7FF", accent:"#4F46E5" },
  { name:"Dr. Sunita Mehta",   dept:"Neurology",        exp:"10 yrs", next:"Today, 2:00 PM",  available:true,  icon:"🧠",  color:"#F3E8FF", accent:"#7C3AED" },
  { name:"Dr. Kavya Reddy",    dept:"Pediatrics",       exp:"9 yrs",  next:"Today, 4:00 PM",  available:true,  icon:"👶",  color:"#DCFCE7", accent:"#059669" },
  { name:"Dr. Rahul Joshi",    dept:"General Physician", exp:"6 yrs", next:"Tomorrow, 9 AM",  available:false, icon:"🩺",  color:"#E0F2FE", accent:"#0284C7" },
  { name:"Dr. Anita Verma",    dept:"Ophthalmology",    exp:"11 yrs", next:"Today, 6:00 PM",  available:true,  icon:"👁️",  color:"#FFF7ED", accent:"#EA580C" },
  { name:"Dr. Kiran Desai",    dept:"Neurology",        exp:"7 yrs",  next:"Tomorrow, 11 AM", available:false, icon:"🧠",  color:"#F3E8FF", accent:"#7C3AED" },
];

function DoctorCard({ d }) {
  return (
    <div
      style={{
        background:"white",
        borderRadius:20,
        overflow:"hidden",
        boxShadow:"0 2px 12px rgba(11,29,53,0.07)",
        border:"1px solid #DDE6F5",
        transition:"transform 0.2s, box-shadow 0.2s",
        cursor:"pointer",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(11,29,53,0.13)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(11,29,53,0.07)";
      }}
    >
      {/* Coloured top band */}
      <div style={{
        height:6, background:`linear-gradient(90deg, ${d.accent}, ${d.accent}88)`,
      }} />

      <div style={{ padding:"20px" }}>
        {/* Avatar + availability */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div style={{
            width:56, height:56, borderRadius:16,
            background: d.color,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28,
          }}>{d.icon}</div>

          <span style={{
            display:"inline-flex", alignItems:"center", gap:5,
            padding:"4px 10px", borderRadius:100,
            background: d.available ? "#DCFCE7" : "#F3F4F6",
            fontSize:10, fontWeight:700,
            color: d.available ? "#059669" : "#6B7280",
          }}>
            <span style={{
              width:6, height:6, borderRadius:"50%",
              background: d.available ? "#059669" : "#9CA3AF",
              display:"inline-block",
            }} />
            {d.available ? "Available" : "Busy"}
          </span>
        </div>

        {/* Info */}
        <h3 style={{ fontSize:15, fontWeight:800, color:"#0B1D35", letterSpacing:"-0.3px", marginBottom:4 }}>
          {d.name}
        </h3>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
          <span style={{
            padding:"3px 10px", borderRadius:100,
            background: d.color, color: d.accent,
            fontSize:11, fontWeight:700,
          }}>{d.dept}</span>
          <span style={{ fontSize:11, color:"#8B9AB3" }}>{d.exp}</span>
        </div>

        {/* Next slot */}
        <div style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"8px 12px", borderRadius:10,
          background:"#F7FAFE", marginBottom:14,
        }}>
          <span style={{ fontSize:13 }}>🕐</span>
          <span style={{ fontSize:12, color:"#4B5E7A", fontWeight:600 }}>Next: {d.next}</span>
        </div>

        {/* Book button */}
        <button
          style={{
            width:"100%", padding:"11px",
            borderRadius:12, border:"none",
            background: d.available
              ? `linear-gradient(135deg, ${d.accent}, ${d.accent}CC)`
              : "#F3F4F6",
            color: d.available ? "white" : "#9CA3AF",
            fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",
            fontSize:13, fontWeight:700,
            cursor: d.available ? "pointer" : "not-allowed",
            transition:"opacity 0.2s, transform 0.1s",
          }}
          onMouseDown={e => { if (d.available) e.currentTarget.style.transform = "scale(0.97)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {d.available ? "Book Appointment" : "Check Later"}
        </button>
      </div>
    </div>
  );
}

export default function Doctors() {
  const nav = useNavigate();

  return (
    <div
      className="page-in"
      style={{
        minHeight:"100dvh",
        background:"#F7FAFE",
        fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        position:"sticky", top:0, zIndex:10,
        background:"rgba(247,250,254,0.90)",
        backdropFilter:"blur(12px)",
        borderBottom:"1px solid #DDE6F5",
        padding:"16px 24px",
        display:"flex", alignItems:"center", gap:12,
      }}>
        <button
          onClick={() => nav(-1)}
          style={{
            width:36, height:36, borderRadius:10,
            background:"white", border:"1px solid #DDE6F5",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16, cursor:"pointer",
            boxShadow:"0 1px 4px rgba(11,29,53,0.06)",
            transition:"background 0.15s",
          }}
          title="Back"
        >←</button>

        <div>
          <h1 style={{ fontSize:18, fontWeight:800, color:"#0B1D35", letterSpacing:"-0.4px" }}>
            Our Specialists
          </h1>
          <p style={{ fontSize:12, color:"#8B9AB3", marginTop:2 }}>
            {DOCTORS.filter(d => d.available).length} doctors available today
          </p>
        </div>

        {/* Legend */}
        <div style={{ marginLeft:"auto", display:"flex", gap:14 }}>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#4B5E7A", fontWeight:600 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#059669", display:"inline-block" }} /> Available
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#4B5E7A", fontWeight:600 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#9CA3AF", display:"inline-block" }} /> Busy
          </span>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",
        gap:16, padding:24,
      }}>
        {DOCTORS.map((d, i) => <DoctorCard key={i} d={d} />)}
      </div>
    </div>
  );
}
