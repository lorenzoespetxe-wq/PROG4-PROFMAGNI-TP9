import { Participante } from '../models/Participante';
import ParticipantCard from './TarjetaParticipante';

interface ParticipantListProps {
  participants: Participante[];
}

export default function ParticipantList({ participants }: ParticipantListProps) {
  if (participants.length === 0) { 
    return (
      <p className="text-gray-500 text-center mt-8">
        No hay participantes registrados o que coincidan con la búsqueda.
      </p>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {participants.map((p) => (
        <ParticipantCard key={p.id} participante={p} />
      ))}
    </div>
  );
}