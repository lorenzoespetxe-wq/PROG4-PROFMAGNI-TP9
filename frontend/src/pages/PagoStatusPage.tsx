import { Link, useSearchParams } from "react-router-dom";

export const PagoStatusPage = ({ status }: { status: 'success' | 'failure' | 'pending' }) => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const statusMp = searchParams.get("status");

  const statusConfig = {
    success: { titulo: "¡Pago Exitoso!", color: "text-green-600", mensaje: "Tu curso ya está disponible." },
    failure: { titulo: "Pago Rechazado", color: "text-red-600", mensaje: "Hubo un problema con tu método de pago." },
    pending: { titulo: "Pago Pendiente", color: "text-yellow-600", mensaje: "Estamos esperando la confirmación de Mercado Pago." }
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <h1 className={`text-4xl font-bold mb-4 ${config.color}`}>{config.titulo}</h1>
      <p className="text-lg text-gray-700 mb-2">{config.mensaje}</p>
      
      {paymentId && (
        <p className="text-sm text-gray-500 mb-6">ID de transacción: {paymentId} ({statusMp})</p>
      )}

      <Link to="/cursos" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700">
        Volver a Cursos
      </Link>
    </div>
  );
};