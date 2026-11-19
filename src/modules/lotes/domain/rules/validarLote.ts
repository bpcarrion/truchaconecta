import type { Lote } from "../entities/Lote";

/** Lo que escribe el usuario: todo el lote menos el id (lo genera el sistema). */
export type DatosLote = Omit<Lote, "id">;

/** Un mensaje de error por campo; si el campo está bien, no aparece. */
export type ErroresLote = Partial<Record<keyof DatosLote, string>>;

export function validarLote(datos: DatosLote): ErroresLote {
  const errores: ErroresLote = {};

  if (datos.codigo.trim().length < 3) {
    errores.codigo = "El código debe tener al menos 3 caracteres.";
  }
  if (datos.producto.trim().length === 0) {
    errores.producto = "Escribe el producto (por ejemplo: Ova de trucha arcoíris).";
  }
  if (datos.origen.trim().length === 0) {
    errores.origen = "Escribe el origen del lote (por ejemplo: España).";
  }
  if (!/^\d+$/.test(datos.cantidad.trim()) || Number(datos.cantidad) <= 0) {
    errores.cantidad = "La cantidad debe ser un número entero mayor que 0.";
  }
  if (datos.llegada.trim().length === 0) {
    errores.llegada = "Escribe la fecha estimada de llegada (por ejemplo: 2026-12-15).";
  }

  return errores;
}

/** Quita los espacios sobrantes al inicio y al final de cada campo. */
export function limpiarDatos(datos: DatosLote): DatosLote {
  return {
    codigo: datos.codigo.trim(),
    producto: datos.producto.trim(),
    origen: datos.origen.trim(),
    cantidad: datos.cantidad.trim(),
    llegada: datos.llegada.trim(),
  };
}
