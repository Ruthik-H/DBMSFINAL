import API from "./api";

// ── STUDENTS ───────────────────────────────────────────
export const getStudents = async () => API.get("/admin/students");
export const createStudent = async (data) => API.post("/admin/students", data);
export const deleteStudent = async (id) => API.delete(`/admin/students/${id}`);
export const getStudentsByClass = async (classId) => API.get(`/admin/students/by-class/${classId}`);

// ── TEACHERS ──────────────────────────────────────────
export const getTeachers = async () => API.get("/admin/teachers");
export const createTeacher = async (data) => API.post("/admin/teachers", data);
export const deleteTeacher = async (id) => API.delete(`/admin/teachers/${id}`);

// ── CLASSES ───────────────────────────────────────────
export const getClasses = async () => API.get("/admin/classes");
export const createClass = async (data) => API.post("/admin/classes", data);

// ── SUBJECTS ──────────────────────────────────────────
export const getSubjects = async () => API.get("/admin/subjects");
export const createSubject = async (data) => API.post("/admin/subjects", data);
export const deleteSubject = async (id) => API.delete(`/admin/subjects/${id}`);

// ── TIMETABLE ─────────────────────────────────────────
export const getTimetable = async () => API.get("/admin/timetable");
export const createTimetable = async (data) => API.post("/admin/timetable", data);
export const deleteTimetable = async (id) => API.delete(`/admin/timetable/${id}`);