import { generarMenuCarreras } from '../../../../utils/_otros/generar-menu';
import { generarCarruselPortada } from '../../../../utils/generar-carrusel';
import { generarCarreras } from '../../../../utils/generar-carreras';

export default {
    async afterCreate() {
        //await generarMenuCarreras(strapi);
        await generarCarruselPortada(strapi);
        await generarCarreras(strapi);

    },
    async afterUpdate() {
        //await generarMenuCarreras(strapi);
        await generarCarruselPortada(strapi);
        await generarCarreras(strapi);
    },
    async afterDelete() {
        //await generarMenuCarreras(strapi);
        await generarCarruselPortada(strapi);
        await generarCarreras(strapi);
    },
};
