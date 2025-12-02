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
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500 bg-white p-4 rounded shadow">
          You have no appointments.
        </p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <div>
                <p className="font-semibold text-lg">{appt.dentist}</p>
                <p className="text-gray-600 text-sm">
                  {formatDate(appt.datetime)}
                </p>
                <p className="text-gray-600">
                  <strong>Reason:</strong> {appt.reason}
                </p>
                {/* Status message */}
                {appt.status === "pending" && (
                  <p className="mt-2 text-yellow-600 font-medium">Pending — awaiting admin approval</p>
                )}
                {appt.status === "booked" && (
                  <p className="mt-2 text-green-600 font-medium">Booked</p>
                )}
                {appt.status === "cancelled" && (
                  <p className="mt-2 text-red-600 font-medium">Doctor not available — please reschedule</p>
                )}
              </div>

              <div className="flex space-x-2">
                {/* For cancelled appointments show only reschedule (so user can pick a new slot) */}
                {appt.status === "cancelled" ? (
                  <button
                    onClick={() => handleReschedule(appt)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600 transition"
                  >
                    Reschedule
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleReschedule(appt)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600 transition"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => cancel(appt.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
