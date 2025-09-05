import React, { useEffect, useState } from "react";
import { getAttempts } from "../api/api";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ClipboardCheck, GraduationCap, Zap, BookOpen, Hash, ArrowRight, Loader } from "lucide-react";

const AllAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await getAttempts();
        setAttempts(res.data);
      } catch (err) {
        console.error("Failed to load attempts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Your Quiz Attempts
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            A complete history of all your quiz attempts.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-12 w-12 text-gray-600" />
          </div>
        ) : attempts.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800">No Attempts Found</h3>
            <p className="mt-2 text-gray-500">You haven't attempted any quizzes yet.
            </p>
            <button onClick={() => navigate('/generate')} className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900">
                Generate a Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attempts.map((attempt) => (
              <div
                key={attempt._id}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between transition hover:scale-105 duration-300 ease-in-out"
              >
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
    </div>
  );
};

export default AllAttempts;
