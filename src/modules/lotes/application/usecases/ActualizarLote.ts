import type { Lote } from "../../domain/entities/Lote";
import type { LoteRepository } from "../../domain/ports/LoteRepository";
import {
  limpiarDatos,
  validarLote,
  type DatosLote,
  type ErroresLote,
} from "../../domain/rules/validarLote";

export type ResultadoActualizarLote =
  { ok: true; lote: Lote } | { ok: false; errores: ErroresLote };

export class ActualizarLote {
  constructor(private readonly repositorio: LoteRepository) {}

  async ejecutar(id: string, datos: DatosLote): Promise<ResultadoActualizarLote> {
    const limpios = limpiarDatos(datos);
    const errores = validarLote(limpios);
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }
    const lote: Lote = { id, ...limpios };
    await this.repositorio.actualizar(lote);
    return { ok: true, lote };
  }
}
