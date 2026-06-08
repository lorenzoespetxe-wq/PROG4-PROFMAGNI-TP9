# Conexión a la base de datos (PostgreSQL/SQLite)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

# Define la URL de conxión a la DB.
# Credenciales y configuración que definimos en el docker-compose.yml
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_bd
DB_URL = "postgresql://postgres:adminpassword@localhost:5432/tp4_db"

# Crea el Engine de SQLAlchemy que:
# - Se crea una sola vez cuando se arranca la app.
# - Gestiona la conexión en si  a la DB (URL, credenciales, puerto).
# - Traduce las instrucciones Python al lenguaje SQL.
# - Mantiene la conection pool (conexiones a la db reutilizables y rápidas)
engine = create_engine(DB_URL)

# También crea el SessionLocal para gestionar sesiones de la DB.
# Esta no es una sesión en sí misma, sino una clase factory.
# Se define usando "sessionmaker":
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# - Se configura una sola vez, vinculado al Engine que se creo cuando
# arranco la app.
# - Cuando llamas a SessionLocal(), creas una sesión, donde ocurren
# las consultas y cambios CRUD.
# - Permite que cada petición HTTP tenga su propio "Bloc de Notas",
# donde lo que haces en una sesión no afecta a otra hasta que se hace
# un commit.
# Rastrea el estado de los objetos de models.py para saber
# que debe actualizar la DB.


# Este objeto es la clase base para todos tus modelos ORM.
Base = declarative_base()
# Sirve de:
# - Registro Central: registra todas las clases (tablas) que hereden de ella.
# - Mapeo: vincula las clases de Python en models.py con las tablas físicas
# de la base de datos.
# - Uso: cuando defines un modelo como class Participante(Base): SQLAlchemy
# sabe que debe mapear esa clase a una tabla con la configuración de Base.


# Esta función gestiona la conexión de forma que no se desperdicien recursos (eficiencia)
# ni se dejen conexiones abiertas (seguridad).
# Inyecta la sesión de la base de datos en los endpoints.
def get_db():
    db = SessionLocal()  # crea una nueva sesión (conexión activa a la db), cada vez que un endpoint lo solicita.
    try:
        yield db  # proporciona la sesión al endpoint de la API, la ejecución de pausa aquí mientras se realizan las consultas.
    finally:
        db.close()  # se asegura de que la conexión se cierre siempre, incluso si hay un error o excepción durante la ejecución del endpoint.


# Cada vez que llega un usuario a un endpoint (ej: /participantes),
# FastAPI instancia un SessionLocal().

# Se realizan las operaciones y, al terminar la respuesta,
# la sesión se cierra, devolviendo la conexión física al pool del Engine.
