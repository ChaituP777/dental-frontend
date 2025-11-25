import React, { useState } from "react";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const [dentist, setDentist] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // Get current time (HH:MM)
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  // Determine minimum time allowed
  const minTime = date === today ? currentTime : "00:00";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const datetime = `${date} ${time}:00`; // MySQL format

      await api.post("/appointments", {
        dentist,
        reason,
        datetime,
      });

      navigate("/dashboard/appointments");
    } catch (err) {
      setError("Failed to book appointment");
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-2xl mb-4">Book Appointment</h2>

      {error && (
        <p className="p-2 mb-3 bg-red-100 text-red-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Dentist Name"
          value={dentist}
          onChange={(e) => setDentist(e.target.value)}
          required
        />

        <div className="flex space-x-3">
          <input
            type="date"
            className="flex-1 p-2 border rounded"
            value={date}
            min={today}           // ⬅️ prevents selecting past dates
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="time"
            className="flex-1 p-2 border rounded"
            value={time}
            min={minTime}         // ⬅️ prevents past time on today's date
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <textarea
          placeholder="Reason"
          className="w-full p-2 border rounded"
          rows="3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Book Appointment
        </button>
      </form>
    </div>
  );
}
