import { useState } from 'react';
import { type Curso } from '../models/Curso';

const cursos_mock: Curso[] = [
  { id: 1, titulo: "Curso React", precio: 25000, descripcion: "Desarrollo frontend moderno con React y Vite." },
  { id: 2, titulo: "Curso DBA PostgreSQL", precio: 40000, descripcion: "Administración, optimización y consultas avanzadas." },
  { id: 3, titulo: "Curso Python Backend", precio: 30000, descripcion: "Creación de APIs utilizando FastAPI y SQLAlchemy." },
  { id: 4, titulo: "Curso Docker & CI/CD", precio: 35000, descripcion: "Contenerización de aplicaciones y automatización." },
  { id: 5, titulo: "Curso Seguridad SecOps", precio: 45000, descripcion: "Automatización de triage de vulnerabilidades." },
  { id: 6, titulo: "Curso Análisis de Datos", precio: 28000, descripcion: "Limpieza y procesamiento de datos con Pandas." }
];

export const CursosPage = () => {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleComprar = async (curso: Curso) => {
    setLoadingId(curso.id);
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pagos/crear-preferencia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: curso.titulo,
          precio: curso.precio
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la preferencia de pago");
      }

      const data = await response.json();
      
      // Redirigir al usuario a la URL de Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un problema al iniciar el pago.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Cursos Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos_mock.map((curso) => (
          <div key={curso.id} className="border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between bg-white hover:shadow-md transition-shadow">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{curso.titulo}</h2>
              <p className="text-gray-600 mb-6 text-sm">{curso.descripcion}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-600 mb-4">
                ${curso.precio.toLocaleString('es-AR')}
              </p>
              <button
                onClick={() => handleComprar(curso)}
                disabled={loadingId === curso.id}
                className={`w-full font-bold py-3 px-4 rounded transition-colors ${
                  loadingId === curso.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loadingId === curso.id ? 'PROCESANDO...' : 'QUIERO ESTE CURSO'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};