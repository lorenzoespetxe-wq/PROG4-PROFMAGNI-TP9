import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/Formulario';

export default function FormularioPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Nuevo Participante</h1>
      <RegistrationForm onSuccess={() => navigate('/lista')} />
    </div>
  );
}