import os

import mercadopago
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

load_dotenv()

router = APIRouter(prefix="/pagos", tags=["pagos"])

# IMPORTANTE: Reemplazar con el Access Token de prueba de Mercado Pago
# Lo obtienes en: https://www.mercadopago.com.ar/developers/panel/credentials
ACCESS_TOKEN = os.getenv("MP_ACCESS_TOKEN")
sdk = mercadopago.SDK(ACCESS_TOKEN)


class SolicitudPago(BaseModel):
    titulo: str
    precio: float


@router.post("/crear-preferencia")
def crear_preferencia(solicitud: SolicitudPago):
    try:
        # Crea el objeto de preferencia con los datos del curso
        preference_data = {
            "items": [
                {
                    "title": solicitud.titulo,
                    "quantity": 1,
                    "unit_price": solicitud.precio,
                    "currency_id": "ARS",
                }
            ],
            # Aquí configuras las URLs de retorno. Si utilizas ngrok,
            # reemplaza "http://localhost:5173" por tu URL pública de ngrok.
            "back_urls": {
                "success": "http://localhost:5173/pago-exitoso",
                "failure": "http://localhost:5173/pago-fallido",
                "pending": "http://localhost:5173/pago-pendiente",
            },
            "auto_return": "approved",
        }

        # Envía la solicitud a la API de Mercado Pago
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]

        # Retorna el ID de la preferencia y el enlace de pago (init_point)
        return {"id": preference["id"], "init_point": preference["init_point"]}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al conectar con Mercado Pago: {str(e)}"
        )
