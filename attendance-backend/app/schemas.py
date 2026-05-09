from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime, time
from enum import Enum

# ─── ENUMS ───────────────────────────────────────────
class RoleEnum(str, Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"

class StatusEnum(str, Enum):
    present = "present"
    absent = "absent"

# ─── AUTH SCHEMAS ─────────────────────────────────────
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: RoleEnum

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

# ─── USER SCHEMA ──────────────────────────────────────
class UserOut(BaseModel):
    user_id: int
    email: str
    role: RoleEnum

    class Config:
        from_attributes = True

# ─── STUDENT SCHEMAS ──────────────────────────────────
class StudentCreate(BaseModel):
    name: str
    roll_number: str
    class_id: int
    email: EmailStr
    password: str

class StudentOut(BaseModel):
    student_id: int
    name: str
    roll_number: str
    class_id: int
    user_id: int

    class Config:
        from_attributes = True

# ─── TEACHER SCHEMAS ──────────────────────────────────
class TeacherCreate(BaseModel):
    name: str
    employee_id: str
    email: EmailStr
    password: str

class TeacherOut(BaseModel):
    teacher_id: int
    name: str
    employee_id: str
    user_id: int

    class Config:
        from_attributes = True

# ─── CLASS SCHEMAS ────────────────────────────────────
class ClassCreate(BaseModel):
    class_name: str
    section: str

class ClassOut(BaseModel):
    class_id: int
    class_name: str
    section: str

    class Config:
        from_attributes = True

# ─── SUBJECT SCHEMAS ──────────────────────────────────
class SubjectCreate(BaseModel):
    subject_name: str
    teacher_id: int

class SubjectOut(BaseModel):
    subject_id: int
    subject_name: str
    teacher_id: int

    class Config:
        from_attributes = True

# ─── TIMETABLE SCHEMAS ────────────────────────────────
class TimetableCreate(BaseModel):
    teacher_id: int
    subject_id: int
    class_id: int
    day: str
    period: int
    start_time: time
    end_time: time

class TimetableOut(BaseModel):
    timetable_id: int
    teacher_id: int
    subject_id: int
    class_id: int
    day: str
    period: int
    start_time: time
    end_time: time

    class Config:
        from_attributes = True

# ─── ATTENDANCE SCHEMAS ───────────────────────────────
class AttendanceCreate(BaseModel):
    student_id: int
    timetable_id: int
    date: date
    status: StatusEnum

class AttendanceOut(BaseModel):
    attendance_id: int
    student_id: int
    timetable_id: int
    date: date
    status: StatusEnum
    marked_at: datetime

    class Config:
        from_attributes = True

class AttendancePercentage(BaseModel):
    student_id: int
    total_classes: int
    attended: int
    percentage: float
