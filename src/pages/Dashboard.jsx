import React from "react";
import { useNavigate } from "react-router-dom";
import { ListPlus, Filter, History, ArrowRight } from "lucide-react";

const ActionCard = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 group"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-gray-100 p-3 rounded-full mr-4 group-hover:bg-gray-200 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Welcome to Your Quiz Dashboard
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to manage your quizzes is right here.
          </p>
        </header>

        <main className="grid gap-6 md:grid-cols-1">
          <ActionCard
            title="Generate a Quiz"
            description="Create a new quiz on any topic."
            icon={<ListPlus className="h-6 w-6 text-gray-600" />}
            onClick={() => navigate("/generate")}
          />
          <ActionCard
            title="Filter Your Attempts"
            description="Search and filter your past quiz attempts."
            icon={<Filter className="h-6 w-6 text-gray-600" />}
            onClick={() => navigate("/filter")}
          />
          <ActionCard
            title="View All Attempts"
            description="Browse your complete history of quiz attempts."
            icon={<History className="h-6 w-6 text-gray-600" />}
            onClick={() => navigate("/allattempts")}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
