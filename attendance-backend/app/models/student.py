from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    name = Column(String, nullable=False)
    roll_number = Column(String, unique=True, nullable=False)
    class_id = Column(Integer, ForeignKey("classes.class_id"), nullable=False)

    user = relationship("User")
    classe = relationship("Class")
