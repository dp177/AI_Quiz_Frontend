import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, ListPlus, History, Filter, LogOut } from "lucide-react";

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-gray-100 text-gray-900"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Quizzer
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-4">
            <NavLink to="/">
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink to="/generate">
              <ListPlus className="mr-2 h-5 w-5" />
              Generate Quiz
            </NavLink>
            <NavLink to="/allattempts">
              <History className="mr-2 h-5 w-5" />
              All Attempts
            </NavLink>
            <NavLink to="/filter">
              <Filter className="mr-2 h-5 w-5" />
              Filter Attempts
            </NavLink>
          </nav>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
              title="Logout"
            >
              <LogOut className="h-6 w-6" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
