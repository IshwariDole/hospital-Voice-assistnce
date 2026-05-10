import { useState } from "react";

function BookAppointment() {
  const [form, setForm] = useState({
    name: "",
    department: "",
    time: ""
  });

  const [ticket, setTicket] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/book-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setTicket(data.appointment);
  };

  if (ticket) {
    return (
      <div className="ticket">
        <h2>🎉 Appointment Confirmed</h2>
        <p><b>Name:</b> {ticket.name}</p>
        <p><b>Department:</b> {ticket.department}</p>
        <p><b>Time:</b> {ticket.time}</p>
        <p><b>Booked At:</b> {ticket.date}</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Book Appointment</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your Name"
          required
          onChange={(e)=>setForm({...form, name:e.target.value})}
        />

        <input
          placeholder="Department"
          required
          onChange={(e)=>setForm({...form, department:e.target.value})}
        />

        <input
          placeholder="Preferred Time"
          required
          onChange={(e)=>setForm({...form, time:e.target.value})}
        />

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default BookAppointment;