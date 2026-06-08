# Modelos de validación de datos (Pydantic)
# Este archivo define la estructura de los datos para la transferencia 
# (Data Transfer Objects o DTOs) mediante Pydantic. 

# Pydantic ealiza dos tareas críticas:

# Validación de Datos (Request): si un endpoint espera una edad como int 
# y el cliente envía "veinte" (un string), Pydantic rechaza la petición 
# con un error 422 antes de que llegue a tu base de datos.

# Serialización / Filtrado (Response): transforma objetos complejos de Python
# (que devuelve SQLAlchemy) en formato JSON que el navegador puede entender.

# Mientras que models.py describe como se guardan los datos en el disco,
# schemas.py describe cómo viajan esos datos por internet (JSON en este caso).

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List

# 1. Esquema Base: Contiene los campos comunes a todos los esquemas.
class ParticipanteBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: EmailStr  # Valida automáticamente que tenga formato @dominio.com
    edad: int = Field(..., gt=0, lt=120) # Debe ser mayor a 0 y menor a 120
    pais: str
    modalidad: str
    tecnologias: List[str]
    nivel: str
    # El frontend manda "aceptaTerminos" (camelCase), pero Python usa snake_case.
    # El alias permite recibir el JSON del frontend sin modificar tu código de React.
    acepta_terminos: bool = Field(alias="aceptaTerminos")

    # Configuración global para todos los esquemas que hereda
    model_config = ConfigDict(
        from_attributes=True,   # necesario para que Pydantic (maneja diccionarios como data["nombre"]) 
                                # entienda SQLAlchemy (maneja objetos Python como data.nombre)
        populate_by_name=True   # necesario cuando tenemos campos con alias
                                # como acepta_terminos vs aceptaTerminos
    )

# 2. Esquema para Create: 
# Hereda todo lo de ParticipanteBase. 
# No le pedimos el ID al frontend porque la DB lo generará.
class ParticipanteCreate(ParticipanteBase):
    pass

# 3. Esquema de Response:
# Es lo que el backend le devuelve al frontend. 
# Aquí sí incluimos el ID porque es necesario para identificar el recurso.
class ParticipanteResponse(ParticipanteBase):
    id: int