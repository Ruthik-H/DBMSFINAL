from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import StudentOut, AttendancePercentage
from app.models.student import Student
from app.models.attendance import Attendance
from app.models.timetable import Timetable
from app.models.subject import Subject
from app.auth.dependencies import get_current_user, require_role
from app.models.user import User
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/students", tags=["Students"])


class SubjectAttendance(BaseModel):
    subject_id: int
    subject_name: str
    total: int
    attended: int
    percentage: float


@router.get("/me", response_model=StudentOut)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.get("/attendance", response_model=AttendancePercentage)
def get_my_attendance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    total = db.query(Attendance).filter(Attendance.student_id == student.student_id).count()
    attended = db.query(Attendance).filter(
        Attendance.student_id == student.student_id,
        Attendance.status == "present"
    ).count()
    percentage = (attended / total * 100) if total > 0 else 0.0

    return {
        "student_id": student.student_id,
        "total_classes": total,
        "attended": attended,
        "percentage": round(percentage, 2)
    }


@router.get("/attendance/by-subject", response_model=List[SubjectAttendance])
def get_attendance_by_subject(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Get all timetable entries for the student's class
    timetable_entries = db.query(Timetable).filter(
        Timetable.class_id == student.class_id
    ).all()

    # Group by subject
    subject_map = {}
    for entry in timetable_entries:
        sid = entry.subject_id
        if sid not in subject_map:
            subject_map[sid] = {"timetable_ids": [], "subject": entry.subject}
        subject_map[sid]["timetable_ids"].append(entry.timetable_id)

    result = []
    for sid, info in subject_map.items():
        tids = info["timetable_ids"]
        total = db.query(Attendance).filter(
            Attendance.student_id == student.student_id,
            Attendance.timetable_id.in_(tids)
        ).count()
        attended = db.query(Attendance).filter(
            Attendance.student_id == student.student_id,
            Attendance.timetable_id.in_(tids),
            Attendance.status == "present"
        ).count()
        pct = round((attended / total * 100) if total > 0 else 0.0, 2)
        result.append(SubjectAttendance(
            subject_id=sid,
            subject_name=info["subject"].subject_name,
            total=total,
            attended=attended,
            percentage=pct
        ))

    return result

