import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/layout";
import { adminLogin } from "../api";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await adminLogin({ username, password });
      localStorage.setItem("adminToken", res.data.token);
      onLogin?.();
      navigate("/admin");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Admin Login">
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Admin Sign In</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-100 border border-red-300 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
