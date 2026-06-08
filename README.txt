Registro de Eventos - TP7 / TP8
Este proyecto es una aplicación full-stack con un backend en FastAPI (Python) y un frontend en React (TypeScript/Vite), utilizando PostgreSQL como base de datos. Implementa autenticación mediante JWT y control de acceso basado en roles (RBAC).

🚀 Cómo configurar y ejecutar el proyecto
Para ejecutar el sistema completo desde cero, sigue estos pasos secuenciales utilizando terminales separadas.

1. Levantar la Base de Datos (PostgreSQL)
Abre una terminal en la raíz del proyecto (donde se encuentra el archivo docker-compose.yml) y ejecuta:

Bash
docker compose up -d
2. Configurar y levantar el Backend (FastAPI)
Abre una nueva terminal, navega a la carpeta del backend y configura el entorno.

Bash
cd backend
Crea y activa el entorno virtual:

Bash
# En Windows:
python -m venv .venv
.\.venv\Scripts\activate

# En Linux/macOS:
python3 -m venv .venv
source .venv/bin/activate
Instala las dependencias:

Bash
pip install -r requirements.txt
Ejecuta el script para sembrar el usuario administrador inicial (requiere que la base de datos del Paso 1 esté en ejecución):

Bash
python crear_admin.py
Inicia el servidor:

Bash
uvicorn app.main:app --reload
3. Configurar y levantar el Frontend (React/Vite)
Abre una tercera terminal y navega a la carpeta del frontend.

Bash
cd frontend
Instala las dependencias del proyecto:

Bash
npm install
Inicia el servidor de desarrollo:

Bash
npm run dev