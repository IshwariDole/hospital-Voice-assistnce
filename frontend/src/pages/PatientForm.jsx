import { useState } from "react";
import axios from "axios";

function PatientForm({ dark, showToast }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    symptoms: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        "https://hospital-voice-assistnce.onrender.com/api/patients",
        form
      );
      showToast?.("Patient registered successfully!", "success");
      setForm({ name: "", age: "", gender: "", phone: "", symptoms: "" });
    } catch {
      showToast?.("Error saving patient. Try again.", "error");
    }

    setSubmitting(false);
  };

  const fieldCls = `w-full px-4 py-3 rounded-xl border outline-none transition text-sm ${
    dark
      ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
      : "bg-gray-50 border-gray-200 focus:border-blue-400 focus:bg-white"
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className={fieldCls}
      />
      <input
        name="age"
        placeholder="Age"
        type="number"
        value={form.age}
        onChange={handleChange}
        required
        className={fieldCls}
      />
      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        required
        className={fieldCls}
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
        className={fieldCls}
      />
      <textarea
        name="symptoms"
        placeholder="Describe symptoms..."
        value={form.symptoms}
        onChange={handleChange}
        required
        rows={3}
        className={`${fieldCls} resize-none`}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition"
      >
        {submitting ? "Registering..." : "Register Patient"}
      </button>
    </form>
  );
}

export default PatientForm;
