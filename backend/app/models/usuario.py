from sqlalchemy import Column, Integer, String
from app.core.database import Base


class Usuario(Base):
    __tablename__ = "usuarios_db"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    rol = Column(String)
