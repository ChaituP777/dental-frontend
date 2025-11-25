import React, { useState } from "react";
import api from "../lib/api";
import { saveToken } from "../lib/auth";
import { useNavigate } from "react-router-dom";

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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>

      {msg && (
        <p className="p-2 bg-red-100 text-red-700 mb-4">{msg.text}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          required
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
