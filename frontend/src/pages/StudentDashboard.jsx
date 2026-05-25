import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, BookOpen, User, CheckCircle, XCircle } from "lucide-react";
import { getStudentProfile, getAttendance, getAttendanceBySubject } from "../api/student";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profRes, attRes, subRes] = await Promise.all([
        getStudentProfile(),
        getAttendance(),
        getAttendanceBySubject()
      ]);
      setProfile(profRes.data);
      setAttendance(attRes.data);
      setSubjects(subRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-center">
          <span className="spinner"></span>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate overall path for SVG circle (circumference = 2 * pi * r ≈ 283)
  const strokeDasharray = 283;
  const strokeDashoffset = attendance 
    ? strokeDasharray - (strokeDasharray * attendance.percentage) / 100 
    : strokeDasharray;

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-icon bg-green-glow" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>🎒</div>
          Student Portal
        </div>
        <div className="navbar-right">
          <span className="badge-role student">Student</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="page-content fade-in">
        <div className="section-header">
          <h1>Welcome back, {profile?.name}!</h1>
          <p>Here's your attendance overview for this semester.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="circular-progress" style={{ width: '80px', height: '80px', marginRight: '16px' }}>
              <svg width="80" height="80" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8"
                  strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <span className="percentage-text" style={{ fontSize: '1.2rem' }}>{attendance?.percentage}%</span>
            </div>
            <div>
              <div className="stat-label" style={{ fontSize: '0.9rem', color: '#f0f6fc', fontWeight: '600' }}>Overall Attendance</div>
              <div className="stat-label">{attendance?.attended} of {attendance?.total_classes} classes</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon green"><CheckCircle size={24} /></div>
            <div>
              <div className="stat-value">{attendance?.attended || 0}</div>
              <div className="stat-label">Classes Attended</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon red"><XCircle size={24} /></div>
            <div>
              <div className="stat-value">{(attendance?.total_classes || 0) - (attendance?.attended || 0)}</div>
              <div className="stat-label">Classes Missed</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><BookOpen size={18} /> Subject Breakdown</h2>
          </div>

          {subjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <p>No subjects found for your class.</p>
            </div>
          ) : (
            <div className="grid-3">
              {subjects.map((sub) => (
                <div key={sub.subject_id} className="subject-card">
                  <div className="subject-name">{sub.subject_name}</div>
                  <div className="progress-bar-wrapper">
                    <div 
                      className={`progress-bar-fill ${sub.percentage >= 75 ? 'green' : sub.percentage >= 50 ? 'amber' : 'red'}`}
                      style={{ width: `${sub.percentage}%` }}
                    ></div>
                  </div>
                  <div className="subject-stats" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{sub.attended} / {sub.total} classes</span>
                    <span style={{ fontWeight: 600, color: sub.percentage >= 75 ? '#4ade80' : sub.percentage >= 50 ? '#fbbf24' : '#f87171' }}>
                      {sub.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}