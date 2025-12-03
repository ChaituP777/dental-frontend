import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";         // User Dashboard
import AdminDashboard from "./pages/AdminDashboard"; // Admin Dashboard

import { getUserFromToken, clearToken } from "./lib/auth";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationCenter from "./components/NotificationCenter";


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
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 flex justify-between items-center">
        
        <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
          🦷 DentalCare
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">

          {/* Not logged in */}
          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-600 text-sm sm:text-base px-2 py-1">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base hover:bg-blue-700 transition">
                Register
              </Link>
            </>
          )}

          {/* Logged In */}
          {user && (
            <>
              {/* USER SEE THIS ONLY */}
              {user.role === "user" && (
                <Link to="/dashboard" className="hover:text-blue-600 text-sm sm:text-base px-2 py-1 hidden sm:inline">
                  Dashboard
                </Link>
              )}

              {/* ADMIN SEE ONLY ADMIN PANEL */}
              {user.role === "admin" && (
                <Link to="/admin" className="text-amber-600 font-semibold hover:text-amber-700 text-sm sm:text-base px-2 py-1 hidden sm:inline">
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base hover:bg-red-600 transition"
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
    <NotificationProvider>
      <div>
        <NavbarComponent />
        <NotificationCenter />

        <main className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
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
    </NotificationProvider>
  );
}



// ====================== PUBLIC HOME PAGE ======================
function Home() {
  return (
    <section className="text-center py-8 sm:py-12 lg:py-16 px-4">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-blue-700">🦷 Dental Appointment Booking</h1>
      <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">Easy scheduling — full admin control. Book your dental appointments hassle-free.</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-md">
          Get Started
        </Link>
        <Link to="/login" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition shadow-md">
          Login
        </Link>
      </div>
    </section>
  );
}
