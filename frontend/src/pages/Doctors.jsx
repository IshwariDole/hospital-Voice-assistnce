import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const doctors = [
  { name: "Dr. Sharma",   dept: "Cardiology",       exp: "12 yrs", icon: "❤️" },
  { name: "Dr. Patel",    dept: "Dermatology",       exp: "8 yrs",  icon: "🧴" },
  { name: "Dr. Khan",     dept: "Orthopedic",        exp: "15 yrs", icon: "🦴" },
  { name: "Dr. Mehta",    dept: "Neurology",         exp: "10 yrs", icon: "🧠" },
  { name: "Dr. Reddy",    dept: "Pediatrics",        exp: "9 yrs",  icon: "👶" },
  { name: "Dr. Joshi",    dept: "General Physician", exp: "6 yrs",  icon: "🩺" },
];

export default function Doctors() {
  const nav = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-4 md:px-8 py-4 shadow-sm flex items-center gap-3">
        <button
          onClick={() => nav(-1)}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-90 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">👨‍⚕️ Our Doctors</h1>
          <p className="text-xs text-gray-500">Available for consultation</p>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((d, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-4 shadow-inner">
              {d.icon}
            </div>

            {/* Info */}
            <h2 className="font-bold text-gray-900 text-base">{d.name}</h2>
            <p className="text-blue-600 text-sm font-medium mt-0.5">{d.dept}</p>
            <p className="text-gray-400 text-xs mt-1">Experience: {d.exp}</p>

            {/* Action */}
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 rounded-xl text-sm font-semibold transition">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
