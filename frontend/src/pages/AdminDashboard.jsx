import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users, BookOpen, Clock, Building, Plus, Trash2, X } from "lucide-react";
import { 
  getStudents, getTeachers, getClasses, getSubjects, getTimetable,
  createStudent, createTeacher, createClass, createSubject, createTimetable,
  deleteStudent, deleteTeacher, deleteSubject, deleteTimetable
} from "../api/admin";
import "../modal.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("students");
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(null); // 'student', 'teacher', 'class', 'subject', 'timetable'
  const [formData, setFormData] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studRes, teachRes, classRes, subRes, timeRes] = await Promise.all([
        getStudents(),
        getTeachers(),
        getClasses(),
        getSubjects(),
        getTimetable()
      ]);
      setStudents(studRes.data);
      setTeachers(teachRes.data);
      setClasses(classRes.data);
      setSubjects(subRes.data);
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

  const openModal = (type) => {
    setFormData({});
    setShowModal(type);
  };

  const closeModal = () => {
    setShowModal(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (showModal === 'student') await createStudent(formData);
      else if (showModal === 'teacher') await createTeacher(formData);
      else if (showModal === 'class') await createClass(formData);
      else if (showModal === 'subject') await createSubject(formData);
      else if (showModal === 'timetable') await createTimetable(formData);
      
      await fetchData(); // Refresh data
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to create entry");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      if (type === 'student') await deleteStudent(id);
      else if (type === 'teacher') await deleteTeacher(id);
      else if (type === 'subject') await deleteSubject(id);
      else if (type === 'timetable') await deleteTimetable(id);
      
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete entry");
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-center">
          <span className="spinner"></span>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-icon" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc' }}>🛡️</div>
          Admin Portal
        </div>
        <div className="navbar-right">
          <span className="badge-role admin">Admin</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="page-content fade-in">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>System Management</h1>
            <p>Manage all aspects of the attendance system.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><Users size={24} /></div>
            <div>
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Total Students</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><Users size={24} /></div>
            <div>
              <div className="stat-value">{teachers.length}</div>
              <div className="stat-label">Total Teachers</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber"><Building size={24} /></div>
            <div>
              <div className="stat-value">{classes.length}</div>
              <div className="stat-label">Total Classes</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><BookOpen size={24} /></div>
            <div>
              <div className="stat-value">{subjects.length}</div>
              <div className="stat-label">Total Subjects</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="tabs">
            <button className={`tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Students</button>
            <button className={`tab ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>Teachers</button>
            <button className={`tab ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')}>Classes</button>
            <button className={`tab ${activeTab === 'subjects' ? 'active' : ''}`} onClick={() => setActiveTab('subjects')}>Subjects</button>
            <button className={`tab ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}>Timetable</button>
          </div>

          <div className="tab-content fade-in" key={activeTab}>
            
            {activeTab === 'students' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => openModal('student')}><Plus size={16} /> Add Student</button>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Name</th><th>Roll No</th><th>Class ID</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.student_id}>
                          <td>{s.student_id}</td>
                          <td style={{ fontWeight: 500 }}>{s.name}</td>
                          <td>{s.roll_number}</td>
                          <td>{s.class_id}</td>
                          <td>
                            <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => handleDelete('student', s.student_id)}><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 && <tr><td colSpan="5" className="text-center" style={{ padding: '20px', color: '#8b949e' }}>No students found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => openModal('teacher')}><Plus size={16} /> Add Teacher</button>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Name</th><th>Employee ID</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {teachers.map(t => (
                        <tr key={t.teacher_id}>
                          <td>{t.teacher_id}</td>
                          <td style={{ fontWeight: 500 }}>{t.name}</td>
                          <td>{t.employee_id}</td>
                          <td>
                            <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => handleDelete('teacher', t.teacher_id)}><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                      {teachers.length === 0 && <tr><td colSpan="4" className="text-center" style={{ padding: '20px', color: '#8b949e' }}>No teachers found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'classes' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => openModal('class')}><Plus size={16} /> Add Class</button>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Class Name</th><th>Section</th></tr>
                    </thead>
                    <tbody>
                      {classes.map(c => (
                        <tr key={c.class_id}>
                          <td>{c.class_id}</td>
                          <td style={{ fontWeight: 500 }}>{c.class_name}</td>
                          <td>{c.section}</td>
                        </tr>
                      ))}
                      {classes.length === 0 && <tr><td colSpan="3" className="text-center" style={{ padding: '20px', color: '#8b949e' }}>No classes found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'subjects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => openModal('subject')}><Plus size={16} /> Add Subject</button>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Subject Name</th><th>Teacher ID</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {subjects.map(s => (
                        <tr key={s.subject_id}>
                          <td>{s.subject_id}</td>
                          <td style={{ fontWeight: 500 }}>{s.subject_name}</td>
                          <td>{s.teacher_id}</td>
                          <td>
                            <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => handleDelete('subject', s.subject_id)}><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                      {subjects.length === 0 && <tr><td colSpan="4" className="text-center" style={{ padding: '20px', color: '#8b949e' }}>No subjects found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'timetable' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => openModal('timetable')}><Plus size={16} /> Add Entry</button>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Class ID</th><th>Subject ID</th><th>Teacher ID</th><th>Day</th><th>Period</th><th>Time</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {timetable.map(t => (
                        <tr key={t.timetable_id}>
                          <td>{t.timetable_id}</td>
                          <td>{t.class_id}</td>
                          <td>{t.subject_id}</td>
                          <td>{t.teacher_id}</td>
                          <td style={{ fontWeight: 500 }}>{t.day}</td>
                          <td>{t.period}</td>
                          <td style={{ color: '#8b949e' }}>{t.start_time.substring(0,5)} - {t.end_time.substring(0,5)}</td>
                          <td>
                            <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => handleDelete('timetable', t.timetable_id)}><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                      {timetable.length === 0 && <tr><td colSpan="8" className="text-center" style={{ padding: '20px', color: '#8b949e' }}>No timetable entries found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Modals */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add {showModal.charAt(0).toUpperCase() + showModal.slice(1)}</h2>
              <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              
              {showModal === 'student' && (
                <>
                  <div className="form-group"><label>Name</label><input required name="name" onChange={handleChange} /></div>
                  <div className="form-group"><label>Roll Number</label><input required name="roll_number" onChange={handleChange} /></div>
                  <div className="form-group">
                    <label>Class</label>
                    <select required name="class_id" onChange={handleChange} defaultValue="">
                      <option value="" disabled>Select Class</option>
                      {classes.map(c => <option key={c.class_id} value={c.class_id}>{c.class_name} - {c.section}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Email</label><input required type="email" name="email" onChange={handleChange} /></div>
                  <div className="form-group"><label>Password</label><input required type="password" name="password" onChange={handleChange} /></div>
                </>
              )}

              {showModal === 'teacher' && (
                <>
                  <div className="form-group"><label>Name</label><input required name="name" onChange={handleChange} /></div>
                  <div className="form-group"><label>Employee ID</label><input required name="employee_id" onChange={handleChange} /></div>
                  <div className="form-group"><label>Email</label><input required type="email" name="email" onChange={handleChange} /></div>
                  <div className="form-group"><label>Password</label><input required type="password" name="password" onChange={handleChange} /></div>
                </>
              )}

              {showModal === 'class' && (
                <>
                  <div className="form-group"><label>Class Name</label><input required name="class_name" onChange={handleChange} placeholder="e.g. Grade 10" /></div>
                  <div className="form-group"><label>Section</label><input required name="section" onChange={handleChange} placeholder="e.g. A" /></div>
                </>
              )}

              {showModal === 'subject' && (
                <>
                  <div className="form-group"><label>Subject Name</label><input required name="subject_name" onChange={handleChange} /></div>
                  <div className="form-group">
                    <label>Teacher</label>
                    <select required name="teacher_id" onChange={handleChange} defaultValue="">
                      <option value="" disabled>Select Teacher</option>
                      {teachers.map(t => <option key={t.teacher_id} value={t.teacher_id}>{t.name} (ID: {t.teacher_id})</option>)}
                    </select>
                  </div>
                </>
              )}

              {showModal === 'timetable' && (
                <>
                  <div className="form-group">
                    <label>Teacher</label>
                    <select required name="teacher_id" onChange={handleChange} defaultValue="">
                      <option value="" disabled>Select Teacher</option>
                      {teachers.map(t => <option key={t.teacher_id} value={t.teacher_id}>{t.name} (ID: {t.teacher_id})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select required name="subject_id" onChange={handleChange} defaultValue="">
                      <option value="" disabled>Select Subject</option>
                      {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Class</label>
                    <select required name="class_id" onChange={handleChange} defaultValue="">
                      <option value="" disabled>Select Class</option>
                      {classes.map(c => <option key={c.class_id} value={c.class_id}>{c.class_name} - {c.section}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Day</label>
                    <select required name="day" onChange={handleChange} defaultValue="">
                      <option value="" disabled>Select Day</option>
                      <option value="Monday">Monday</option><option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option><option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Period</label><input required type="number" name="period" onChange={handleChange} /></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Start Time</label><input required type="time" name="start_time" onChange={handleChange} /></div>
                    <div className="form-group"><label>End Time</label><input required type="time" name="end_time" onChange={handleChange} /></div>
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}