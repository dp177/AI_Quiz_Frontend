import { useState } from "react";
import { register } from "../api/api.js";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await register(form);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white max-w-md w-full p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
