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
    <div className="flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-lg bg-white p-5 sm:p-8 rounded-lg shadow-lg border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-center text-blue-700">
          {isEditing ? "🔄 Reschedule Appointment" : "📅 Book Appointment"}
        </h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-md border border-red-200 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">👨‍⚕️ Select Dentist</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={dentist}
              onChange={(e) => setDentist(e.target.value)}
              required
            >
              <option value="">Choose a dentist</option>
              <option value="Dr. Mehta">Dr. Mehta</option>
              <option value="Dr. Rao">Dr. Rao</option>
              <option value="Dr. Sharma">Dr. Sharma</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">📅 Date</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">⏰ Time</label>
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={time}
                min={minTime}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📝 Reason for Visit</label>
            <textarea
              placeholder="Describe your dental concern"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition shadow-md text-base sm:text-lg">
            {isEditing ? "Reschedule Appointment" : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
