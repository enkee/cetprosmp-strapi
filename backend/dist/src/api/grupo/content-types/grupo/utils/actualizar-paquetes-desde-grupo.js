"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ejecutarActualizacionPostEliminacion = exports.prepararActualizacionPorEliminacion = exports.actualizarTitulosDePaquetesPorGrupo = void 0;
// Importa la función que genera el título de un paquete según los grupos que contiene.
const generar_titulo_paquete_1 = require("../../../../../utils/generar-titulo-paquete");
// Variable global temporal que almacena los IDs de paquetes afectados por la eliminación de un grupo.
let paquetesPendientes = [];
/**
 * Esta función se llama cuando un grupo se ha creado o actualizado.
 * Busca todos los paquetes que contienen al grupo dado y actualiza sus títulos.
 */
async function actualizarTitulosDePaquetesPorGrupo(grupoId) {
    // Busca todos los paquetes que contienen el grupo específico.
    const paquetes = await strapi.entityService.findMany('api::paquete.paquete', {
        filters: { grupos: { id: { $eq: grupoId } } }, // Filtro: paquetes que tengan el grupo en su lista.
        fields: ['id'], // Solo se necesita el ID para actualizar el título.
    });
    // Por cada paquete encontrado, se actualiza su título.
    for (const paquete of paquetes) {
        await (0, generar_titulo_paquete_1.generarTituloPaquete)(paquete.id);
    }
}
exports.actualizarTitulosDePaquetesPorGrupo = actualizarTitulosDePaquetesPorGrupo;
/**
 * Esta función se ejecuta *antes* de eliminar un grupo.
 * Guarda temporalmente los IDs de los paquetes que dependen del grupo a eliminar,
 * para que puedan ser actualizados después de la eliminación.
 */
async function prepararActualizacionPorEliminacion(grupoId) {
    const paquetes = await strapi.entityService.findMany('api::paquete.paquete', {
        filters: { grupos: { id: { $eq: grupoId } } },
        fields: ['id'],
    });
    // Guarda los IDs de los paquetes afectados por la eliminación.
    paquetesPendientes = paquetes.map(p => p.id);
}
exports.prepararActualizacionPorEliminacion = prepararActualizacionPorEliminacion;
/**
 * Esta función se ejecuta *después* de eliminar un grupo.
 * Usa los IDs almacenados previamente para volver a generar el título de los paquetes afectados.
 */
async function ejecutarActualizacionPostEliminacion() {
    for (const paqueteId of paquetesPendientes) {
        await (0, generar_titulo_paquete_1.generarTituloPaquete)(paqueteId);
    }
    // Limpia la lista de paquetes pendientes para evitar conflictos en futuras eliminaciones.
    paquetesPendientes = [];
}
exports.ejecutarActualizacionPostEliminacion = ejecutarActualizacionPostEliminacion;
