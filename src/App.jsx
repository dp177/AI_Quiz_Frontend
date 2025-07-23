import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import GenerateQuiz from "./pages/GenerateQuiz";
import AttemptQuiz from "./pages/AttemptQuiz";
import AllAttempts from "./pages/AllAttempts";
import FilteredAttempts from "./pages/FilteredAttempts";
import Dashboard from "./pages/Dashboard"; // add this
import Navbar from "./components/Navbar"; // new

// Wrapper for private routes
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

// Layout wrapper to hide Navbar on login/register
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/generate" element={<PrivateRoute element={<GenerateQuiz />} />} />
          <Route path="/attempt/:quizId" element={<PrivateRoute element={<AttemptQuiz />} />} />
          <Route path="/allattempts" element={<PrivateRoute element={<AllAttempts />} />} />
          <Route path="/filter" element={<PrivateRoute element={<FilteredAttempts />} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
