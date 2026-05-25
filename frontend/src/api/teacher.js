import API from "./api";
export const getTeacherProfile = async () => API.get("/teachers/me");
export const getTeacherTimetable = async () => API.get("/teachers/timetable");
export const getStudentsByClass = async (classId) => API.get(`/teachers/students-by-class/${classId}`);
export const markAttendance = async (data) => API.post("/attendance/mark", data);
