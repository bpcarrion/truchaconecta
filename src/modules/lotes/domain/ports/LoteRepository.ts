import type { Lote } from "../entities/Lote";

export interface LoteRepository {
  guardar(lote: Lote): Promise<void>;
  obtenerTodos(): Promise<Lote[]>;
  obtenerPorId(id: string): Promise<Lote | null>;
  actualizar(lote: Lote): Promise<void>;
  eliminar(id: string): Promise<void>;
}
