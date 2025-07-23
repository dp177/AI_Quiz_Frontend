import React, { useEffect, useState } from "react";
import { getAttempts } from "../api/api";
import { CalendarDays, ClipboardCheck, GraduationCap, Zap } from "lucide-react";

const AllAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true); // loader state

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await getAttempts();
        setAttempts(res.data);
      } catch (err) {
        console.error("Failed to load attempts", err);
      } finally {
        setLoading(false); // stop loader once done
      }
    };

    fetchAttempts();
  }, []);

  const handleAttemptClick = (quizId) => {
    window.location.href = `/attempt/${quizId}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Quiz Attempts</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : attempts.length === 0 ? (
        <p className="text-center text-gray-500">No attempts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attempts.map((attempt, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-100 transition hover:shadow-lg flex flex-col justify-between"
            >
              <div className="text-gray-600 space-y-1 text-sm mb-4">
                <p className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(attempt.createdAt).toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Score: <span className="font-medium">{attempt.score}</span> /{" "}
                  {attempt.quiz.maxScore}
                </p>
                <p className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Grade: {attempt.quiz?.grade || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Difficulty: {attempt.quiz?.difficulty || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  🧪 Subject: {attempt.quiz?.subject || "N/A"}
                </p>
                <p>
                  📌 Total Questions:{" "}
                  {attempt.totalQuestions || attempt.quiz?.questions?.length || 0}
                </p>
              </div>

              <button
                onClick={() => handleAttemptClick(attempt.quiz.quizId)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Attempt Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAttempts;
