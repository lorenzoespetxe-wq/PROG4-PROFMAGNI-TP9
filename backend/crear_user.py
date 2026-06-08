from app.core.database import SessionLocal
from app.models.usuario import Usuario
from app.core.auth import get_password_hash

db = SessionLocal()

# Verificar si ya existe para evitar duplicados
user_existente = db.query(Usuario).filter(Usuario.username == "user").first()

if not user_existente:
    nuevo_user = Usuario(
        username="user",
        password=get_password_hash("user123"),  # Contraseña en texto plano a hashear
        rol="CONSULTA",
    )
    db.add(nuevo_user)
    db.commit()
    print("Usuario creado exitosamente.")
else:
    print("El usuario de prueba ya existe.")

db.close()
