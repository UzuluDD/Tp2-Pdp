import { Tarea, EstadoTarea, DificultadTarea } from './types';

const tareas: Tarea[] = [];
let proximoId = 1;

export function crearTarea(titulo: string, descripcion?: string, dificultad: DificultadTarea = DificultadTarea.FACIL): Tarea {
  const fechaActual = new Date();
  const nuevaTarea: Tarea = {
    id: proximoId++,
    titulo,
    descripcion: descripcion || undefined,
    estado: EstadoTarea.PENDIENTE,
    creacion: fechaActual,
    ultimaEdicion: fechaActual,
    dificultad
  };
  tareas.push(nuevaTarea);
  return nuevaTarea;
}

export function obtenerTodasLasTareas(): Tarea[] {
  return [...tareas];
}

export function obtenerTareasPorEstado(estado: EstadoTarea): Tarea[] {
  return tareas.filter(t => t.estado === estado);
}

export function buscarTareasPorTitulo(criterio: string): Tarea[] {
  return tareas.filter(t => t.titulo.toLowerCase().includes(criterio.toLowerCase()));
}

export function obtenerTareaPorId(id: number): Tarea | undefined {
  return tareas.find(t => t.id === id);
}
export function cambiarEstadoTarea(id: number, nuevoEstado: EstadoTarea): boolean {
  const tarea = obtenerTareaPorId(id)
  if(!tarea) return false;

  tarea.estado = nuevoEstado;
  tarea.ultimaEdicion = new Date();
  return true;
}