import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />

      {/* Login Page */}
      <Route path="/login" element={<Login />} />

      {/* Role Based Dashboards */}
      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/teacher-dashboard"
        element={<TeacherDashboard />}
      />

      <Route
        path="/student-dashboard"
        element={<StudentDashboard />}
      />

    </Routes>
  );
}

export default App;