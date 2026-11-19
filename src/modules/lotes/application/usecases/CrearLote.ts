import type { Lote } from "../../domain/entities/Lote";
import type { LoteRepository } from "../../domain/ports/LoteRepository";
import {
  limpiarDatos,
  validarLote,
  type DatosLote,
  type ErroresLote,
} from "../../domain/rules/validarLote";

export type ResultadoCrearLote =
  { ok: true; lote: Lote } | { ok: false; errores: ErroresLote };

function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class CrearLote {
  constructor(private readonly repositorio: LoteRepository) {}

  async ejecutar(datos: DatosLote): Promise<ResultadoCrearLote> {
    const limpios = limpiarDatos(datos);
    const errores = validarLote(limpios);
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }
    const lote: Lote = { id: generarId(), ...limpios };
    await this.repositorio.guardar(lote);
    return { ok: true, lote };
  }
}
