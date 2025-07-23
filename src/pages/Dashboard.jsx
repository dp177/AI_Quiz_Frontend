import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to Your Quiz Dashboard</h1>
      <p className="text-gray-600 mb-6">
        You can create quizzes, attempt them, and review your results all in one place.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => navigate("/generate")}
          className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition"
        >
          Generate a Quiz
        </button>
        <button
          onClick={() => navigate("/filter")}
          className="bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700 transition"
        >
          Filter Your Attempts
        </button>
        <button
          onClick={() => navigate("/allattempts")}
          className="bg-purple-600 text-white py-3 px-6 rounded hover:bg-purple-700 transition"
        >
          View All Attempts
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
