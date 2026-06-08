import { useState, useContext, useEffect, useRef, useId } from 'react';
import { ParticipantesContext } from '../context/ParticipantesContext';

const ESTADO_INICIAL = {
  nombre: '', email: '', edad: '', pais: 'Argentina',
  modalidad: 'Presencial', tecnologias: [] as string[],
  nivel: 'Principiante', aceptaTerminos: false,
};

export default function RegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
  const context = useContext(ParticipantesContext);
  if (!context) throw new Error("Debe usarse dentro de un ParticipantesProvider");
  const { agregar, editar, participanteAEditar, seleccionarParaEdicion } = context;

  const [formData, setFormData] = useState(ESTADO_INICIAL);
  
  // Implementamos useRef para el foco automático 
  // y useId para accesibilidad
  const nombreInputRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  useEffect(() => {
    // Focaliza automaticamente cuando monta el componente:
    nombreInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (participanteAEditar) {
      setFormData({
        ...participanteAEditar,
        edad: String(participanteAEditar.edad),
        aceptaTerminos: participanteAEditar.aceptaTerminos ?? (participanteAEditar as any).acepta_terminos ?? false
      });
    } else {
      setFormData(ESTADO_INICIAL);
    }
  }, [participanteAEditar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, tecnologias: [...formData.tecnologias, value] });
    } else {
      setFormData({ ...formData, tecnologias: formData.tecnologias.filter(tech => tech !== value) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aceptaTerminos) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }
    const payload = { 
      nombre: formData.nombre, email: formData.email, edad: Number(formData.edad),
      pais: formData.pais, modalidad: formData.modalidad, tecnologias: formData.tecnologias,
      nivel: formData.nivel, aceptaTerminos: formData.aceptaTerminos
    };

    if (participanteAEditar) editar(participanteAEditar.id, payload);
    else agregar(payload);

    setFormData(ESTADO_INICIAL);
    seleccionarParaEdicion(null);
    if (onSuccess) onSuccess(); 
  };

  const handleCancelar = () => {
    seleccionarParaEdicion(null);
    setFormData(ESTADO_INICIAL);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 shadow rounded">
      
      <div className="flex flex-col">
        <label htmlFor={`${formId}-nombre`}>Nombre</label>
        <input 
          ref={nombreInputRef} 
          id={`${formId}-nombre`} 
          type="text" 
          name="nombre" 
          value={formData.nombre} 
          onChange={handleInputChange} 
          required 
          className="border p-2 rounded" 
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor={`${formId}-email`}>Email</label>
        <input 
          id={`${formId}-email`} 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleInputChange} 
          required 
          className="border p-2 rounded" 
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor={`${formId}-edad`}>Edad</label>
        <input 
          id={`${formId}-edad`} 
          type="number" 
          name="edad" 
          value={formData.edad} 
          onChange={handleInputChange} 
          required 
          className="border p-2 rounded" 
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor={`${formId}-pais`}>País</label>
        <select 
          id={`${formId}-pais`} 
          name="pais" 
          value={formData.pais} 
          onChange={handleInputChange} 
          className="border p-2 rounded"
        >
          <option value="Argentina">Argentina</option>
          <option value="Chile">Chile</option>
          <option value="Uruguay">Uruguay</option>
          <option value="México">México</option>
          <option value="España">España</option>
        </select>
      </div>

      <div className="flex flex-col col-span-1 md:col-span-2">
        <p className="mb-2 font-medium">Modalidad de asistencia</p>
        <div className="flex gap-4">
          <label htmlFor={`${formId}-mod-pres`} className="flex items-center gap-1">
            <input id={`${formId}-mod-pres`} type="radio" name="modalidad" value="Presencial" checked={formData.modalidad === 'Presencial'} onChange={handleInputChange} /> Presencial
          </label>
          <label htmlFor={`${formId}-mod-virt`} className="flex items-center gap-1">
            <input id={`${formId}-mod-virt`} type="radio" name="modalidad" value="Virtual" checked={formData.modalidad === 'Virtual'} onChange={handleInputChange} /> Virtual
          </label>
          <label htmlFor={`${formId}-mod-hib`} className="flex items-center gap-1">
            <input id={`${formId}-mod-hib`} type="radio" name="modalidad" value="Híbrido" checked={formData.modalidad === 'Híbrido'} onChange={handleInputChange} /> Híbrido
          </label>
        </div>
      </div>

      <div className="flex flex-col col-span-1 md:col-span-2">
        <p className="mb-2 font-medium">Tecnologías conocidas</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {['React', 'Angular', 'Vue', 'Node', 'Python', 'Java'].map((tech) => {
            const techId = `${formId}-tech-${tech.toLowerCase()}`;
            return (
              <label key={tech} htmlFor={techId} className="flex items-center gap-1">
                <input id={techId} type="checkbox" value={tech} checked={formData.tecnologias.includes(tech)} onChange={handleCheckboxChange} /> {tech}
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor={`${formId}-nivel`}>Nivel de experiencia</label>
        <select 
          id={`${formId}-nivel`} 
          name="nivel" 
          value={formData.nivel} 
          onChange={handleInputChange} 
          className="border p-2 rounded"
        >
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      <div className="flex flex-col col-span-1 md:col-span-2 mt-4">
        <label htmlFor={`${formId}-terminos`} className="flex items-center gap-2">
          <input 
            id={`${formId}-terminos`} 
            type="checkbox" 
            name="aceptaTerminos" 
            checked={formData.aceptaTerminos} 
            onChange={(e) => setFormData({ ...formData, aceptaTerminos: e.target.checked })} 
          /> Acepto los términos y condiciones del evento
        </label>
      </div>

      <div className="col-span-1 md:col-span-2 flex gap-4 mt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto transition-colors">
          {participanteAEditar ? 'Actualizar Participante' : 'Registrar Participante'}
        </button>
        {participanteAEditar && (
          <button type="button" onClick={handleCancelar} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full md:w-auto transition-colors">
            Cancelar Edición
          </button>
        )}
      </div>
    </form>
  );
}