import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  async function load() {
    try {
      const res = await api.get("/appointments/my");
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  }

  async function cancel(id) {
    try {
      await api.delete(`/appointments/${id}`);
      load();
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function formatDate(mysqlDate) {
    const jsFormat = mysqlDate.replace(" ", "T");
    const dateObj = new Date(jsFormat);

    if (isNaN(dateObj)) return "Invalid Date";

    return dateObj.toLocaleString();
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500 bg-white p-4 rounded shadow">
          You have no appointments booked yet.
        </p>
      ) : (
        <div className="space-y-5">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-5 bg-white rounded-xl shadow-md border border-gray-100 flex justify-between items-start hover:shadow-lg transition"
            >
              <div>
                <p className="text-lg font-semibold text-blue-700 mb-1">
                  Dentist: {appt.dentist}
                </p>

                <p className="text-gray-600 mb-1">
                  <strong>Date & Time:</strong> {formatDate(appt.datetime)}
                </p>

                <p className="text-gray-600">
                  <strong>Reason:</strong> {appt.reason}
                </p>
              </div>

              <button
                onClick={() => cancel(appt.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
