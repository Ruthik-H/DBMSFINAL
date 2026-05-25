import API from "./api";

export const getStudentProfile = async () => API.get("/students/me");
export const getAttendance = async () => API.get("/students/attendance");
export const getAttendanceBySubject = async () => API.get("/students/attendance/by-subject");