import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuiz } from "../api/api";

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
      localStorage.setItem("quizId", transformed.quizId); // Only store quizId in localStorage
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate quiz");
    }
    setLoading(false);
  };

 const handleAttemptQuiz = () => {
  navigate(`/attempt/${quiz.quizId}`);
};


  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Generate Quiz</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-lg p-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Grade</label>
            <input
              type="text"
              name="grade"
              value={form.grade}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Total Questions</label>
            <input
              type="number"
              name="totalQuestions"
              value={form.totalQuestions}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Max Score</label>
            <input
              type="number"
              name="maxScore"
              value={form.maxScore}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {quiz && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Generated Quiz</h3>
          {quiz.questions.map((q, i) => (
            <div key={q.questionId} className="mb-4 border-b pb-2">
              <p className="font-medium mb-1">
                Q{i + 1}: {q.question}
              </p>
              <ul className="ml-6 list-disc">
                {q.options.map((opt, idx) => (
                  <li key={idx}>{String.fromCharCode(65 + idx)}. {opt}</li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={handleAttemptQuiz}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Attempt Quiz Now
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateQuiz;