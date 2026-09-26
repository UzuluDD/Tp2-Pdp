import promptSync from 'prompt-sync';
import { EstadoTarea, DificultadTarea, Tarea } from './types';
import { 
  crearTarea, 
  obtenerTodasLasTareas, 
  obtenerTareasPorEstado, 
  buscarTareasPorTitulo, 
  obtenerTareaPorId, 
  cambiarEstadoTarea
} from './taskService';

const prompt = promptSync({ sigint: true });

function pedirTexto(pregunta: string): string {
  return prompt(pregunta) || "";
}

function obtenerDificultadEmoji(dificultad: DificultadTarea): string {
  switch (dificultad) {
    case DificultadTarea.FACIL: return "⭐ (Fácil)";
    case DificultadTarea.MEDIO: return "⭐⭐ (Medio)";
    case DificultadTarea.DIFÍCIL: return "⭐⭐⭐ (Difícil)";
  }
}

export function menuPrincipal(): void {
  console.clear();
  console.log("====================================");
  console.log("       ¡Hola! ¿Qué deseas hacer?    ");
  console.log("====================================");
  console.log("[1] Ver mis Tareas");
  console.log("[2] Buscar una Tarea");
  console.log("[3] Agregar una Tarea");
  console.log("[0] Salir");
  console.log("------------------------------------");

  const opcion = pedirTexto("> Selecciona una opción: ");

  switch (opcion.trim()) {
    case "1": menuVerMisTareas(); break;
    case "2": menuBuscarTarea(); break;
    case "3": agregarTarea(); break;
    case "0": console.log("\n¡Hasta luego!"); return;
    default:
      pedirTexto("\n❌ Opción inválida. Presiona ENTER para intentar nuevamente.");
      menuPrincipal();
      break;
  }
}

function menuVerMisTareas(): void {
  console.clear();
  console.log("====================================");
  console.log("        ¿Qué tareas deseas ver?     ");
  console.log("====================================");
  console.log("[1] Todas");
  console.log("[2] Pendientes");
  console.log("[3] En curso");
  console.log("[4] Terminadas");
  console.log("[0] Volver al Menú Principal");
  console.log("------------------------------------");

  const opcion = pedirTexto("> Selecciona una opción: ");

  switch (opcion.trim()) {
    case "1": listarTareas(obtenerTodasLasTareas(), "Todas las tareas"); break;
    case "2": listarTareas(obtenerTareasPorEstado(EstadoTarea.PENDIENTE), "Tareas Pendientes"); break;
    case "3": listarTareas(obtenerTareasPorEstado(EstadoTarea.EN_CURSO), "Tareas En Curso"); break;
    case "4": listarTareas(obtenerTareasPorEstado(EstadoTarea.TERMINADA), "Tareas Terminadas"); break;
    case "0": menuPrincipal(); break;
    default:
      pedirTexto("\n❌ Opción inválida. Presiona ENTER para intentar nuevamente.");
      menuVerMisTareas();
      break;
  }
}

function listarTareas(lista: Tarea[], tituloSeccion: string): void {
  console.clear();
  console.log(`====================================`);
  console.log(`      ${tituloSeccion}            `);
  console.log(`====================================`);

  if (lista.length === 0) {
    console.log("\nNo se encontraron tareas en esta categoría.");
  } else {
    const ordenadas = [...lista].sort((a, b) => b.creacion.getTime() - a.creacion.getTime());
    ordenadas.forEach((tarea) => {
      console.log(`[${tarea.id}] ${tarea.titulo} - (${tarea.estado})`);
    });
  }

  console.log("\n------------------------------------");
  console.log("Escribe el N° de ID para ver detalles de una tarea.");
  console.log("Ingresa [0] para volver al menú de visualización.");

  const entrada = pedirTexto("> Opción: ");
  const idSeleccionado = parseInt(entrada.trim(), 10);

  if (idSeleccionado === 0) {
    menuVerMisTareas();
    return;
  }

  const tareaEncontrada = obtenerTareaPorId(idSeleccionado);

  if (tareaEncontrada) {
    verDetalleTarea(tareaEncontrada);
    listarTareas(lista, tituloSeccion);
  } else {
    pedirTexto("\n❌ El ID ingresado no es válido o no está en esta lista. Presiona ENTER.");
    listarTareas(lista, tituloSeccion);
  }
}

function verDetalleTarea(tarea: Tarea): void {
  console.clear();
  console.log("====================================");
  console.log(` Detalle de Tarea #${tarea.id}     `);
  console.log("====================================");
  console.log(`Título:        ${tarea.titulo}`);
  console.log(`Descripción:   ${tarea.descripcion || "(Sin descripción)"}`);
  console.log(`Estado:        ${tarea.estado}`);
  console.log(`Dificultad:    ${obtenerDificultadEmoji(tarea.dificultad)}`);
  console.log(`Creación:      ${tarea.creacion.toLocaleString()}`);
  console.log(`Última Edición:${tarea.ultimaEdicion.toLocaleString()}`);
  console.log(`Vencimiento:   ${tarea.vencimiento ? tarea.vencimiento.toLocaleDateString() : "(Sin vencimiento)"}`);
  console.log("------------------------------------");
  
  const respuesta = pedirTexto("\n¿Deseas cambiar el estado de esta tarea? [S/N]: ")
  const quiereCambiarEstado: boolean = respuesta === "s" || respuesta === "si" || respuesta === "sí";
  
  if(quiereCambiarEstado){
    console.log("\nSelecciona el nuevo estado: ");
    console.log("\n[1]Pendiente");
    console.log("\n[2]En curso");
    console.log("\n[3]Terminada");
    console.log("\n[4]Cancelada");

    const opcionEstado = pedirTexto("> Estado (1-4): ").trim()
    let nuevoEstado: EstadoTarea | null = null

    switch (opcionEstado) {
      case "1": nuevoEstado = EstadoTarea.PENDIENTE; break;
      case "2": nuevoEstado = EstadoTarea.EN_CURSO; break;
      case "3": nuevoEstado = EstadoTarea.TERMINADA; break;
      case "4": nuevoEstado = EstadoTarea.CANCELADA; break;
      default:
        pedirTexto("\n Opcion no valida. No se modifico el estado. Preciona ENTER.");
    }
    if (nuevoEstado) {
      cambiarEstadoTarea(tarea.id, nuevoEstado);
      pedirTexto(`\n Estado actualizado a " ${nuevoEstado} " con exito. Presiona Enter`);
    }
  } 
  else{
  pedirTexto("\nPresiona ENTER para volver al listado.");
  }
}

function agregarTarea(): void {
  console.clear();
  console.log("====================================");
  console.log("        Agregar Nueva Tarea         ");
  console.log("====================================");

  let titulo = "";
  while (!titulo) {
    titulo = pedirTexto("Título (obligatorio, máx 100 caracteres): ");
    if (titulo.length > 100) {
      console.log("❌ El título no puede superar los 100 caracteres.");
      titulo = "";
    }
  }

  const descripcion = pedirTexto("Descripción (opcional, máx 500 caracteres): ");
  
  console.log("\nDificultad: [1] Fácil  [2] Medio  [3] Difícil (por defecto 1)");
  const difInput = pedirTexto("Selecciona dificultad (1-3): ");
  let dificultad: DificultadTarea = DificultadTarea.FACIL;
  if (difInput.trim() === "2") dificultad = DificultadTarea.MEDIO;
  if (difInput.trim() === "3") dificultad = DificultadTarea.DIFÍCIL;

  crearTarea(titulo, descripcion, dificultad);

  pedirTexto("\n✅ Tarea creada con éxito. Presiona ENTER para continuar.");
  menuPrincipal();
}

function menuBuscarTarea(): void {
  console.clear();
  console.log("====================================");
  console.log("          Buscar una Tarea          ");
  console.log("====================================");

  const busqueda = pedirTexto("Ingresa el título o parte del título a buscar: ");
  const resultados = buscarTareasPorTitulo(busqueda);

  listarTareas(resultados, `Resultados para: "${busqueda}"`);
}

// Arrancar la aplicación
menuPrincipal();