import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "../api/auth";

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "student";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const urlRole = searchParams.get("role");
    if (urlRole) {
      setRole(urlRole);
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginUser(email, password);
      const token = res.data.access_token;

      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      if (decoded.role !== role) {
        throw new Error(`You are not registered as a ${role}`);
      }

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "teacher") navigate("/teacher-dashboard");
      else navigate("/student-dashboard");

    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo bg-blue-glow">🎓</div>
        <h2 className="login-title">Attendance System</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {error && (
          <div className="alert alert-error slide-in">
            {error}
          </div>
        )}

        <div className="role-picker">
          <button
            type="button"
            className={`role-pill ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            <span className="role-emoji">🎒</span>
            Student
          </button>
          <button
            type="button"
            className={`role-pill ${role === "teacher" ? "active" : ""}`}
            onClick={() => setRole("teacher")}
          >
            <span className="role-emoji">👨‍🏫</span>
            Teacher
          </button>
          <button
            type="button"
            className={`role-pill ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
          >
            <span className="role-emoji">🛡️</span>
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "28px" }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px" }}
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}