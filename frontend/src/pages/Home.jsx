import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="home-title">
          Attendance <span>Management</span> System
        </h1>
        <p className="home-subtitle">
          Welcome to the portal. Please select your role below to continue to the login page.
        </p>

        <div className="home-roles">
          <div className="role-card" onClick={() => navigate("/login?role=student")}>
            <div className="role-card-icon">🎒</div>
            <h3 className="role-card-title">Student</h3>
            <p className="role-card-desc">View your attendance, timetable, and academic reports.</p>
          </div>
          
          <div className="role-card" onClick={() => navigate("/login?role=teacher")}>
            <div className="role-card-icon">👨‍🏫</div>
            <h3 className="role-card-title">Teacher</h3>
            <p className="role-card-desc">Manage classes, mark attendance, and track progress.</p>
          </div>

          <div className="role-card" onClick={() => navigate("/login?role=admin")}>
            <div className="role-card-icon">🛡️</div>
            <h3 className="role-card-title">Admin</h3>
            <p className="role-card-desc">System configuration, user management, and analytics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
