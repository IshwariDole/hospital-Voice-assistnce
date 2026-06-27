import { useState } from "react";
import axios from "axios";

function AppointmentForm({ dark, closeForm, showToast }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    department: "",
    phone: "",
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
      showToast?.("Appointment booked successfully! 🎉", "success");
      closeForm();
    } catch {
      showToast?.("Error booking appointment. Try again.", "error");
    }

    setSubmitting(false);
  };

  const fieldCls = `w-full px-4 py-3 rounded-xl border outline-none transition text-sm ${
    dark
      ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
      : "bg-gray-50 border-gray-200 focus:border-blue-400 focus:bg-white"
  }`;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">📅 Book Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          value={form.name}
          required
          className={fieldCls}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleChange}
          value={form.age}
          required
          className={fieldCls}
        />
        <select
          name="gender"
          onChange={handleChange}
          value={form.gender}
          required
          className={fieldCls}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <select
          name="department"
          onChange={handleChange}
          value={form.department}
          required
          className={fieldCls}
        >
          <option value="">Select Department</option>
          <option>General Physician</option>
          <option>Cardiologist</option>
          <option>Dermatologist</option>
          <option>Orthopedic</option>
          <option>Pediatrician</option>
          <option>Ophthalmologist</option>
          <option>Neurologist</option>
        </select>
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          value={form.phone}
          required
          className={fieldCls}
        />

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition"
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
          <button
            type="button"
            onClick={closeForm}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition active:scale-95 ${
              dark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;
