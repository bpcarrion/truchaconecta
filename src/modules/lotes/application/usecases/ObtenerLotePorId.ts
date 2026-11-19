import type { Lote } from "../../domain/entities/Lote";
import type { LoteRepository } from "../../domain/ports/LoteRepository";

export class ObtenerLotePorId {
  constructor(private readonly repositorio: LoteRepository) {}

  async ejecutar(id: string): Promise<Lote | null> {
    return this.repositorio.obtenerPorId(id);
  }
}
