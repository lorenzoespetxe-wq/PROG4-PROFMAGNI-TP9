# Modelos ORM (SQLAlchemy)
# Aquí definimos la estructura de las tablas en la base de datos
# utilizando clases Object-Relational Mapping.
# Aquí se especifican tipos de columnas, claves primarias y relaciones.

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from app.core.database import Base


class Participante(Base):
    __tablename__ = "participantes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    # index=True acelera las búsquedas por email, unique=True evita duplicados
    email = Column(String(100), unique=True, index=True, nullable=False)
    edad = Column(Integer, nullable=False)
    pais = Column(String(100), nullable=False)
    modalidad = Column(String(100), nullable=False)
    # ARRAY es nativo de PostgreSQL, ideal para guardar los strings cortos de este atributo
    tecnologias = Column(ARRAY(String), nullable=False)
    nivel = Column(String(50), nullable=False)
    # Usamos snake_case (porque es estándar en python) para la base de datos.
    acepta_terminos = Column(Boolean, nullable=False, default=False)
