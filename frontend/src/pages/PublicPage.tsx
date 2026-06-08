import { Link } from 'react-router-dom';

export default function PublicaPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <div className="bg-white p-10 rounded shadow-lg text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Página Pública</h1>
        <p className="mb-6 text-gray-600">
          Esta ruta es accesible para cualquier usuario, sin necesidad de autenticación ni tokens JWT.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Ir al Login
          </Link>
          <Link 
            to="/lista" 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Ir a la App (Privado)
          </Link>
        </div>
      </div>
    </div>
  );
}