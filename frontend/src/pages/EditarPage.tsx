import { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/Formulario';
import { ParticipantesContext } from '../context/ParticipantesContext';

export default function EditarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(ParticipantesContext);
  
  if (!context) throw new Error("Debe usarse dentro de un ParticipantesProvider");
  const { participantes, seleccionarParaEdicion } = context;

  useEffect(() => {
    const participante = participantes.find(p => p.id === Number(id));
    if (participante) {
      seleccionarParaEdicion(participante);
    }
  }, [id, participantes, seleccionarParaEdicion]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Participante</h1>
      <RegistrationForm onSuccess={() => navigate('/lista')} />
    </div>
  );
}