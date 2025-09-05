import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuiz } from "../api/api";
import { Book, Tag, Hash, Star, Zap, Loader, ArrowRight } from "lucide-react";

const GenerateQuiz = () => {
  const [form, setForm] = useState({
    grade: "",
    subject: "",
    totalQuestions: 10,
    maxScore: 10,
    difficulty: "EASY",
  });

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "totalQuestions" || name === "maxScore" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuiz(null);
    try {
      const res = await generateQuiz(form);
      const transformed = {
        ...res.data,
        questions: res.data.questions.map((q, i) => ({
          questionId: q.questionId || `q${i}`,
          question: q.question,
          options: q.options.map((opt) => opt.trim()),
          correctAnswer: q.correctAnswer?.trim() || "",
          hint1: q.hint1 || "",
          hint2: q.hint2 || "",
        })),
      };
      setQuiz(transformed);
      localStorage.setItem("quizId", transformed.quizId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate quiz");
    }
    setLoading(false);
  };

  const handleAttemptQuiz = () => {
    navigate(`/attempt/${quiz.quizId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Generate a New Quiz
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Customize your quiz by filling out the details below.
          </p>
        </header>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Book className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" name="grade" value={form.grade} onChange={handleChange} placeholder="Grade (e.g., 10th)" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" />
              </div>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject (e.g., Math)" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" />
              </div>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="number" name="totalQuestions" value={form.totalQuestions} onChange={handleChange} placeholder="Total Questions" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" />
              </div>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="number" name="maxScore" value={form.maxScore} onChange={handleChange} placeholder="Max Score" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400" />
              </div>
              <div className="relative col-span-1 md:col-span-2">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select name="difficulty" value={form.difficulty} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400">
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              {loading ? <><Loader className="animate-spin mr-2 h-5 w-5" /> Generating...</> : "Generate Quiz"}
            </button>
          </form>
        </div>

        {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center"><p>{error}</p></div>}

        {quiz && (
          <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Generated Quiz Questions</h3>
            <div className="space-y-6">
              {quiz.questions.map((q, i) => (
                <div key={q.questionId} className="border-b border-gray-200 pb-4">
                  <p className="font-semibold text-gray-800 mb-2">
                    Q{i + 1}: {q.question}
                  </p>
                  <ul className="space-y-1 ml-2">
                    {q.options.map((opt, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <span className="font-mono mr-2 text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button onClick={handleAttemptQuiz} className="mt-8 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Attempt Quiz Now <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateQuiz;