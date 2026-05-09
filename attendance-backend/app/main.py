from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, students, teachers, attendance, admin

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Student Attendance Management System",
    description="Backend API for managing student attendance",
    version="1.0.0"
)

# CORS — allows your friend's React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(teachers.router)
app.include_router(attendance.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Attendance Management System API is running!"}
