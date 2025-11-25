import React, { useState } from "react"
import api from "../lib/api"

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [msg, setMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await api.post("/auth/register", form)
      setMsg({ type: "success", text: "Registered successfully. Please login." })
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || "Registration failed",
      })
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {msg && (
        <p
          className={`p-2 mb-4 ${
            msg.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {msg.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          className="w-full p-2 border rounded"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          className="w-full p-2 border rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          className="w-full p-2 border rounded"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  )
}
