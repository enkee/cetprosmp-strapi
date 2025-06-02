// Importa la función encargada de generar automáticamente el campo `titulo` del paquete
import { generarTituloPaquete } from '../../../../utils/generar-titulo-paquete';

export default {
    /**
     * Hook que se ejecuta después de crear un paquete.
     * Se encarga de generar automáticamente el título del paquete con base en los grupos asociados.
     */
    async afterCreate(event: any) {
        const { result } = event;
        console.log('✅ afterCreate ejecutado para paquete:', result.id);

        // Se usa setTimeout para asegurar que las relaciones (como los grupos) estén totalmente asociadas
        setTimeout(() => generarTituloPaquete(result.id), 50);
    },

    /**
     * Hook que se ejecuta después de actualizar un paquete.
     * También se asegura de actualizar el título del paquete cuando cambian sus relaciones o datos relevantes.
     */
    async afterUpdate(event: any) {
        const { result } = event;
        console.log('✅ afterUpdate ejecutado para paquete:', result.id);

        // Igual que en afterCreate, se usa setTimeout para evitar condiciones de carrera
        setTimeout(() => generarTituloPaquete(result.id), 50);
    },
};

