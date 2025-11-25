import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";

import { getUserFromToken, clearToken } from "./lib/auth";

function NavbarComponent() {
  const [user, setUser] = React.useState(getUserFromToken());

  // Listen to login/logout changes
  React.useEffect(() => {
    function updateUser() {
      setUser(getUserFromToken());
    }

    // Custom event when login happens
    window.addEventListener("token-changed", updateUser);

    // Also listen for manual localStorage changes
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("token-changed", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    window.dispatchEvent(new Event("token-changed"));
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">DentalCare</Link>

        <nav className="space-x-3">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}



// ✅ Protect dashboard routes
function RequireAuth({ children }) {
  const user = getUserFromToken();
  return user ? children : <Navigate to="/login" replace />;
}


// ✅ Main App
export default function App() {
  return (
    <div>
      <NavbarComponent />

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard/*"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}


// 💡 Home page
function Home() {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">
        Dental Appointment Booking
      </h1>
      <p className="text-gray-600">
        Book, view, and manage your dental appointments easily.
      </p>
    </section>
  );
}
