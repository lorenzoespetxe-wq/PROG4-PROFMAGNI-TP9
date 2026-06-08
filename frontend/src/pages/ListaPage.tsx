import { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import SearchFilters from '../components/Filtros';
import ParticipantList from '../components/ListaParticipantes';
import { ParticipantesContext } from '../context/ParticipantesContext';
import { useAuth } from '../context/AuthContext';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useParticipantFilters } from '../hooks/useParticipantFilters';

export default function ListaPage() {
  const context = useContext(ParticipantesContext);
  if (!context) throw new Error("Debe usarse dentro de un ParticipantesProvider");
  
  const { participantes, resetear } = context;
  const { user } = useAuth();
  
  // Referencia para el input de búsqueda
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Implementación del Custom Hook de filtros
  const { filters, setFilters, filteredParticipants, clearFilters } = useParticipantFilters(participantes);

  // Implementación del Custom Hook de atajo de teclado (Ctrl + B)
  useKeyboardShortcut('b', true, () => {
    searchInputRef.current?.focus();
  });

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Participantes</h1>
        {user?.rol === "ADMIN" && (
          <Link to="/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-semibold">
            + Nuevo Participante
          </Link>
        )}
      </div>

      <div className="flex gap-2 mb-4 justify-end">
        <button onClick={clearFilters} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm transition-colors">
          Limpiar filtros
        </button>
        {user?.rol === "ADMIN" && (
          <button onClick={resetear} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm transition-colors">
            Resetear datos
          </button>
        )}
      </div>

      <div className="mb-6">
        <SearchFilters 
          filters={filters} 
          onFilterChange={setFilters} 
          searchInputRef={searchInputRef} 
        />
      </div>
      
      <ParticipantList participants={filteredParticipants} />
    </div>
  );
}