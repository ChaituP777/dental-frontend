import React, { useState } from "react";
import api from "../../lib/api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const editingAppointment = location.state || null;
  const isEditing = Boolean(id);

  let initialDate = "";
  let initialTime = "";

  if (editingAppointment?.datetime) {
    const mysqlDateTime = editingAppointment.datetime; // e.g. "2025-03-01 10:30:00"
    const jsFormat = mysqlDateTime.replace(" ", "T");
    const dateObj = new Date(jsFormat);

    if (!isNaN(dateObj)) {
      initialDate = dateObj.toISOString().slice(0, 10); // "YYYY-MM-DD"
      initialTime = dateObj.toTimeString().slice(0, 5); // "HH:MM"
    } else {
      const [dStr, tStr] = mysqlDateTime.split(" ");
      if (dStr) initialDate = dStr;
      if (tStr) initialTime = tStr.slice(0, 5);
    }
  }

  const [dentist, setDentist] = useState(editingAppointment?.dentist || "");
  const [reason, setReason] = useState(editingAppointment?.reason || "");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [error, setError] = useState("");

  // today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  // if booking for today → prevent past times
  const minTime = date === today ? currentTime : "00:00";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const datetime = `${date} ${time}:00`;

      if (!date || !time || !dentist || !reason) {
        setError("Please fill in all fields");
        return;
      }

      if (isEditing) {
        await api.put(`/appointments/${id}`, {
          dentist,
          reason,
          datetime,
        });
      } else {
        await api.post("/appointments", {
          dentist,
          reason,
          datetime,
        });
      }

      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || (isEditing ? "Failed to reschedule appointment" : "Failed to book appointment"));
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-2xl mb-4">
        {isEditing ? "Reschedule Appointment" : "Book Appointment"}
      </h2>

      {error && (
        <div className="mb-4 text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={dentist}
          onChange={(e) => setDentist(e.target.value)}
          required
        >
          <option value="">Select Dentist</option>
          <option value="Dr. Mehta">Dr. Mehta</option>
          <option value="Dr. Rao">Dr. Rao</option>
          <option value="Dr. Sharma">Dr. Sharma</option>
        </select>

        <div className="flex space-x-3">
          <input
            type="date"
            className="flex-1 p-2 border rounded"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="time"
            className="flex-1 p-2 border rounded"
            value={time}
            min={minTime}
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
          {isEditing ? "Reschedule Appointment" : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}
