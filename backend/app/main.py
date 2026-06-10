# Access the Swagger UI:
# Go to http://127.0.0.1:8000/docs to view and test all your endpoints interactively.

# to run, go to backend and run:
# .\venv\Scripts\activate
# uvicorn app.main:app --reload

# main.py es la raíz de la aplicación:
# - Inicializa la instancia de FastAPI,
# - incluye las rutas de los diferentes routers
# - y configura los middlewares, como el control de acceso CORS.

# maneja las reglas de seguridad de acceso entre dominios
from app.core.database import Base, engine
from app.models.participante import Participante
from app.models.usuario import Usuario
from app.routers import auth, pagos, participantes
from fastapi import FastAPI  # inicializará y construirá la aplicación web
from fastapi.middleware.cors import CORSMiddleware

# Crea las tablas en PostgreSQL si no existen:
# Base.metadata contiene el registro de todos los modelos que heredaron de Base
# y create_all(bind=engine) envía instrucciones SQL a Postgre a través de engine
# para crear las tablas en la DB (basado en models.py).
Base.metadata.create_all(bind=engine)

# Crea una instancia de FastAPI.
# Title será el nombre de cabecera de la auto-documentación de Swagger.
app = FastAPI(title="API Registro Eventos TP7")

# Configuración CORS (Cross-Origin Resource Sharing)
# Por seguridad los navegadores tienen un mecanismo de seguridad (CORS)
# que bloquea las peticios de scripts en el navegador (front) hace a un
# puerto / dominio distinto al que sirve a la pagina (back).
# (ej. Vite en 5173 y FastAPI en 8000)
# Esta lista definirá quien tiene permiso de conectarse.
origenes_permitidos = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://cannon-unwelcome-hastily.ngrok-free.dev",  # puerto ngrok
]
# Agregamos una capa de procesamiento por la que pasaran las
# capas de procesamiento antes de llegar a las rutas.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes_permitidos,  # aplica la lista de origenes permitidos
    allow_credentials=True,  # permite que el front envíe tokens y cookies
    allow_methods=["*"],  # permite que el front use ALL (*) métodos HTTP
    allow_headers=["*"],  # permite ALL tipos de encabezados  en las peticiones HTTP
)

# Conectamos los routers a la instancia principal de app.
app.include_router(auth.router)
app.include_router(participantes.router)
app.include_router(pagos.router)


@app.get("/")
def read_root():
    return {
        "message": "API Registro Eventos TP7 funcionando, ir a http://127.0.0.1:8000/docs para la interfaz de swagger."
    }
