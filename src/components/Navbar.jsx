import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/generate" className="hover:underline">Generate Quiz</Link>
        <Link to="/allattempts" className="hover:underline">All Attempts</Link>
        <Link to="/filter" className="hover:underline">Filter Attempts</Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
