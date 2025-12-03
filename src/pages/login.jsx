import React, { useState } from "react";
import api from "../lib/api";
import { saveToken } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      // Save token
      saveToken(res.data.token);

      // 🔥 Trigger navbar update immediately
      window.dispatchEvent(new Event("token-changed"));

      // Go to dashboard
      nav("/dashboard");
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || "Login failed",
      });
    }
  }

    return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">🔐 Login</h2>

        {msg && (
          <p className="p-3 bg-red-100 text-red-700 mb-4 rounded-md text-sm sm:text-base">{msg.text}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              required
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              required
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition shadow-md text-base sm:text-lg">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm sm:text-base">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-semibold">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
