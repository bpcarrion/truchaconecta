import { ActualizarLote } from "../application/usecases/ActualizarLote";
import { CrearLote } from "../application/usecases/CrearLote";
import { EliminarLote } from "../application/usecases/EliminarLote";
import { ObtenerLotePorId } from "../application/usecases/ObtenerLotePorId";
import { ObtenerLotes } from "../application/usecases/ObtenerLotes";
import type { Lote } from "../domain/entities/Lote";
import type { LoteRepository } from "../domain/ports/LoteRepository";

// Repositorio falso: guarda en un arreglo, sin Supabase ni internet.
class RepositorioEnMemoria implements LoteRepository {
  lotes: Lote[] = [];

  async guardar(lote: Lote) {
    this.lotes.push(lote);
  }
  async obtenerTodos() {
    return this.lotes;
  }
  async obtenerPorId(id: string) {
    return this.lotes.find((l) => l.id === id) ?? null;
  }
  async actualizar(lote: Lote) {
    this.lotes = this.lotes.map((l) => (l.id === lote.id ? lote : l));
  }
  async eliminar(id: string) {
    this.lotes = this.lotes.filter((l) => l.id !== id);
  }
}

const datosValidos = {
  codigo: "LOTE-ESP-001",
  producto: "Ova embrionada de trucha arcoíris",
  origen: "España",
  cantidad: "200000",
  llegada: "2026-12-15",
};

describe("CrearLote", () => {
  it("guarda un lote válido y le asigna un id", async () => {
    const repo = new RepositorioEnMemoria();
    const resultado = await new CrearLote(repo).ejecutar(datosValidos);
    expect(resultado.ok).toBe(true);
    expect(repo.lotes).toHaveLength(1);
    expect(repo.lotes[0].id).not.toBe("");
    expect(repo.lotes[0].codigo).toBe("LOTE-ESP-001");
  });

  it("no guarda si hay campos inválidos y devuelve los errores", async () => {
    const repo = new RepositorioEnMemoria();
    const resultado = await new CrearLote(repo).ejecutar({
      ...datosValidos,
      codigo: " ",
      producto: "",
    });
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(Object.keys(resultado.errores).sort()).toEqual(["codigo", "producto"]);
    }
    expect(repo.lotes).toHaveLength(0);
  });

  it("elimina espacios sobrantes antes de guardar", async () => {
    const repo = new RepositorioEnMemoria();
    await new CrearLote(repo).ejecutar({ ...datosValidos, codigo: "  LOTE-002  " });
    expect(repo.lotes[0].codigo).toBe("LOTE-002");
  });
});

describe("ObtenerLotes", () => {
  it("devuelve los lotes en orden alfabético por código", async () => {
    const repo = new RepositorioEnMemoria();
    const crear = new CrearLote(repo);
    await crear.ejecutar({ ...datosValidos, codigo: "LOTE-ESP-002" });
    await crear.ejecutar({ ...datosValidos, codigo: "LOTE-ESP-001" });
    const lotes = await new ObtenerLotes(repo).ejecutar();
    expect(lotes.map((l) => l.codigo)).toEqual(["LOTE-ESP-001", "LOTE-ESP-002"]);
  });

  it("devuelve una lista vacía si no hay lotes", async () => {
    expect(await new ObtenerLotes(new RepositorioEnMemoria()).ejecutar()).toEqual([]);
  });
});

describe("ObtenerLotePorId", () => {
  it("devuelve el lote si existe y null si no existe", async () => {
    const repo = new RepositorioEnMemoria();
    const creado = await new CrearLote(repo).ejecutar(datosValidos);
    if (!creado.ok) throw new Error("No se pudo crear");
    const caso = new ObtenerLotePorId(repo);
    expect((await caso.ejecutar(creado.lote.id))?.codigo).toBe("LOTE-ESP-001");
    expect(await caso.ejecutar("no-existe")).toBeNull();
  });
});

describe("ActualizarLote", () => {
  it("cambia los datos del lote y conserva su id", async () => {
    const repo = new RepositorioEnMemoria();
    const creado = await new CrearLote(repo).ejecutar(datosValidos);
    if (!creado.ok) throw new Error("No se pudo crear");
    const resultado = await new ActualizarLote(repo).ejecutar(creado.lote.id, {
      ...datosValidos,
      codigo: " LOTE-ESP-999 ",
    });
    expect(resultado.ok).toBe(true);
    expect(repo.lotes).toHaveLength(1);
    expect(repo.lotes[0].id).toBe(creado.lote.id);
    expect(repo.lotes[0].codigo).toBe("LOTE-ESP-999");
  });

  it("no actualiza si los datos son inválidos", async () => {
    const repo = new RepositorioEnMemoria();
    const creado = await new CrearLote(repo).ejecutar(datosValidos);
    if (!creado.ok) throw new Error("No se pudo crear");
    const resultado = await new ActualizarLote(repo).ejecutar(creado.lote.id, {
      ...datosValidos,
      llegada: "",
    });
    expect(resultado.ok).toBe(false);
    expect(repo.lotes[0].llegada).toBe("2026-12-15");
  });
});

describe("EliminarLote", () => {
  it("elimina solo el lote indicado", async () => {
    const repo = new RepositorioEnMemoria();
    const crear = new CrearLote(repo);
    const a = await crear.ejecutar({ ...datosValidos, codigo: "LOTE-A01" });
    await crear.ejecutar({ ...datosValidos, codigo: "LOTE-B02" });
    if (!a.ok) throw new Error("No se pudo crear");
    await new EliminarLote(repo).ejecutar(a.lote.id);
    expect(repo.lotes.map((l) => l.codigo)).toEqual(["LOTE-B02"]);
  });
});
