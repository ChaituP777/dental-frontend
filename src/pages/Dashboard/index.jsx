import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import Appointments from "./Appointments";
import BookAppointment from "./BookAppointment";
import Profile from "./Profile";
import Notifications from "./Notifications";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    loadUnreadCount();
    // Refresh unread count every 5 seconds
    const interval = setInterval(loadUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadUnreadCount() {
    try {
      const api = (await import("../../lib/api")).default;
      const res = await api.get("/notifications/unread/count");
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error("Failed to load unread count", err);
    }
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6">

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden bg-white p-4 rounded-lg shadow-md border border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-700">Dashboard</h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-blue-600 text-2xl focus:outline-none"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-white p-5 rounded-xl shadow-md border border-gray-100 ${
        menuOpen ? "block" : "hidden"
      } lg:block`}>
        <h2 className="text-xl font-bold mb-4 text-blue-700 hidden lg:block">Dashboard</h2>

        <nav className="flex flex-col space-y-2" onClick={() => setMenuOpen(false)}>

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
            to="/dashboard/notifications"
            className={({ isActive }) =>
              `p-2 rounded-lg transition flex items-center gap-2 ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            Notifications
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
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
      <section className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
        <Routes>
          <Route index element={<Appointments />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="book/:id" element={<BookAppointment />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </section>

    </div>
  );
}
