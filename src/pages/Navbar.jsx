import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "./lib/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const logged = isLoggedIn();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="p-4 flex justify-between bg-gray-100 mb-5">
      <h2 className="text-xl font-bold">DentalCare</h2>

      <div className="space-x-4">
        {logged ? (
          <>
            <Link to="/dashboard" className="font-medium">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="text-red-600 font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="font-medium">Login</Link>
            <Link to="/register" className="font-medium">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
