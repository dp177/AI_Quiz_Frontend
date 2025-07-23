import React, { useState } from "react";
import { filterAttempts } from "../api/api"; // must hit /api/attempts/filter (POST)

const FilteredAttempts = () => {
  const [filters, setFilters] = useState({
    grade: "",
    subject: "",
    minScore: "",
    maxScore: "",
  });

  const [filtered, setFiltered] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = async () => {
    try {
      const filteredRequest = { ...filters };

      // Remove empty values
      Object.keys(filteredRequest).forEach((key) => {
        if (filteredRequest[key] === "") {
          delete filteredRequest[key];
        }
      });

      const res = await filterAttempts(filteredRequest); // Call API
      setFiltered(res.data);
    } catch (err) {
      console.error("Filter error", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Filter Quiz Attempts</h2>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          className="border p-2 rounded"
          value={filters.grade}
          onChange={handleChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="border p-2 rounded"
          value={filters.subject}
          onChange={handleChange}
        />
        <input
          type="number"
          name="minScore"
          placeholder="Min Score"
          className="border p-2 rounded"
          value={filters.minScore}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxScore"
          placeholder="Max Score"
          className="border p-2 rounded"
          value={filters.maxScore}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={handleFilter}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Apply Filter
      </button>

      {/* Results */}
      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No attempts found.</p>
        ) : (
          filtered.map((attempt, index) => (
            <div
              key={index}
              className="border border-gray-200 p-4 rounded shadow-sm bg-white"
            >
              <p>
                <strong>Quiz ID:</strong> {attempt.quizId}
              </p>
              <p>
                <strong>Score:</strong> {attempt.score} / {attempt.quiz?.maxScore}
              </p>
              <p>
                <strong>Subject:</strong> {attempt.quiz?.subject || "N/A"}
              </p>
              <p>
                <strong>Grade:</strong> {attempt.quiz?.grade || "N/A"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(attempt.createdAt).toLocaleString()}
              </p>
             
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FilteredAttempts;
