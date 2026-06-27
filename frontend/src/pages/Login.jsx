import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setLoading(false);
      nav("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-blue-600 items-center justify-center text-3xl mb-4 shadow-xl">
            🏥
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Hospital Assistant</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-7 shadow-2xl space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@hospital.com"
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition text-sm"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-70 text-white py-4 rounded-2xl font-semibold text-sm transition mt-2 shadow-lg shadow-blue-200"
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          AI Hospital © 2025 — Powered by MERN + Gemini
        </p>
      </div>
    </div>
  );
}
