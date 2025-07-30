import { generarDatoGeneral } from '../../../../utils/generar-dato-general';

export default {
    async afterUpdate(event: any) {
        console.log('✅ Hook afterUpdate ejecutado para dato-general');

        try {
            await generarDatoGeneral(event.result);
        } catch (error) {
            console.error('❌ Error en afterUpdate al generar JSON:', error);
        }
    },
};
