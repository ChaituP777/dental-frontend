import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { getUserFromToken } from "../lib/auth";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const user = getUserFromToken();

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    const u = await api.get("/admin/users");
    const a = await api.get("/admin/appointments");
    setUsers(u.data);
    setAppointments(a.data);
  }

  if (!user || user.role !== "admin") {
    return <h2 className="text-center text-red-600 text-xl">Access Denied 🚫</h2>;
  }

  const totalBooked = appointments.filter(a => a.status === "booked").length;
  const totalCancelled = appointments.filter(a => a.status === "cancelled").length;
  const today = new Date().toISOString().slice(0,10);
  const todayAppointments = appointments.filter(a => a.datetime.startsWith(today)).length;

  return (
    <div className="space-y-12">

      {/* ===================== HEADER ===================== */}
      <h1 className="text-4xl font-bold text-blue-700">Admin Dashboard</h1>
      <p className="text-gray-600">Manage users, appointments & system overview</p>

      {/* ===================== STATS CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <StatCard title="Total Users" value={users.length} color="bg-blue-500" />
        <StatCard title="Active Bookings" value={totalBooked} color="bg-green-500" />
        <StatCard title="Cancelled" value={totalCancelled} color="bg-red-500" />
        <StatCard title="Today's Appointments" value={todayAppointments} color="bg-purple-500 col-span-1 md:col-span-3" />

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
          All Appointments
        </h2>

        <table className="min-w-full border rounded text-sm overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Dentist</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map(a => (
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
                  {a.status === "cancelled" ? (
                    <span className="text-red-600">Cancelled</span>
                  ) : (
                    <span className="text-green-600">Booked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
