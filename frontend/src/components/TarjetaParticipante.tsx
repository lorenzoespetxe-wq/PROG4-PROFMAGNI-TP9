import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Participante } from '../models/Participante';
import { ParticipantesContext } from '../context/ParticipantesContext';
import { useAuth } from '../context/AuthContext';

interface TarjetaParticipanteProps {
  participante: Participante;
}

export default function TarjetaParticipante({ participante }: TarjetaParticipanteProps) {
  const context = useContext(ParticipantesContext);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (!context) throw new Error("Debe usarse dentro de un ParticipantesProvider");
  const { eliminar } = context;

  const getColorPorNivel = (nivel: string) => { 
    switch (nivel) {
      case 'Principiante': return 'text-green-600';
      case 'Intermedio': return 'text-yellow-600';
      case 'Avanzado': return 'text-red-600';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 hover:shadow-lg transition flex flex-col justify-between">
      <div>
        {/* Sección de Nombre y País */}
        <h3 className="text-xl font-bold">{participante.nombre}</h3>
        <p className="text-gray-600">{participante.pais}</p>
        
        {/* Sección de Modalidad y Nivel */}
        <div className="mt-4">
          <p className="text-sm">
            <span className="font-semibold">Modalidad:</span> {participante.modalidad}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Nivel:</span>{' '}
            <span className={`font-medium ${getColorPorNivel(participante.nivel)}`}>
              {participante.nivel}
            </span>
          </p>
        </div>

        {/* Sección de Tecnologías */}
        <div className="mt-4">
          <p className="text-sm font-semibold mb-1">Tecnologías:</p>
          <p className="text-sm text-gray-700">
            {participante.tecnologias.join(' - ')}
          </p>
        </div>
      </div>

      {/* Botones de acción - Renderizado condicional por rol */}
      {user?.rol === "ADMIN" && (
        <div className="mt-6 flex gap-2">
          <button 
            onClick={() => navigate(`/editar/${participante.id}`)} 
            className="w-full text-center text-sm bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-600 hover:text-white transition-colors font-semibold"
          >
            Editar
          </button>
          <button 
            onClick={() => eliminar(participante.id)} 
            className="w-full text-center text-sm bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-600 hover:text-white transition-colors font-semibold"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}