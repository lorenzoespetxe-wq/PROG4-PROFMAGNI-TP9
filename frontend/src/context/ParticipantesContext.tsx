import { createContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import type { Participante } from '../models/Participante';
import { participantesReducer } from '../reducers/participantesReducer';
import { useAuth } from './AuthContext';

interface ContextType {
  participantes: Participante[];
  participanteAEditar: Participante | null;
  seleccionarParaEdicion: (p: Participante | null) => void;
  agregar: (p: Omit<Participante, 'id'>) => Promise<void>;
  editar: (id: number, p: Omit<Participante, 'id'>) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  resetear: () => Promise<void>;
}

export const ParticipantesContext = createContext<ContextType | undefined>(undefined);
// Se ajusta a 127.0.0.1 para evitar tiempos de espera de DNS
const API_URL = 'http://127.0.0.1:8000/participantes';

export function ParticipantesProvider({ children }: { children: ReactNode }) {
  const [participantes, dispatch] = useReducer(participantesReducer, []);
  const [participanteAEditar, setParticipanteAEditar] = useState<Participante | null>(null);

  // Extraemos el token del contexto de autenticación
  const { token } = useAuth();

  // Helper para obtener los headers con el token actualizado desde el estado
  const getAuthHeaders = (extraHeaders = {}) => {
    return {
      'Authorization': `Bearer ${token}`,
      ...extraHeaders,
    };
  };

  // Se añade el token como dependencia y un if para abortar si no hay sesión
  useEffect(() => {
    if (!token) return;

    // Se agrega la barra final "/" a la URL para evitar el error 307 de redirección
    fetch(`${API_URL}/`, {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error("Error de autorización o red");
        return res.json();
      })
      .then(data => dispatch({ type: 'GET_PARTICIPANTES', payload: data }))
      .catch(err => console.error("Error obteniendo datos:", err));
  }, [token]);

  const seleccionarParaEdicion = (p: Participante | null) => {
    setParticipanteAEditar(p);
  };

  const agregar = async (p: Omit<Participante, 'id'>) => {
    try {
      // Se agrega la barra final "/" a la URL para evitar el error 307 de redirección
      const res = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const nuevoParticipante = await res.json();
        dispatch({ type: 'AGREGAR', payload: nuevoParticipante });
      } else {
        const error = await res.json();
        alert(`Error al crear: ${JSON.stringify(error)}`);
      }
    } catch (err) {
      console.error("Error agregando:", err);
    }
  };

  const editar = async (id: number, p: Omit<Participante, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const participanteActualizado = await res.json();
        dispatch({ type: 'EDITAR', payload: participanteActualizado });
        setParticipanteAEditar(null); 
      } else {
        const errorData = await res.json();
        console.error("Error Backend al editar:", errorData);
        alert(`Error del Backend (Código ${res.status}):\n${JSON.stringify(errorData.detail, null, 2)}`);
      }
    } catch (err) {
      console.error("Error editando:", err);
    }
  };

  const eliminar = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.status === 204) {
      dispatch({ type: 'ELIMINAR', payload: id });
    }
  };

  const resetear = async () => {
    await Promise.all(participantes.map(p => fetch(`${API_URL}/${p.id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    })));
    dispatch({ type: 'RESET', payload: [] });
  };

  return (
    <ParticipantesContext.Provider value={{ 
      participantes, 
      participanteAEditar, 
      seleccionarParaEdicion, 
      agregar, 
      editar, 
      eliminar, 
      resetear 
    }}>
      {children}
    </ParticipantesContext.Provider>
  );
}