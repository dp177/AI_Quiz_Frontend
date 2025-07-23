import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizById, submitQuiz, retryQuiz } from "../api/api";

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [resultMap, setResultMap] = useState({});
  const [hintVisible, setHintVisible] = useState({}); // for toggling hints

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizById(quizId);
        setQuiz(res.data);
        setResponses([]);
        setSubmitted(false);
        setResultMap({});
        setHintVisible({});
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, selectedOption) => {
    setResponses((prev) => {
      const updated = prev.filter((r) => r.questionId !== questionId);
      updated.push({ questionId, userResponse: selectedOption });
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        quizId,
        responses,
      };

      const res = await submitQuiz(payload);
      alert(`Quiz submitted! You scored ${res.data.score}/${quiz.maxScore}`);
      setSubmitted(true);

      const map = {};
      res.data.result.forEach((r) => {
        map[r.questionId] = r;
      });
      setResultMap(map);
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit quiz.");
    }
  };

  const handleRetry = async () => {
    try {
      const res = await retryQuiz({ quizId });

      setQuiz(null);
      setResponses([]);
      setSubmitted(false);
      setResultMap({});
      setHintVisible({});
      setLoading(true);

      const newQuiz = await getQuizById(res.data.quizId);
      setQuiz(newQuiz.data);
    } catch (err) {
      console.error("Retry failed:", err);
      alert("Retry failed.");
    } finally {
      setLoading(false);
    }
  };

  const toggleHint = (questionId) => {
    setHintVisible((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  if (loading) return <div className="p-6 text-center text-lg">Loading...</div>;
  if (!quiz) return <div className="p-6 text-center text-red-600">Quiz not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">{quiz.title}</h2>

      {quiz.questions.map((q, i) => {
        const resultObj = resultMap[q.questionId];
        const userAnswer = submitted
          ? resultObj?.userResponse
          : responses.find((r) => r.questionId === q.questionId)?.userResponse;

        const correctAnswer = resultObj?.correctAnswer;
        const isCorrect = resultObj?.isCorrect;
        const showHint = hintVisible[q.questionId];

        return (
          <div
            key={q.questionId}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200 transition duration-300 hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <p className="text-lg font-semibold mb-3 text-gray-800">
                {i + 1}. {q.question}
              </p>
              <button
                onClick={() => toggleHint(q.questionId)}
                className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 transition"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
            </div>

            {showHint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3 text-sm text-gray-800">
                <p><strong>Hint 1:</strong> {q.hint1}</p>
                <p><strong>Hint 2:</strong> {q.hint2}</p>
              </div>
            )}

            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const optionLetter = String.fromCharCode(65 + idx);
                const isUserChoice = optionLetter === userAnswer;

                let optionStyle = "flex items-center px-4 py-2 rounded cursor-pointer transition";

                if (submitted) {
                  if (optionLetter === correctAnswer && isCorrect) {
                    optionStyle += " bg-green-100 text-green-700 font-medium";
                  } else if (isUserChoice && !isCorrect) {
                    optionStyle += " bg-red-100 text-red-700";
                  } else {
                    optionStyle += " hover:bg-gray-50";
                  }
                } else {
                  optionStyle += " hover:bg-blue-50";
                }

                return (
                  <label key={idx} className={optionStyle}>
                    <input
                      type="radio"
                      name={q.questionId}
                      value={optionLetter}
                      checked={isUserChoice}
                      onChange={() =>
                        handleOptionChange(q.questionId, optionLetter)
                      }
                      className="mr-2"
                      disabled={submitted}
                    />
                    {optionLetter}. {opt}
                  </label>
                );
              })}
            </div>

            {submitted && (
              <div className="mt-3">
                {isCorrect ? (
                  <span className="text-green-600 font-semibold">Correct ✅</span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Incorrect ❌ &nbsp;
                    <span className="text-gray-700">
                      (Correct: {correctAnswer})
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Submit Quiz
        </button>
      ) : (
        <button
          onClick={handleRetry}
          className="w-full sm:w-auto mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Retry Quiz
        </button>
      )}
    </div>
  );
};

export default AttemptQuiz;
