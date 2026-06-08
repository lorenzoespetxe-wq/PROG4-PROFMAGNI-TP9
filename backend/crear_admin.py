from app.core.database import SessionLocal
from app.models.usuario import Usuario
from app.core.auth import get_password_hash

db = SessionLocal()

# Verificar si ya existe para evitar duplicados
admin_existente = db.query(Usuario).filter(Usuario.username == "admin").first()

if not admin_existente:
    nuevo_admin = Usuario(
        username="admin",
        password=get_password_hash("admin123"),  # Contraseña en texto plano a hashear
        rol="ADMIN",
    )
    db.add(nuevo_admin)
    db.commit()
    print("Usuario administrador creado exitosamente.")
else:
    print("El usuario administrador ya existe.")

db.close()
