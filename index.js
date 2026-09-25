"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DificultadTarea = exports.EstadoTarea = void 0;
exports.menuPrincipal = menuPrincipal;
let mensaje = "¡Hola, Bienvenido";
console.log(mensaje);
var EstadoTarea;
(function (EstadoTarea) {
    EstadoTarea["PENDIENTE"] = "Pendiente";
    EstadoTarea["EN_CURSO"] = "En Curso";
    EstadoTarea["TERMINADA"] = "Terminada";
    EstadoTarea["CANCELADA"] = "Cancelada";
})(EstadoTarea || (exports.EstadoTarea = EstadoTarea = {}));
var DificultadTarea;
(function (DificultadTarea) {
    DificultadTarea[DificultadTarea["FACIL"] = 1] = "FACIL";
    DificultadTarea[DificultadTarea["MEDIO"] = 2] = "MEDIO";
    DificultadTarea[DificultadTarea["DIF\u00CDCIL"] = 3] = "DIF\u00CDCIL";
})(DificultadTarea || (exports.DificultadTarea = DificultadTarea = {}));
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)({ sigint: true });
// Repositorio en memoria
const tareas = [];
let proximoId = 1;
const pedirTexto = (pregunta) => {
    return prompt(pregunta) || "";
};
// Formateador para la dificultad en emojis
const obtenerDificultadEmoji = (dificultad) => {
    switch (dificultad) {
        case DificultadTarea.FACIL: return "⭐ (Fácil)";
        case DificultadTarea.MEDIO: return "⭐⭐ (Medio)";
        case DificultadTarea.DIFÍCIL: return "⭐⭐⭐ (Difícil)";
    }
};
// ==========================================
// 1. MENÚ PRINCIPAL
// ==========================================
function menuPrincipal() {
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
        case "1":
            menuVerMisTareas();
            break;
        case "2":
            menuBuscarTarea();
            break;
        case "3":
            agregarTarea();
            break;
        case "0":
            console.log("\n¡Hasta luego!");
            return;
        default:
            pedirTexto("\n❌ Opción inválida. Presiona ENTER para intentar nuevamente.");
            menuPrincipal();
            break;
    }
}
// ==========================================
// 2. MENÚ VER MIS TAREAS
// ==========================================
function menuVerMisTareas() {
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
        case "1":
            listarTareas(tareas, "Todas las tareas");
            break;
        case "2":
            listarTareas(tareas.filter(t => t.estado === EstadoTarea.PENDIENTE), "Tareas Pendientes");
            break;
        case "3":
            listarTareas(tareas.filter(t => t.estado === EstadoTarea.EN_CURSO), "Tareas En Curso");
            break;
        case "4":
            listarTareas(tareas.filter(t => t.estado === EstadoTarea.TERMINADA), "Tareas Terminadas");
            break;
        case "0":
            menuPrincipal();
            break;
        default:
            pedirTexto("\n❌ Opción inválida. Presiona ENTER para intentar nuevamente.");
            menuVerMisTareas();
            break;
    }
}
// ==========================================
// 3. LISTADO DE TAREAS Y VER DETALLE
// ==========================================
function listarTareas(lista, tituloSeccion) {
    console.clear();
    console.log(`====================================`);
    console.log(`      ${tituloSeccion}            `);
    console.log(`====================================`);
    if (lista.length === 0) {
        console.log("\nNo se encontraron tareas en esta categoría.");
    }
    else {
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
    const tareaEncontrada = lista.find(t => t.id === idSeleccionado);
    if (tareaEncontrada) {
        verDetalleTarea(tareaEncontrada);
        listarTareas(lista, tituloSeccion);
    }
    else {
        pedirTexto("\n❌ El ID ingresado no es válido o no está en esta lista. Presiona ENTER.");
        listarTareas(lista, tituloSeccion);
    }
}
function verDetalleTarea(tarea) {
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
    pedirTexto("\nPresiona ENTER para volver al listado.");
}
// ==========================================
// MÉTODOS DE SOPORTE
// ==========================================
function agregarTarea() {
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
    let dificultad = DificultadTarea.FACIL;
    if (difInput.trim() === "2")
        dificultad = DificultadTarea.MEDIO;
    if (difInput.trim() === "3")
        dificultad = DificultadTarea.DIFÍCIL;
    const fechaActual = new Date();
    const nuevaTarea = {
        id: proximoId++,
        titulo,
        descripcion: descripcion || undefined,
        estado: EstadoTarea.PENDIENTE,
        creacion: fechaActual,
        ultimaEdicion: fechaActual,
        dificultad
    };
    tareas.push(nuevaTarea);
    pedirTexto("\n✅ Tarea creada con éxito. Presiona ENTER para continuar.");
    menuPrincipal();
}
function menuBuscarTarea() {
    console.clear();
    console.log("====================================");
    console.log("          Buscar una Tarea          ");
    console.log("====================================");
    const busqueda = pedirTexto("Ingresa el título o parte del título a buscar: ");
    const resultados = tareas.filter(t => t.titulo.toLowerCase().includes(busqueda.toLowerCase()));
    listarTareas(resultados, `Resultados para: "${busqueda}"`);
}
// Inicio del programa
menuPrincipal();
