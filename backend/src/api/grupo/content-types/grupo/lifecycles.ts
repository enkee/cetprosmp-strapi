// Importamos las funciones utilitarias encargadas de generar nombre_display
// y de actualizar los títulos de los paquetes relacionados
import {
    generarNombreDisplay,
} from './utils/generar-nombre-display';

import {
    actualizarTitulosDePaquetesPorGrupo,
    prepararActualizacionPorEliminacion,
    ejecutarActualizacionPostEliminacion,
} from './utils/actualizar-paquetes-desde-grupo';

export default {
    /**
     * Hook que se ejecuta después de crear un grupo.
     * Usa `setTimeout` para dar tiempo a que las relaciones estén completamente establecidas
     * antes de calcular el nombre_display y actualizar los títulos de los paquetes relacionados.
     */
    async afterCreate(event: any) {
        const { result } = event;
        setTimeout(() => {
            generarNombreDisplay(result.id);                     // Genera el nombre_display del grupo
            actualizarTitulosDePaquetesPorGrupo(result.id);      // Actualiza los títulos de los paquetes relacionados
        }, 50); // Pequeña demora para evitar problemas de sincronización con las relaciones
    },

    /**
     * Hook que se ejecuta después de actualizar un grupo.
     * Se aplica la misma lógica que en `afterCreate`.
     */
    async afterUpdate(event: any) {
        const { result } = event;
        setTimeout(() => {
            generarNombreDisplay(result.id);                     // Regenera nombre_display por si hubo cambio en datos clave
            actualizarTitulosDePaquetesPorGrupo(result.id);      // Asegura que los paquetes reflejen el nuevo estado
        }, 50);
    },

    /**
     * Hook que se ejecuta justo antes de eliminar un grupo.
     * Guarda una lista de IDs de paquetes relacionados para luego actualizar sus títulos.
     */
    async beforeDelete(event: any) {
        const grupoId = event.params.where.id;
        await prepararActualizacionPorEliminacion(grupoId);      // Identifica paquetes que necesitan ser actualizados
    },

    /**
     * Hook que se ejecuta después de eliminar un grupo.
     * Usa los datos recolectados previamente para actualizar los títulos de los paquetes afectados.
     */
    async afterDelete() {
        await ejecutarActualizacionPostEliminacion();            // Actualiza los paquetes que perdieron un grupo
    },
};
