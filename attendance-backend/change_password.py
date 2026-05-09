from app.database import SessionLocal
from app.models.user import User
from app.auth.auth import hash_password
import sys

def change_password(email, new_password):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        print(f"❌ User with email {email} not found.")
        db.close()
        return

    user.password = hash_password(new_password)
    db.commit()
    print(f"✅ Password for {email} successfully updated!")
    db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python change_password.py <user_email> <new_password>")
        print("Example: python change_password.py admin@example.com supersecret123")
    else:
        email = sys.argv[1]
        new_password = sys.argv[2]
        change_password(email, new_password)
