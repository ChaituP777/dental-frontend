import React, { useEffect, useState } from "react"
import api from "../../lib/api"

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ name: "", email: "" })

  async function load() {
    const res = await api.get("/users/me")
    setProfile(res.data)
    setForm({ name: res.data.name, email: res.data.email })
  }

  useEffect(() => {
    load()
  }, [])

  async function save() {
    await api.put("/users/me", form)
    setEdit(false)
    load()
  }

  if (!profile) return <p>Loading...</p>

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-xl mb-4">My Profile</h2>

      {!edit ? (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>

          <button
            className="mt-4 bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => setEdit(true)}
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="w-full p-2 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="flex space-x-2">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={save}
            >
              Save
            </button>

            <button
              className="px-3 py-1 rounded border"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
