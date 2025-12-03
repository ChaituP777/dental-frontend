import React, { useState } from "react"
import api from "../lib/api"
import { Link } from "react-router-dom"

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
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">📝 Register</h2>

        {msg && (
          <p
            className={`p-3 mb-4 rounded-md text-sm sm:text-base ${
              msg.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {msg.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Create a password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition shadow-md text-base sm:text-lg">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
