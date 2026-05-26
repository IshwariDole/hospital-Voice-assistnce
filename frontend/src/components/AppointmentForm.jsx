import { useState } from "react";
import axios from "axios";

function AppointmentForm({ dark, closeForm }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    department: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://hospital-voice-assistnce.onrender.com/api/patients",
        form,
      );

      alert("✅ Appointment Booked!");

      closeForm();
    } catch (err) {
      console.error(err);

      alert("❌ Error booking appointment");
    }
  };

  return (
    <div
      className={`mt-6 p-6 rounded-3xl shadow-xl transition-all duration-300 ${
        dark ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        📅 Book Appointment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-xl border outline-none ${
            dark
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-gray-100 border-gray-300"
          }`}
        />

        {/* AGE */}
        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-xl border outline-none ${
            dark
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-gray-100 border-gray-300"
          }`}
        />

        {/* GENDER */}
        <select
          name="gender"
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-xl border outline-none ${
            dark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        {/* DEPARTMENT */}
        <select
          name="department"
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-xl border outline-none ${
            dark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <option value="">Select Department</option>
          <option>General Physician</option>
          <option>Cardiologist</option>
          <option>Dermatologist</option>
          <option>Orthopedic</option>
          <option>Pediatrician</option>
          <option>Ophthalmologist</option>
        </select>

        {/* PHONE */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
          className={`w-full p-3 rounded-xl border outline-none ${
            dark
              ? "bg-gray-700 text-white border-white placeholder-white-300"
              : "bg-gray-100 border-gray-300"
          }`}
        />

        {/* BUTTONS */}
        <div className="flex gap-3 pt-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={closeForm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;
