import os
from pathlib import Path

import mercadopago
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # llega a /backend
load_dotenv(BASE_DIR / ".env", override=True)


router = APIRouter(prefix="/pagos", tags=["pagos"])

# IMPORTANTE: Reemplazar con el Access Token de prueba de Mercado Pago
# Lo obtienes en: https://www.mercadopago.com.ar/developers/panel/credentials
ACCESS_TOKEN = os.getenv("MP_ACCESS_TOKEN")
print("TOKEN LEIDO:", ACCESS_TOKEN)  # verficamos que el token se lea bien
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
            "back_url": {
                "success": "https://cannon-unwelcome-hastily.ngrok-free.dev/pago-exitoso",
                "failure": "https://cannon-unwelcome-hastily.ngrok-free.dev/pago-fallido",
                "pending": "https://cannon-unwelcome-hastily.ngrok-free.dev/pago-pendiente",
            },
            "auto_return": "all",
        }

        # Envía la solicitud a la API de Mercado Pago
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        print("RESPUESTA MP:", preference_response)  # ← agregá esto

        # Retorna el ID de la preferencia y el enlace de pago (init_point)
        return {"id": preference["id"], "init_point": preference["init_point"]}

    except Exception as e:
        print("ERROR DETALLADO:", str(e))  # ← agregá esto
        raise HTTPException(
            status_code=500, detail=f"Error al conectar con Mercado Pago: {str(e)}"
        )
