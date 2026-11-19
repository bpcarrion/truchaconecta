import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { Lote } from "../../domain/entities/Lote";
import { eliminarLote, obtenerLotes } from "../../composicion";

export function useLotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLotes(await obtenerLotes.ejecutar());
      setError(null);
    } catch {
      setError(
        "No se pudieron cargar los lotes. Revisa tu internet y el archivo .env.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  // Se ejecuta cada vez que la pantalla gana el foco:
  // al abrirla y al volver desde otra pantalla.
  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  // Para el gesto de "jalar hacia abajo para actualizar".
  async function refrescar() {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  }

  // Devuelve true si se eliminó y false si falló.
  async function eliminar(id: string): Promise<boolean> {
    try {
      await eliminarLote.ejecutar(id);
      await cargar();
      return true;
    } catch {
      return false;
    }
  }

  return { lotes, cargando, refrescando, error, refrescar, eliminar };
}
