from app.database import SessionLocal
from app.models.user import User
from app.auth.auth import hash_password

db = SessionLocal()

# Check if admin exists
admin_email = "admin@example.com"
existing_admin = db.query(User).filter(User.email == admin_email).first()

if not existing_admin:
    new_admin = User(
        email=admin_email,
        password=hash_password("admin123"),
        role="admin"
    )
    db.add(new_admin)
    db.commit()
    print("Admin user created! Email: admin@example.com | Password: admin123")
else:
    print("Admin already exists! Email: admin@example.com | Password: admin123")

# Let's also create a default teacher to make it easy
teacher_email = "teacher@example.com"
existing_teacher = db.query(User).filter(User.email == teacher_email).first()

if not existing_teacher:
    from app.models.teacher import Teacher
    new_user = User(
        email=teacher_email,
        password=hash_password("teacher123"),
        role="teacher"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    new_teacher = Teacher(
        user_id=new_user.user_id,
        name="Mr. Anderson",
        employee_id="T-1001"
    )
    db.add(new_teacher)
    db.commit()
    print("Teacher user created! Email: teacher@example.com | Password: teacher123")
else:
    print("Teacher already exists! Email: teacher@example.com | Password: teacher123")

db.close()
