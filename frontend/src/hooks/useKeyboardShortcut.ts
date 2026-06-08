import { useEffect } from 'react';

/**
 * Funcionalidad: Permite ejecutar una acción automática al presionar una combinación de teclas 
 * específica (Ctrl + B para ir al buscador), bloqueando la acción nativa del navegador (abrir marcadores).
 * * Cómo lo hace: Registra un "event listener" (escuchador) global en la ventana para detectar cada 
 * pulsación del teclado. Si detecta la combinación exacta, usa `preventDefault()` para cancelar la 
 * acción del navegador y ejecuta la función solicitada. Al salir de la pantalla, limpia el escuchador 
 * para no consumir memoria innecesaria.
 */

export function useKeyboardShortcut(key: string, ctrl: boolean, callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === key.toLowerCase() && event.ctrlKey === ctrl) {
        event.preventDefault(); // Evita el comportamiento por defecto del navegador (ej. abrir marcadores)
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrl, callback]);
}