import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";         // User Dashboard
import AdminDashboard from "./pages/AdminDashboard"; // Admin Dashboard

import { getUserFromToken, clearToken } from "./lib/auth";


// ====================== NAVBAR ======================
function NavbarComponent() {
  const [user, setUser] = React.useState(getUserFromToken());

  React.useEffect(() => {
    function updateUser() {
      setUser(getUserFromToken());
    }

    window.addEventListener("token-changed", updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("token-changed", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    window.dispatchEvent(new Event("token-changed")); // refresh role UI
    window.location.href = "/login";
  };


  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold">DentalCare</Link>

        <nav className="space-x-3">

          {/* Not logged in */}
          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded">
                Register
              </Link>
            </>
          )}

          {/* Logged In */}
          {user && (
            <>
              {/* USER SEE THIS ONLY */}
              {user.role === "user" && (
                <Link to="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
              )}

              {/* ADMIN SEE ONLY ADMIN PANEL */}
              {user.role === "admin" && (
                <Link to="/admin" className="text-amber-600 font-semibold hover:text-amber-700">
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}



// ====================== AUTH GUARD ======================
function RequireAuth({ children }) {
  const user = getUserFromToken();
  return user ? children : <Navigate to="/login" replace />;
}



// ====================== MAIN APP ======================
export default function App() {

  // LIVE USER TRACKER ✔ prevents redirect issues
  const [user, setUser] = React.useState(getUserFromToken());

  React.useEffect(() => {
    function refreshUser() {
      setUser(getUserFromToken());
    }

    window.addEventListener("token-changed", refreshUser);
    window.addEventListener("storage", refreshUser);

    return () => {
      window.removeEventListener("token-changed", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);


  return (
    <div>
      <NavbarComponent />

      <main className="max-w-6xl mx-auto p-4">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* USER CANNOT ACCESS ADMIN PAGE */}
          <Route
            path="/admin"
            element={
              user?.role !== "admin"
                ? <Navigate to="/dashboard" replace />
                : <RequireAuth><AdminDashboard /></RequireAuth>
            }
          />

          {/* ADMIN CANNOT ACCESS USER DASHBOARD */}
          <Route 
            path="/dashboard/*"
            element={
              user?.role === "admin"
                ? <Navigate to="/admin" replace />
                : <RequireAuth><Dashboard /></RequireAuth>
            }
          />

        </Routes>
      </main>
    </div>
  );
}



// ====================== PUBLIC HOME PAGE ======================
function Home() {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">Dental Appointment Booking</h1>
      <p className="text-gray-600 text-lg">Easy scheduling — full admin control.</p>
    </section>
  );
}
