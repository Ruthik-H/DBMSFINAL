from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import (
    StudentCreate, StudentOut,
    TeacherCreate, TeacherOut,
    ClassCreate, ClassOut,
    SubjectCreate, SubjectOut,
    TimetableCreate, TimetableOut
)
from app.models.user import User
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.class_model import Class
from app.models.subject import Subject
from app.models.timetable import Timetable
from app.auth.auth import hash_password
from app.auth.dependencies import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])

# ─── TEACHERS LIST ────────────────────────────────────
@router.get("/teachers", response_model=list[TeacherOut])
def get_all_teachers(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return db.query(Teacher).all()

# ─── SUBJECTS LIST ────────────────────────────────────
@router.get("/subjects", response_model=list[SubjectOut])
def get_all_subjects(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return db.query(Subject).all()

# ─── STUDENTS BY CLASS ────────────────────────────────
@router.get("/students/by-class/{class_id}", response_model=list[StudentOut])
def get_students_by_class(
    class_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return db.query(Student).filter(Student.class_id == class_id).all()

# ─── STUDENTS ─────────────────────────────────────────
@router.get("/students", response_model=list[StudentOut])
def get_all_students(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return db.query(Student).all()

@router.post("/students", response_model=StudentOut)
def create_student(
    data: StudentCreate,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    new_user = User(
        email=data.email,
        password=hash_password(data.password),
        role="student"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_student = Student(
        user_id=new_user.user_id,
        name=data.name,
        roll_number=data.roll_number,
        class_id=data.class_id
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

@router.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}

# ─── TEACHERS ─────────────────────────────────────────
@router.post("/teachers", response_model=TeacherOut)
def create_teacher(
    data: TeacherCreate,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    new_user = User(
        email=data.email,
        password=hash_password(data.password),
        role="teacher"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_teacher = Teacher(
        user_id=new_user.user_id,
        name=data.name,
        employee_id=data.employee_id
    )
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return new_teacher

@router.delete("/teachers/{teacher_id}")
def delete_teacher(
    teacher_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    teacher = db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    db.delete(teacher)
    db.commit()
    return {"message": "Teacher deleted successfully"}

# ─── CLASSES ──────────────────────────────────────────
@router.post("/classes", response_model=ClassOut)
def create_class(
    data: ClassCreate,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    new_class = Class(class_name=data.class_name, section=data.section)
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class

@router.get("/classes", response_model=list[ClassOut])
def get_all_classes(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return db.query(Class).all()

# ─── SUBJECTS ─────────────────────────────────────────
@router.post("/subjects", response_model=SubjectOut)
def create_subject(
    data: SubjectCreate,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    new_subject = Subject(
        subject_name=data.subject_name,
        teacher_id=data.teacher_id
    )
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject

@router.delete("/subjects/{subject_id}")
def delete_subject(
    subject_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    subject = db.query(Subject).filter(Subject.subject_id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

# ─── TIMETABLE ────────────────────────────────────────
@router.post("/timetable", response_model=TimetableOut)
def create_timetable(
    data: TimetableCreate,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    new_timetable = Timetable(
        teacher_id=data.teacher_id,
        subject_id=data.subject_id,
        class_id=data.class_id,
        day=data.day,
        period=data.period,
        start_time=data.start_time,
        end_time=data.end_time
    )
    db.add(new_timetable)
    db.commit()
    db.refresh(new_timetable)
    return new_timetable

@router.get("/timetable", response_model=list[TimetableOut])
def get_timetable(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    return db.query(Timetable).all()

@router.delete("/timetable/{timetable_id}")
def delete_timetable(
    timetable_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    timetable_entry = db.query(Timetable).filter(Timetable.timetable_id == timetable_id).first()
    if not timetable_entry:
        raise HTTPException(status_code=404, detail="Timetable entry not found")
    db.delete(timetable_entry)
    db.commit()
    return {"message": "Timetable entry deleted successfully"}
