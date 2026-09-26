export enum EstadoTarea {
  PENDIENTE = "Pendiente",
  EN_CURSO = "En Curso",
  TERMINADA = "Terminada",
  CANCELADA = "Cancelada"
}

export enum DificultadTarea {
  FACIL = 1,
  MEDIO = 2,
  DIFÍCIL = 3
}

export interface Tarea {
  id: number;
  titulo: string;
  descripcion?: string;
  estado: EstadoTarea;
  creacion: Date;
  ultimaEdicion: Date;
  vencimiento?: Date;
  dificultad: DificultadTarea;
}