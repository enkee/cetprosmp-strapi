"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importa la función encargada de generar automáticamente el campo `titulo` del paquete
const generar_titulo_paquete_1 = require("../../../../utils/generar-titulo-paquete");
exports.default = {
    /**
     * Hook que se ejecuta después de crear un paquete.
     * Se encarga de generar automáticamente el título del paquete con base en los grupos asociados.
     */
    async afterCreate(event) {
        const { result } = event;
        console.log('✅ afterCreate ejecutado para paquete:', result.id);
        // Se usa setTimeout para asegurar que las relaciones (como los grupos) estén totalmente asociadas
        setTimeout(() => (0, generar_titulo_paquete_1.generarTituloPaquete)(result.id), 50);
    },
    /**
     * Hook que se ejecuta después de actualizar un paquete.
     * También se asegura de actualizar el título del paquete cuando cambian sus relaciones o datos relevantes.
     */
    async afterUpdate(event) {
        const { result } = event;
        console.log('✅ afterUpdate ejecutado para paquete:', result.id);
        // Igual que en afterCreate, se usa setTimeout para evitar condiciones de carrera
        setTimeout(() => (0, generar_titulo_paquete_1.generarTituloPaquete)(result.id), 50);
    },
};
