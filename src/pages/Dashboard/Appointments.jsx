import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

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

  function handleReschedule(appt) {
    // send appointment data to form to prefill
    navigate(`/dashboard/book/${appt.id}`, { state: appt });
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
    <div className="p-2 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-blue-700">🗓️ My Appointments</h2>

      {appointments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-base sm:text-lg">You have no appointments.</p>
          <button
            onClick={() => navigate('/dashboard/book')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Book Now
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white p-4 sm:p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <p className="font-bold text-base sm:text-lg text-blue-700">👨‍⚕️ {appt.dentist}</p>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    📅 {formatDate(appt.datetime)}
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base mt-2">
                    <strong>Reason:</strong> {appt.reason}
                  </p>
                  {/* Status message */}
                  {appt.status === "pending" && (
                    <p className="mt-2 text-yellow-600 font-medium text-sm sm:text-base bg-yellow-50 inline-block px-2 py-1 rounded">⏳ Pending — awaiting admin approval</p>
                  )}
                  {appt.status === "booked" && (
                    <p className="mt-2 text-green-600 font-medium text-sm sm:text-base bg-green-50 inline-block px-2 py-1 rounded">✅ Booked</p>
                  )}
                  {appt.status === "cancelled" && (
                    <p className="mt-2 text-red-600 font-medium text-sm sm:text-base bg-red-50 inline-block px-2 py-1 rounded">❌ Doctor not available — please reschedule</p>
                  )}
                </div>

                <div className="flex flex-row sm:flex-col gap-2">
                  {/* For cancelled appointments show only reschedule (so user can pick a new slot) */}
                  {appt.status === "cancelled" ? (
                    <button
                      onClick={() => handleReschedule(appt)}
                      className="flex-1 sm:flex-none bg-yellow-500 text-white px-3 sm:px-4 py-2 rounded-md shadow hover:bg-yellow-600 transition text-sm sm:text-base font-medium"
                    >
                      Reschedule
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReschedule(appt)}
                        className="flex-1 sm:flex-none bg-yellow-500 text-white px-3 sm:px-4 py-2 rounded-md shadow hover:bg-yellow-600 transition text-sm sm:text-base font-medium"
                      >
                        Reschedule
                      </button>

                      <button
                        onClick={() => cancel(appt.id)}
                        className="flex-1 sm:flex-none bg-red-500 text-white px-3 sm:px-4 py-2 rounded-md shadow hover:bg-red-600 transition text-sm sm:text-base font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
