import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { getUserFromToken } from "../lib/auth";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [newAppointmentNotifications, setNewAppointmentNotifications] = useState([]);

  const user = getUserFromToken();

  useEffect(() => {
    loadAdminData();
    // Refresh new appointments every 5 seconds
    const interval = setInterval(() => {
      loadNewAppointmentNotifications();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadAdminData() {
    try {
      const u = await api.get("/admin/users");
      const a = await api.get("/admin/appointments");
      setUsers(u.data);
      setAppointments(a.data);
      loadNewAppointmentNotifications();
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  async function loadNewAppointmentNotifications() {
    try {
      const res = await api.get("/admin/notifications/pending-count");
      setNewAppointmentNotifications(res.data);
    } catch (err) {
      console.error("Error loading pending count:", err);
    }
  }

  if (!user || user.role !== "admin") {
    return <h2 className="text-center text-red-600 text-xl">Access Denied 🚫</h2>;
  }

  const totalPending = appointments.filter(a => a.status === "pending").length;
  const totalBooked = appointments.filter(a => a.status === "booked").length;
  const totalCancelled = appointments.filter(a => a.status === "cancelled").length;
  const today = new Date().toISOString().slice(0,10);
  const todayAppointments = appointments.filter(a => a.datetime.startsWith(today)).length;

  const filteredAppointments = appointmentFilter === "all" 
    ? appointments 
    : appointments.filter(a => a.status === appointmentFilter);

  async function approveAppointment(appointmentId) {
    try {
      await api.put(`/admin/appointments/${appointmentId}/approve`);
      loadAdminData();
    } catch (err) {
      console.error("Error approving appointment:", err);
    }
  }

  async function rejectAppointment(appointmentId) {
    try {
      await api.put(`/admin/appointments/${appointmentId}/reject`);
      loadAdminData();
    } catch (err) {
      console.error("Error rejecting appointment:", err);
    }
  }

  return (
    <div className="space-y-12">

      {/* ===================== HEADER ===================== */}
      <h1 className="text-4xl font-bold text-blue-700">Admin Dashboard</h1>
      <p className="text-gray-600">Manage users, appointments & system overview</p>

      {/* ===================== NOTIFICATION ALERT ===================== */}
      {totalPending > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-yellow-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📢</span>
            <div>
              <h3 className="font-bold text-lg">New Appointment Requests!</h3>
              <p>You have <span className="font-bold">{totalPending}</span> pending appointment(s) waiting for your approval.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===================== STATS CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        <StatCard title="Total Users" value={users.length} color="bg-blue-500" />
        <StatCard title="Pending" value={totalPending} color="bg-yellow-500" />
        <StatCard title="Active Bookings" value={totalBooked} color="bg-green-500" />
        <StatCard title="Cancelled" value={totalCancelled} color="bg-red-500" />
        <StatCard title="Today's Appointments" value={todayAppointments} color="bg-purple-500 col-span-1 md:col-span-4" />

      </div>


      {/* ===================== USERS TABLE ===================== */}
      <section className="bg-white p-5 rounded-lg shadow-lg border">
        <h2 className="text-2xl font-semibold mb-3 text-blue-600">Users</h2>

        <table className="min-w-full border text-left rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border font-semibold">{u.name}</td>
                <td className="p-2 border text-blue-700">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>



      {/* ===================== APPOINTMENTS TABLE ===================== */}
      <section className="bg-white p-5 rounded-lg shadow-lg border">
        <h2 className="text-2xl font-semibold mb-3 text-green-600">
          {appointmentFilter === "all" && "All Appointments"}
          {appointmentFilter === "pending" && "Pending Appointments"}
          {appointmentFilter === "booked" && "Booked Appointments"}
          {appointmentFilter === "cancelled" && "Cancelled Appointments"}
        </h2>

        <div className="mb-4 flex gap-3 flex-wrap">
          <button
            onClick={() => setAppointmentFilter("all")}
            className={`px-4 py-2 rounded font-semibold transition ${
              appointmentFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setAppointmentFilter("pending")}
            className={`px-4 py-2 rounded font-semibold transition ${
              appointmentFilter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setAppointmentFilter("booked")}
            className={`px-4 py-2 rounded font-semibold transition ${
              appointmentFilter === "booked"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Booked
          </button>
          <button
            onClick={() => setAppointmentFilter("cancelled")}
            className={`px-4 py-2 rounded font-semibold transition ${
              appointmentFilter === "cancelled"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Cancelled
          </button>
        </div>

        <div className="overflow-x-auto">
        <table className="min-w-full border rounded text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Dentist</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="p-2 border">{a.id}</td>
                <td className="p-2 border font-semibold">{a.user_name}</td>
                <td className="p-2 border text-blue-700">{a.user_email}</td>
                <td className="p-2 border">{a.dentist}</td>
                <td className="p-2 border">{a.reason}</td>
                <td className="p-2 border font-medium text-indigo-600">
                  {new Date(a.datetime.replace(" ", "T")).toLocaleString()}
                </td>
                <td className="p-2 border font-bold">
                  {a.status === "pending" && (
                    <span className="text-yellow-600">Pending</span>
                  )}
                  {a.status === "cancelled" && (
                    <span className="text-red-600">Cancelled</span>
                  )}
                  {a.status === "booked" && (
                    <span className="text-green-600">Booked</span>
                  )}
                </td>
                <td className="p-2 border">
                  {a.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveAppointment(a.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectAppointment(a.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {a.status === "booked" && (
                    <button
                      onClick={() => rejectAppointment(a.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>

    </div>
  );
}



function StatCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-lg shadow-md text-white ${color}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}
