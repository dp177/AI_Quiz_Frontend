import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById, submitQuiz, retryQuiz } from "../api/api";
import { Loader, HelpCircle, CheckCircle, XCircle, ArrowRight, RefreshCw } from "lucide-react";

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [resultMap, setResultMap] = useState({});
  const [hintVisible, setHintVisible] = useState({});

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
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
      const payload = { quizId, responses };
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
      setLoading(true);
      const res = await retryQuiz({ quizId });
      navigate(`/attempt/${res.data.quizId}`); // Navigate to new quiz attempt
    } catch (err) {
      console.error("Retry failed:", err);
      alert("Retry failed.");
    } finally {
      setLoading(false);
    }
  };

  const toggleHint = (questionId) => {
    setHintVisible((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Loader className="animate-spin h-12 w-12 text-gray-600" />
    </div>
  );
  if (!quiz) return <div className="p-6 text-center text-red-600">Quiz not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">{quiz.title}</h1>
          <p className="mt-4 text-xl text-gray-600">
            {submitted ? "Review your answers below." : "Select the best option for each question."}
          </p>
        </header>

        <div className="space-y-8">
          {quiz.questions.map((q, i) => {
            const resultObj = resultMap[q.questionId];
            const userAnswer = submitted ? resultObj?.userResponse : responses.find((r) => r.questionId === q.questionId)?.userResponse;
            const correctAnswer = resultObj?.correctAnswer;
            const isCorrect = resultObj?.isCorrect;
            const showHint = hintVisible[q.questionId];

            return (
              <div key={q.questionId} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    {i + 1}. {q.question}
                  </p>
                  <button onClick={() => toggleHint(q.questionId)} className="flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors">
                    <HelpCircle className="mr-1 h-5 w-5" />
                    Hint
                  </button>
                </div>

                {showHint && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Hints</p>
                    <p>{q.hint1}</p>
                    <p>{q.hint2}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {q.options.map((opt, idx) => {
                    const optionLetter = String.fromCharCode(65 + idx);
                    const isUserChoice = optionLetter === userAnswer;

                    let optionStyle = "flex items-center p-3 rounded-lg border cursor-pointer transition ";
                    if (submitted) {
                      if (optionLetter === correctAnswer) {
                        optionStyle += "bg-green-100 border-green-300 text-green-800";
                      } else if (isUserChoice && !isCorrect) {
                        optionStyle += "bg-red-100 border-red-300 text-red-800";
                      } else {
                        optionStyle += "bg-gray-50 border-gray-200 text-gray-700";
                      }
                    } else {
                      optionStyle += isUserChoice ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300 hover:bg-gray-100";
                    }

                    return (
                      <label key={idx} className={optionStyle}>
                        <input type="radio" name={q.questionId} value={optionLetter} checked={isUserChoice} onChange={() => handleOptionChange(q.questionId, optionLetter)} className="hidden" disabled={submitted}/>
                        <span className="font-mono mr-3">{optionLetter}.</span>
                        <span>{opt}</span>
                        {submitted && optionLetter === correctAnswer && <CheckCircle className="ml-auto h-5 w-5 text-green-600" />}
                        {submitted && isUserChoice && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-600" />}
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {isCorrect ? (
                      <div className="flex items-center text-green-600 font-semibold">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Correct
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600 font-semibold">
                        <XCircle className="mr-2 h-5 w-5" />
                        Incorrect (Correct Answer: {correctAnswer})
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          {!submitted ? (
            <button onClick={handleSubmit} className="w-full md:w-auto flex justify-center items-center py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gray-800 hover:bg-gray-900">
              Submit Quiz <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          ) : (
            <button onClick={handleRetry} disabled={loading} className="w-full md:w-auto flex justify-center items-center py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700">
              {loading ? <><Loader className="animate-spin mr-2 h-5 w-5" /> Retrying...</> : <>Retry Quiz <RefreshCw className="ml-2 h-5 w-5" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttemptQuiz;
