import { useState } from "react";
import axios from "axios";

function AppointmentForm({ closeForm }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    department: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/patients", form);

      alert("✅ Appointment Booked!");
      closeForm(); // close popup
    } catch (err) {
      console.error(err);
      alert("❌ Error booking appointment");
    }
  };

  return (
    <div className="form-popup">
      <div className="form-card">
        <h2>Book Appointment</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="age"
            placeholder="Age"
            onChange={handleChange}
            required
          />

          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <select name="department" onChange={handleChange} required>
            <option value="">Select Department</option>
            <option>General Physician</option>
            <option>Cardiologist</option>
            <option>Dermatologist</option>
            <option>Orthopedic</option>
            <option>Pediatrician</option>
            <option>Ophthalmologist</option>
          </select>

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <button type="submit">Submit</button>
          <button type="button" onClick={closeForm}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default AppointmentForm;