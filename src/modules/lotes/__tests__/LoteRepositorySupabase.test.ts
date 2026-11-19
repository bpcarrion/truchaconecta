import { LoteRepositorySupabase } from "../infrastructure/repositories/LoteRepositorySupabase";

// Cliente falso de Supabase: cada método devuelve el mismo "constructor de consultas"
// y al esperar (await) el resultado se obtiene lo que dejemos en `mockRespuesta`.
const mockRespuesta: { data: unknown; error: { message: string } | null } = {
  data: null,
  error: null,
};

const mockConsulta: Record<string, jest.Mock> & { then?: unknown } = {};
for (const metodo of ["select", "insert", "update", "delete", "eq"]) {
  mockConsulta[metodo] = jest.fn(() => mockConsulta);
}
mockConsulta.maybeSingle = jest.fn(() => Promise.resolve(mockRespuesta));
mockConsulta.then = (resolver: (valor: unknown) => unknown) =>
  Promise.resolve(mockRespuesta).then(resolver);

const mockFrom = jest.fn(() => mockConsulta);

jest.mock("@/core/supabase/cliente", () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...(args as [])) },
}));

const lote = {
  id: "1",
  codigo: "LOTE-ESP-001",
  producto: "Ova embrionada de trucha arcoíris",
  origen: "España",
  cantidad: "200000",
  llegada: "2026-12-15",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockRespuesta.data = null;
  mockRespuesta.error = null;
});

describe("LoteRepositorySupabase", () => {
  it("guardar inserta una fila en la tabla lotes", async () => {
    await new LoteRepositorySupabase().guardar(lote);
    expect(mockFrom).toHaveBeenCalledWith("lotes");
    expect(mockConsulta.insert).toHaveBeenCalledWith(lote);
  });

  it("guardar lanza un error si Supabase responde con error", async () => {
    mockRespuesta.error = { message: "permission denied" };
    await expect(new LoteRepositorySupabase().guardar(lote)).rejects.toThrow(
      "permission denied",
    );
  });

  it("obtenerTodos convierte las filas en entidades", async () => {
    mockRespuesta.data = [{ ...lote, creado_en: "2026-11-16T10:00:00Z" }];
    const lotes = await new LoteRepositorySupabase().obtenerTodos();
    expect(lotes).toEqual([lote]);
  });

  it("obtenerPorId devuelve null si no hay fila", async () => {
    mockRespuesta.data = null;
    expect(await new LoteRepositorySupabase().obtenerPorId("x")).toBeNull();
    expect(mockConsulta.eq).toHaveBeenCalledWith("id", "x");
  });

  it("actualizar falla si no se modificó ninguna fila (por ejemplo, falta la política RLS)", async () => {
    mockRespuesta.data = [];
    await expect(new LoteRepositorySupabase().actualizar(lote)).rejects.toThrow(
      "No se actualizó ninguna fila",
    );
  });

  it("eliminar funciona cuando se borró una fila y falla cuando no se borró ninguna", async () => {
    const repo = new LoteRepositorySupabase();
    mockRespuesta.data = [{ id: "1" }];
    await expect(repo.eliminar("1")).resolves.toBeUndefined();
    mockRespuesta.data = [];
    await expect(repo.eliminar("1")).rejects.toThrow("No se eliminó ninguna fila");
  });
});
