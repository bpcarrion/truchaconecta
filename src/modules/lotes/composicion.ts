import { ActualizarLote } from "./application/usecases/ActualizarLote";
import { CrearLote } from "./application/usecases/CrearLote";
import { EliminarLote } from "./application/usecases/EliminarLote";
import { ObtenerLotePorId } from "./application/usecases/ObtenerLotePorId";
import { ObtenerLotes } from "./application/usecases/ObtenerLotes";
import { LoteRepositorySupabase } from "./infrastructure/repositories/LoteRepositorySupabase";

// Único lugar donde se decide qué implementación concreta se usa.
const repositorio = new LoteRepositorySupabase();

export const crearLote = new CrearLote(repositorio);
export const obtenerLotes = new ObtenerLotes(repositorio);
export const obtenerLotePorId = new ObtenerLotePorId(repositorio);
export const actualizarLote = new ActualizarLote(repositorio);
export const eliminarLote = new EliminarLote(repositorio);
