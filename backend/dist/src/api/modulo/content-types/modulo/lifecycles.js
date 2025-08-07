"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importamos dos funciones importantes:
// - generarNombreDisplay: para actualizar el campo `nombre_display` de los grupos
// - generarTituloPaquete: para actualizar el campo `titulo` de los paquetes
const generar_nombre_display_1 = require("../../../grupo/content-types/grupo/utils/generar-nombre-display");
const generar_titulo_paquete_1 = require("../../../../utils/generar-titulo-paquete");
//import { generarMenuCarreras } from '../../../../utils/_otros/generar-menu';
const generar_carrusel_1 = require("../../../../utils/generar-carrusel");
const generar_modulos_1 = require("../../../../utils/generar-modulos");
exports.default = {
    /**
     * Hook que se ejecuta después de actualizar un módulo.
     * Es útil cuando cambian datos del módulo (como el título comercial) que afectan
     * a todos los grupos que lo usan y, en consecuencia, a los paquetes que agrupan esos grupos.
     */
    async afterUpdate(event) {
        const { result } = event;
        console.log('🔧 Módulo actualizado:', result.id);
        // Se usa `setTimeout` para evitar conflictos de sincronización de relaciones
        setTimeout(() => procesarImpactoEnGruposYPaquetes(result.id), 100);
        //actuliza la lista de menucarreras
        //await generarMenuCarreras(strapi);
        await (0, generar_carrusel_1.generarCarruselPortada)(strapi);
        await (0, generar_modulos_1.generarModulos)(strapi);
    },
    async afterCreate() {
        //await generarMenuCarreras(strapi);
        await (0, generar_carrusel_1.generarCarruselPortada)(strapi);
        await (0, generar_modulos_1.generarModulos)(strapi);
    },
    async afterDelete() {
        //await generarMenuCarreras(strapi);
        await (0, generar_carrusel_1.generarCarruselPortada)(strapi);
        await (0, generar_modulos_1.generarModulos)(strapi);
    },
};
/**
 * Función auxiliar que se encarga de:
 * 1. Encontrar todos los grupos que están relacionados con el módulo actualizado.
 * 2. Regenerar su campo `nombre_display`.
 * 3. Encontrar todos los paquetes que contienen esos grupos.
 * 4. Regenerar su campo `titulo`.
 */
async function procesarImpactoEnGruposYPaquetes(moduloId) {
    // Busca los grupos relacionados al módulo
    const grupos = await strapi.entityService.findMany('api::grupo.grupo', {
        filters: { modulo: { id: { $eq: moduloId } } },
        fields: ['id'],
    });
    // Extrae solo los IDs de los grupos encontrados
    const grupoIds = grupos.map(g => g.id);
    // Regenera el nombre_display de cada grupo afectado
    for (const grupoId of grupoIds) {
        await (0, generar_nombre_display_1.generarNombreDisplay)(grupoId);
    }
    // Encuentra los paquetes que contienen alguno de estos grupos
    const paquetes = await strapi.entityService.findMany('api::paquete.paquete', {
        filters: { grupos: { id: { $in: grupoIds } } },
        fields: ['id'],
    });
    // Actualiza el título de cada paquete afectado
    for (const paquete of paquetes) {
        await (0, generar_titulo_paquete_1.generarTituloPaquete)(paquete.id);
    }
    console.log(`✅ Títulos de ${paquetes.length} paquetes actualizados.`);
}
