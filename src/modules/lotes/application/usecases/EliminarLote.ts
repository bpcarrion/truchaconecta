import type { LoteRepository } from "../../domain/ports/LoteRepository";

export class EliminarLote {
  constructor(private readonly repositorio: LoteRepository) {}

  async ejecutar(id: string): Promise<void> {
    await this.repositorio.eliminar(id);
  }
}
