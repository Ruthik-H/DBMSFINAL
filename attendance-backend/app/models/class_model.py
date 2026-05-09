from sqlalchemy import Column, Integer, String
from app.database import Base

class Class(Base):
    __tablename__ = "classes"

    class_id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String, nullable=False)
    section = Column(String, nullable=False)
