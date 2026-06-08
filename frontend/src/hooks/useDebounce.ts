import { useState, useEffect } from 'react';

/**
 * Funcionalidad: Optimiza el rendimiento de la aplicación pausando cálculos pesados hasta 
 * que el usuario termine de escribir. Evita que la pantalla se congele filtrando una lista letra por letra.
 * * Cómo lo hace: Utiliza un temporizador (`setTimeout`) que retrasa la actualización del valor. 
 * Si el usuario presiona otra tecla antes de que termine el tiempo de espera (ej. 300ms), 
 * el sistema intercepta el cambio, cancela el temporizador anterior y reinicia la cuenta regresiva desde cero.
 */

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establece un temporizador para actualizar el valor después del retraso
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si el valor cambia antes de que termine el retraso, se cancela el temporizador anterior
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}