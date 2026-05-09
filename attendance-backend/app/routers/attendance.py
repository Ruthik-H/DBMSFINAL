from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.schemas import AttendanceCreate, AttendanceOut
from app.models.attendance import Attendance
from app.models.student import Student
from app.auth.dependencies import get_current_user, require_role
from app.models.user import User
from typing import List

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/mark", response_model=AttendanceOut)
def mark_attendance(
    attendance_data: AttendanceCreate,
    current_user: User = Depends(require_role("teacher")),
    db: Session = Depends(get_db)
):
    existing = db.query(Attendance).filter(
        Attendance.student_id == attendance_data.student_id,
        Attendance.timetable_id == attendance_data.timetable_id,
        Attendance.date == attendance_data.date
    ).first()

    if existing:
        # Update instead of error — allows re-marking
        existing.status = attendance_data.status
        existing.marked_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing

    new_attendance = Attendance(
        student_id=attendance_data.student_id,
        timetable_id=attendance_data.timetable_id,
        date=attendance_data.date,
        status=attendance_data.status,
        marked_at=datetime.utcnow()
    )
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance


@router.get("/{student_id}", response_model=List[AttendanceOut])
def get_student_attendance(
    student_id: int,
    current_user: User = Depends(require_role("teacher")),
    db: Session = Depends(get_db)
):
    attendance = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()
    return attendance


@router.get("/by-timetable/{timetable_id}", response_model=List[AttendanceOut])
def get_attendance_by_timetable(
    timetable_id: int,
    current_user: User = Depends(require_role("teacher")),
    db: Session = Depends(get_db)
):
    """Get all attendance records for a specific timetable slot."""
    return db.query(Attendance).filter(
        Attendance.timetable_id == timetable_id
    ).all()

