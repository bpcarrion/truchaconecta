import type { Lote } from "../../domain/entities/Lote";
import type { LoteRepository } from "../../domain/ports/LoteRepository";

export class ObtenerLotes {
  constructor(private readonly repositorio: LoteRepository) {}

  async ejecutar(): Promise<Lote[]> {
    const lotes = await this.repositorio.obtenerTodos();
    return [...lotes].sort((a, b) => a.codigo.localeCompare(b.codigo, "es"));
  }
}
