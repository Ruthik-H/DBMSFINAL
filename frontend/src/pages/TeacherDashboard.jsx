import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, CheckSquare, Users } from "lucide-react";
import API from "../api/api";
import { getTeacherProfile, getTeacherTimetable, getStudentsByClass, markAttendance } from "../api/teacher";

export default function TeacherDashboard() {
  const [profile, setProfile] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Attendance Marking State
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({}); // { student_id: 'present' | 'absent' }
  const [markingDate, setMarkingDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profRes, timeRes] = await Promise.all([
        getTeacherProfile(),
        getTeacherTimetable()
      ]);
      setProfile(profRes.data);
      setTimetable(timeRes.data);
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

  const loadStudentsForTimetable = async (tt) => {
    try {
      setSelectedTimetable(tt);
      setMessage(null);
      
      const res = await getStudentsByClass(tt.class_id);
      setStudents(res.data);
      
      // Default all to present initially, or fetch existing if needed
      const defaultData = {};
      res.data.forEach(s => {
        defaultData[s.student_id] = 'present';
      });
      setAttendanceData(defaultData);
      
      // Try to load existing attendance for this date/timetable
      try {
        const existingRes = await API.get(`/attendance/by-timetable/${tt.timetable_id}`);
        const existing = existingRes.data.filter(a => a.date === markingDate);
        if (existing.length > 0) {
          const loadedData = {};
          existing.forEach(a => {
            loadedData[a.student_id] = a.status;
          });
          // Merge existing with default (in case new students added)
          setAttendanceData(prev => ({...prev, ...loadedData}));
          setMessage({ type: 'info', text: 'Loaded existing attendance for this date.' });
        }
      } catch (e) {
        // Ignore if error fetching existing
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    }
  };

  const handleToggleAttendance = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedTimetable) return;
    
    setSubmitting(true);
    setMessage(null);
    try {
      // Submit all students
      const promises = students.map(student => {
        return markAttendance({
          student_id: student.student_id,
          timetable_id: selectedTimetable.timetable_id,
          date: markingDate,
          status: attendanceData[student.student_id]
        });
      });
      
      await Promise.all(promises);
      setMessage({ type: 'success', text: 'Attendance saved successfully!' });
      
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to save attendance.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Group timetable by day
  const groupedTimetable = timetable.reduce((acc, curr) => {
    if (!acc[curr.day]) acc[curr.day] = [];
    acc[curr.day].push(curr);
    return acc;
  }, {});

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

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-icon bg-blue-glow" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>👨‍🏫</div>
          Teacher Portal
        </div>
        <div className="navbar-right">
          <span className="badge-role teacher">Teacher</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="page-content fade-in">
        <div className="section-header">
          <h1>Welcome, {profile?.name}</h1>
          <p>Manage your classes and mark student attendance.</p>
        </div>

        <div className="grid-2">
          {/* TIMETABLE SECTION */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title"><Calendar size={18} /> My Timetable</h2>
            </div>
            
            {Object.keys(groupedTimetable).length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>No classes assigned to you yet.</p>
              </div>
            ) : (
              <div>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                  const dayClasses = groupedTimetable[day];
                  if (!dayClasses) return null;
                  
                  return (
                    <div key={day} className="timetable-day">
                      <div className="timetable-day-label">{day}</div>
                      {dayClasses.sort((a,b) => a.period - b.period).map(tt => (
                        <div 
                          key={tt.timetable_id} 
                          className="timetable-period"
                          style={{ cursor: 'pointer', borderColor: selectedTimetable?.timetable_id === tt.timetable_id ? '#3b82f6' : '' }}
                          onClick={() => loadStudentsForTimetable(tt)}
                        >
                          <div className="period-num">{tt.period}</div>
                          <div className="period-subject">
                            Class ID: {tt.class_id} • Subject ID: {tt.subject_id}
                          </div>
                          <div className="period-time">
                            {tt.start_time.substring(0,5)} - {tt.end_time.substring(0,5)}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ATTENDANCE MARKING SECTION */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title"><CheckSquare size={18} /> Mark Attendance</h2>
            </div>

            {!selectedTimetable ? (
              <div className="empty-state">
                <div className="empty-icon">👈</div>
                <p>Select a class from your timetable to mark attendance.</p>
              </div>
            ) : (
              <div className="fade-in">
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Selected Class</label>
                    <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#8b949e' }}>
                      Class ID: {selectedTimetable.class_id} (Period {selectedTimetable.period})
                    </div>
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label>Date</label>
                    <input 
                      type="date" 
                      value={markingDate} 
                      onChange={(e) => setMarkingDate(e.target.value)} 
                    />
                  </div>
                </div>

                {message && (
                  <div className={`alert alert-${message.type === 'error' ? 'error' : message.type === 'success' ? 'success' : 'info'}`}>
                    {message.text}
                  </div>
                )}

                {students.length === 0 ? (
                  <div className="empty-state">
                    <p>No students found in this class.</p>
                  </div>
                ) : (
                  <>
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th style={{ textAlign: 'right' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map(student => (
                            <tr key={student.student_id}>
                              <td style={{ color: '#8b949e' }}>{student.roll_number}</td>
                              <td style={{ fontWeight: 500 }}>{student.name}</td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="attendance-toggle" style={{ justifyContent: 'flex-end' }}>
                                  <button 
                                    className={`attendance-btn present ${attendanceData[student.student_id] === 'present' ? 'active' : ''}`}
                                    onClick={() => handleToggleAttendance(student.student_id, 'present')}
                                  >
                                    Present
                                  </button>
                                  <button 
                                    className={`attendance-btn absent ${attendanceData[student.student_id] === 'absent' ? 'active' : ''}`}
                                    onClick={() => handleToggleAttendance(student.student_id, 'absent')}
                                  >
                                    Absent
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mark-submit-row">
                      <div style={{ color: '#8b949e', fontSize: '0.875rem' }}>
                        Total Students: <strong>{students.length}</strong>
                      </div>
                      <button 
                        className="btn btn-primary" 
                        onClick={handleSubmitAttendance}
                        disabled={submitting}
                      >
                        {submitting ? <span className="spinner"></span> : 'Save Attendance'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}