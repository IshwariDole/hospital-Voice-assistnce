import { useState } from "react";
import axios from "axios";

function PatientForm() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    symptoms: ""
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://hospital-voice-assistnce.onrender.com/api/patients", form);
      alert("Patient Registered Successfully ✅");

      setForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        symptoms: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error saving patient");
    }
  };

  return (
    <div className="container">
      <h2>Patient Registration</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} required />
        <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="symptoms" placeholder="Symptoms" value={form.symptoms} onChange={handleChange} required />

        <button type="submit">Register Patient</button>
      </form>
    </div>
  );
}

export default PatientForm;