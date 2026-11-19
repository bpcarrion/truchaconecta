import { supabase } from "@/core/supabase/cliente";

import type { Lote } from "../../domain/entities/Lote";
import type { LoteRepository } from "../../domain/ports/LoteRepository";

const TABLA = "lotes";

// Así se ve una fila de la tabla en Supabase.
type FilaLote = {
  id: string;
  codigo: string;
  producto: string;
  origen: string;
  cantidad: string;
  llegada: string;
};

function aEntidad(fila: FilaLote): Lote {
  return {
    id: fila.id,
    codigo: fila.codigo,
    producto: fila.producto,
    origen: fila.origen,
    cantidad: fila.cantidad,
    llegada: fila.llegada,
  };
}

function aFila(lote: Lote): FilaLote {
  return {
    id: lote.id,
    codigo: lote.codigo,
    producto: lote.producto,
    origen: lote.origen,
    cantidad: lote.cantidad,
    llegada: lote.llegada,
  };
}

export class LoteRepositorySupabase implements LoteRepository {
  async obtenerTodos(): Promise<Lote[]> {
    const { data, error } = await supabase.from(TABLA).select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(aEntidad);
  }

  async obtenerPorId(id: string): Promise<Lote | null> {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? aEntidad(data) : null;
  }

  async guardar(lote: Lote): Promise<void> {
    const { error } = await supabase.from(TABLA).insert(aFila(lote));
    if (error) throw new Error(error.message);
  }

  async actualizar(lote: Lote): Promise<void> {
    // .select("id") devuelve las filas realmente modificadas.
    const { data, error } = await supabase
      .from(TABLA)
      .update(aFila(lote))
      .eq("id", lote.id)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error(
        "No se actualizó ninguna fila: el lote no existe o falta la política RLS.",
      );
    }
  }

  async eliminar(id: string): Promise<void> {
    const { data, error } = await supabase
      .from(TABLA)
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      throw new Error(
        "No se eliminó ninguna fila: el lote no existe o falta la política RLS.",
      );
    }
  }
}
