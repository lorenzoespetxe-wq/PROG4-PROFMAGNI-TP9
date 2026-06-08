# Endpoints de la API
# Este archivo contiene los endpoints (rutas) para la entidad "participantes".
#  Maneja la lógica de las peticiones HTTP utilizando inyección de dependencias
#  para obtener la sesión de la base de datos (Depends(get_db)).

# de fastapi importamos las herramientas para crear rutas, manejar dependencias
# lanzar errores y usar codigos de estado
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.models.participante import Participante
from app.models.usuario import Usuario
from app.schemas.participante import ParticipanteCreate, ParticipanteResponse

# Creamos un grupo de rutas
router = APIRouter(
    # todas con el prefijo /participantes
    prefix="/participantes",
    # y bajo la etiqueta de "Participantes" en la documentación de Swagger
    tags=["Participantes"],
)


# GET ALL:
# la API devolverá una lista de objetos con el formato del esquema ParticipanteResponse
@router.get("/", response_model=List[ParticipanteResponse])
# el endpoint llama a get_db, que abre la sesión.
def get_participantes(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),  # JWT te pide un usuario
):
    # este v v v es el equivalente de SELECT * FROM participantes;
    participantes = db.query(Participante).all()
    return participantes  # devuelve participantes.


# POST:
# ESTUDIAR LAS LINEAS "DECORADORAS" DE FASTAPI
# si es exitosa la creación, devuelve HTTP_201
@router.post(
    "/",
    response_model=ParticipanteResponse,
    status_code=status.HTTP_201_CREATED,
)
# recibimos un JSON con un participante que siga el esquema de ParticipanteCreate
# y el endpoint abre una sesión con get_db
def create_participante(
    participante: ParticipanteCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_admin),  # JWT requiere un admin
):
    # en nuevo_participante almacenamos el dump (conversión a diccionario Python)
    # de el objeto que nos mandó Pydantic.
    nuevo_participante = Participante(**participante.model_dump())
    db.add(nuevo_participante)  # prepara objeto para insertar
    db.commit()  # inserta permanentemente
    db.refresh(nuevo_participante)
    # consulta la DB para obtener el ID generado por PostgreSQL

    return nuevo_participante  # devuelve el participante agregado


# DELETE BY ID:
# @router.delete: define que el endpoint solo acepta peticiones DELETE.
# "/{participante_id}": define un parámetro de ruta dinámico, que será el id.
# El valor que el front envíe en la URL (ej. /participantes/5) se pasa a la función como la variable participante_id.
# status_code=status.HTTP_204_NO_CONTENT: Establece el código de éxito 204.
@router.delete("/{participante_id}", status_code=status.HTTP_204_NO_CONTENT)
# participante_id: int: Tipado del parámetro capturado en la URL.
# db: Session = Depends(get_db): Inyecta la sesión de la base de datos. FastAPI gestiona la apertura y el cierre automático de la conexión.
def delete_participante(
    participante_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_admin),  # JWT requiere un admin
):
    # consulta la db para econtrar el participante con el id especificado
    # si está, lo guarda en la variable participante.
    participante = (
        db.query(Participante).filter(Participante.id == participante_id).first()
    )

    if (
        not participante
    ):  # si el participante no existe, tira un error 404 con este detalle v v v
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Participante no encontrado"
        )

    db.delete(participante)  # marca el participante para ser eliminado
    db.commit()  # borra efectivamente el participante marcado
    return


# Nuevo documentar:
# PUT BY ID:
# Permite actualizar un participante existente
@router.put(
    "/{participante_id}",
    response_model=ParticipanteResponse,
    status_code=status.HTTP_200_OK,
)
def update_participante(
    participante_id: int,
    participante_actualizado: ParticipanteCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_admin),
):
    participante_db = (
        db.query(Participante).filter(Participante.id == participante_id).first()
    )

    if not participante_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Participante no encontrado"
        )

    # Actualiza los atributos dinámicamente iterando sobre el JSON recibido
    for key, value in participante_actualizado.model_dump().items():
        setattr(participante_db, key, value)

    db.commit()
    db.refresh(participante_db)
    return participante_db
