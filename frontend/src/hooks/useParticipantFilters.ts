import { useState, useMemo } from 'react';
import { type FilterState } from '../components/Filtros';
import { useDebounce } from './useDebounce';

/**
 * Funcionalidad: Gestiona los textos y opciones seleccionadas en el buscador para actualizar 
 * la tabla de participantes. Extrae este mecanismo de la pantalla principal para que el código quede 
 * limpio y la lógica pueda reutilizarse en otras vistas.
 * * Cómo lo hace: Almacena los criterios de búsqueda en un estado local y les aplica el retraso del 
 * `useDebounce`. Luego, emplea `useMemo` para cruzar la lista completa de la base de datos contra 
 * los filtros ingresados. Esto genera y devuelve un nuevo array recortado que solo se recalcula 
 * cuando el usuario realmente deja de escribir.
 */

export function useParticipantFilters(participantes: any[]) {
  const [filters, setFilters] = useState<FilterState>({ nombre: '', modalidad: '', nivel: '' });
  
  // Aplicamos un retraso de 300ms a los filtros ingresados por el usuario
  const debouncedFilters = useDebounce(filters, 300);

  const filteredParticipants = useMemo(() => {
    // La lista se filtra utilizando el estado "retrasado", no el estado en tiempo real
    return participantes.filter((p) => {
      const matchNombre = p.nombre.toLowerCase().includes(debouncedFilters.nombre.toLowerCase());
      const matchModalidad = debouncedFilters.modalidad === '' || p.modalidad === debouncedFilters.modalidad;
      const matchNivel = debouncedFilters.nivel === '' || p.nivel === debouncedFilters.nivel;
      return matchNombre && matchModalidad && matchNivel;
    });
  }, [participantes, debouncedFilters]);

  const clearFilters = () => setFilters({ nombre: '', modalidad: '', nivel: '' });

  return { filters, setFilters, filteredParticipants, clearFilters };
}