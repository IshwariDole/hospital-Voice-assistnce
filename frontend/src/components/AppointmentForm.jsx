import { useState } from "react";

function AppointmentForm({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    symptoms: "",
    department: "",
    date: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    alert("Appointment Booked ✅");
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.form}>
        <h2>📅 Book Appointment</h2>

        <input placeholder="Name"
          onChange={e=>setForm({...form,name:e.target.value})} />

        <input placeholder="Age"
          onChange={e=>setForm({...form,age:e.target.value})} />

        <input placeholder="Symptoms"
          onChange={e=>setForm({...form,symptoms:e.target.value})} />

        <input placeholder="Department"
          onChange={e=>setForm({...form,department:e.target.value})} />

        <input type="date"
          onChange={e=>setForm({...form,date:e.target.value})} />

        <button onClick={handleSubmit}>Confirm Booking</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

const styles = {
  overlay:{
    position:"fixed",
    top:0,left:0,right:0,bottom:0,
    background:"rgba(0,0,0,0.5)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  form:{
    background:"white",
    padding:"20px",
    borderRadius:"10px",
    display:"flex",
    flexDirection:"column",
    gap:"10px",
    width:"300px"
  }
};

export default AppointmentForm;