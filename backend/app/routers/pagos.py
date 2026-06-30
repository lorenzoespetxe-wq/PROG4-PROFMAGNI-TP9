import os
from pathlib import Path

import mercadopago
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env", override=True)


router = APIRouter(prefix="/pagos", tags=["pagos"])

ACCESS_TOKEN = os.getenv("MP_ACCESS_TOKEN")
NGROK_URL = os.getenv("NGROK_URL", "").rstrip("/")
sdk = mercadopago.SDK(ACCESS_TOKEN)


class SolicitudPago(BaseModel):
    titulo: str
    precio: float


@router.post("/crear-preferencia")
def crear_preferencia(solicitud: SolicitudPago):
    try:
        ngrok_base = NGROK_URL or "http://localhost:5173"
        preference_data = {
            "items": [
                {
                    "title": solicitud.titulo,
                    "quantity": 1,
                    "unit_price": solicitud.precio,
                    "currency_id": "ARS",
                }
            ],
            "back_urls": {
                "success": f"{ngrok_base}/pago-exitoso",
                "failure": f"{ngrok_base}/pago-fallido",
                "pending": f"{ngrok_base}/pago-pendiente",
            },
        }

        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]

        init_point = preference.get("sandbox_init_point") or preference["init_point"]
        return {"id": preference["id"], "init_point": init_point}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al conectar con Mercado Pago: {str(e)}"
        )


@router.post("/webhook")
async def webhook(request: Request):
    try:
        body = await request.json()
        print("WEBHOOK RECIBIDO:", body)
    except Exception:
        body = await request.form()
        print("WEBHOOK RECIBIDO (form):", dict(body))

    payment_id = None
    if "data" in body and "id" in body["data"]:
        payment_id = body["data"]["id"]
    elif "id" in body:
        payment_id = body["id"]

    if payment_id:
        url = f"https://api.mercadopago.com/v1/payments/{payment_id}"
        headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
        response = requests.get(url, headers=headers)
        payment = response.json()
        print("PAGO:", payment.get("status"), payment.get("status_detail"))
        if payment.get("status") == "approved":
            print("PAGO APROBADO:", payment_id)

    return {"status": "ok"}
