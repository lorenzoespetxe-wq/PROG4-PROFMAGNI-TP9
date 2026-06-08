import React, { useId } from 'react';

export interface FilterState {
  nombre: string;
  modalidad: string;
  nivel: string;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  // Añadimos la propiedad para recibir la referencia del input de búsqueda
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function SearchFilters({ filters, onFilterChange, searchInputRef }: SearchFiltersProps) {
  // Generamos un identificador único base para este componente
  const formId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value }); 
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex flex-col">
        {/* Vinculamos el label y el input usando el id generado */}
        <label htmlFor={`${formId}-nombre`}>Buscar:</label>
        <input
          id={`${formId}-nombre`}
          ref={searchInputRef}
          type="text"
          name="nombre"
          value={filters.nombre}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Nombre..."
        />
      </div>
      
      <div className="flex flex-col">
        <label htmlFor={`${formId}-modalidad`}>Modalidad:</label>
        <select 
          id={`${formId}-modalidad`}
          name="modalidad" 
          value={filters.modalidad} 
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Todas</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor={`${formId}-nivel`}>Nivel:</label>
        <select 
          id={`${formId}-nivel`}
          name="nivel" 
          value={filters.nivel} 
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Todos</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>
    </div>
  );
}