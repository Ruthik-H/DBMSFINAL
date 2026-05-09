from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import TeacherOut, TimetableOut, StudentOut
from app.models.teacher import Teacher
from app.models.timetable import Timetable
from app.models.student import Student
from app.auth.dependencies import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/teachers", tags=["Teachers"])


@router.get("/me", response_model=TeacherOut)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.user_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


@router.get("/timetable", response_model=list[TimetableOut])
def get_my_timetable(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.user_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    timetable = db.query(Timetable).filter(
        Timetable.teacher_id == teacher.teacher_id
    ).all()
    return timetable


@router.get("/students-by-class/{class_id}", response_model=List[StudentOut])
def get_students_by_class(
    class_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all students in a specific class — used by teacher for marking attendance."""
    return db.query(Student).filter(Student.class_id == class_id).all()

