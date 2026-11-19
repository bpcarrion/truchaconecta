import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import type { DatosLote, ErroresLote } from "../../domain/rules/validarLote";
import { actualizarLote, crearLote, obtenerLotePorId } from "../../composicion";

const DATOS_VACIOS: DatosLote = {
  codigo: "",
  producto: "",
  origen: "España",
  cantidad: "",
  llegada: "",
};

// Sin id = crear un lote nuevo. Con id = editar el lote que ya existe.
export function useFormularioLote(id?: string) {
  const router = useRouter();
  const [datos, setDatos] = useState<DatosLote>(DATOS_VACIOS);
  const [errores, setErrores] = useState<ErroresLote>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [cargando, setCargando] = useState(id !== undefined);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (id === undefined) return;
    obtenerLotePorId
      .ejecutar(id)
      .then((lote) => {
        if (lote) {
          setDatos({
            codigo: lote.codigo,
            producto: lote.producto,
            origen: lote.origen,
            cantidad: lote.cantidad,
            llegada: lote.llegada,
          });
        } else {
          setErrorGeneral("Este lote ya no existe.");
        }
      })
      .catch(() => setErrorGeneral("No se pudo cargar el lote."))
      .finally(() => setCargando(false));
  }, [id]);

  function cambiar(campo: keyof DatosLote, valor: string) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function guardar() {
    setGuardando(true);
    setErrorGeneral(null);
    try {
      const resultado =
        id === undefined
          ? await crearLote.ejecutar(datos)
          : await actualizarLote.ejecutar(id, datos);
      if (!resultado.ok) {
        setErrores(resultado.errores);
        return;
      }
      router.back();
    } catch {
      setErrorGeneral("No se pudo guardar. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return { datos, errores, errorGeneral, cargando, guardando, cambiar, guardar };
}
