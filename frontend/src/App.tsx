import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CursosPage } from './pages/CursosPage';
import EditarPage from './pages/EditarPage';
import FormularioPage from './pages/FormularioPage';
import ListaPage from './pages/ListaPage';
import LoginPage from './pages/LoginPage';
import { PagoStatusPage } from './pages/PagoStatusPage';
import PublicaPage from './pages/PublicPage';
import PrivateRoute from './routes/PrivateRoute';

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Barra de navegación principal */}
      <nav className="bg-blue-800 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <Link to="/lista">Registro Eventos TP7</Link>
          </h1>
          <div className="flex gap-4 font-semibold items-center">
            
            {/* Renderizado condicional del menú basado en la sesión */}
            {user && (
              <>                
                <button 
                  onClick={logout} 
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition-colors ml-4"
                >
                  Cerrar Sesión
                </button>
              </>
            )}

          </div>
        </div>
      </nav>

      {/* Contenedor de las páginas dinámicas */}
      <main className="max-w-6xl mx-auto mt-6">
        <Routes>
          {/* Ruta base redirige al login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/publica" element={<PublicaPage />} />
          <Route path="/cursos" element={<CursosPage />} />
          <Route path="/pago-pendiente" element={<PagoStatusPage status="pending" />} />

          {/* Rutas Privadas */}
          <Route path="/lista" element={
            <PrivateRoute>
              <ListaPage />
            </PrivateRoute>
          } />
          
          {/* Rutas Privadas con restricción de Rol */}
          <Route path="/nuevo" element={
            <PrivateRoute rol="ADMIN">
              <FormularioPage />
            </PrivateRoute>
          } />
          
          <Route path="/editar/:id" element={
            <PrivateRoute rol="ADMIN">
              <EditarPage />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      
    </div>
  );
}