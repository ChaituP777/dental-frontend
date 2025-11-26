import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import Appointments from "./Appointments";
import BookAppointment from "./BookAppointment";
import Profile from "./Profile";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* Sidebar */}
      <aside className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Dashboard</h2>

        <nav className="flex flex-col space-y-2">

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `p-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            My Appointments
          </NavLink>

          <NavLink
            to="/dashboard/book"
            className={({ isActive }) =>
              `p-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            Book Appointment
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `p-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            My Profile
          </NavLink>

        </nav>
      </aside>

           {/* Main Content */}
      <section className="md:col-span-3 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <Routes>
          <Route index element={<Appointments />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="book/:id" element={<BookAppointment />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </section>

    </div>
  );
}
