import React, { useState } from "react";
import { filterAttempts } from "../api/api";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Star, Filter, CalendarDays, ClipboardCheck, Hash, ArrowRight } from "lucide-react";

const FilteredAttempts = () => {
  const [filters, setFilters] = useState({
    grade: "",
    subject: "",
    minScore: "",
    maxScore: "",
  });
  const [filtered, setFiltered] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const filteredRequest = { ...filters };
      Object.keys(filteredRequest).forEach((key) => {
        if (filteredRequest[key] === "") {
          delete filteredRequest[key];
        }
      });
      const res = await filterAttempts(filteredRequest);
      setFiltered(res.data);
    } catch (err) {
      console.error("Filter error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Filter Quiz Attempts
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Narrow down your quiz history with specific criteria.
          </p>
        </header>

        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" name="grade" placeholder="Grade" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" value={filters.grade} onChange={handleChange} />
            </div>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" name="subject" placeholder="Subject" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" value={filters.subject} onChange={handleChange} />
            </div>
            <div className="relative">
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" name="minScore" placeholder="Min Score" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" value={filters.minScore} onChange={handleChange} />
            </div>
            <div className="relative">
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="number" name="maxScore" placeholder="Max Score" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" value={filters.maxScore} onChange={handleChange} />
            </div>
          </div>
          <div className="mt-6 text-center">
            <button onClick={handleFilter} disabled={loading} className="inline-flex items-center justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gray-800 hover:bg-gray-900">
              <Filter className="mr-2 h-5 w-5" />
              {loading ? 'Filtering...' : 'Apply Filter'}
            </button>
          </div>
        </div>

        {filtered && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Filtered Results</h2>
            {filtered.length === 0 ? (
              <div className="text-center bg-white p-12 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800">No Matching Attempts</h3>
                <p className="mt-2 text-gray-500">No attempts found for the selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((attempt) => (
                  <div key={attempt._id} className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between transition hover:scale-105 duration-300 ease-in-out">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500 flex items-center">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          {new Date(attempt.createdAt).toLocaleDateString()}
                        </p>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${attempt.quiz?.difficulty === 'HARD' ? 'bg-red-100 text-red-800' : attempt.quiz?.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {attempt.quiz?.difficulty || 'N/A'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{attempt.quiz?.title || 'Quiz'}</h3>
                      <div className="text-gray-600 space-y-2 text-sm">
                        <p className="flex items-center"><ClipboardCheck className="w-4 h-4 mr-2" />Score: <strong>{attempt.score} / {attempt.quiz?.maxScore}</strong></p>
                        <p className="flex items-center"><GraduationCap className="w-4 h-4 mr-2" />Grade: {attempt.quiz?.grade || 'N/A'}</p>
                        <p className="flex items-center"><BookOpen className="w-4 h-4 mr-2" />Subject: {attempt.quiz?.subject || 'N/A'}</p>
                        <p className="flex items-center"><Hash className="w-4 h-4 mr-2" />Total Questions: {attempt.totalQuestions || attempt.quiz?.questions?.length || 0}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/attempt/${attempt.quiz.quizId}`)}
                      className="mt-6 w-full flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
                    >
                      View Attempt <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilteredAttempts;
