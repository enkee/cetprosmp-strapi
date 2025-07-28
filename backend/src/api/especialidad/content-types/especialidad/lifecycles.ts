import { generarMenuCarreras } from '../../../../utils/_otros/generar-menu';
import { generarCarruselPortada } from '../../../../utils/generar-carrusel';
import { generarEspecialidades } from '../../../../utils/generar-especialidades';

export default {
    async afterCreate() {
        //await generarMenuCarreras(strapi);
        await generarCarruselPortada(strapi);
        await generarEspecialidades(strapi);
    },
    async afterUpdate() {
        //await generarMenuCarreras(strapi);
        await generarCarruselPortada(strapi);
        await generarEspecialidades(strapi);
    },
    async afterDelete() {
        //await generarMenuCarreras(strapi);
        await generarCarruselPortada(strapi);
        await generarEspecialidades(strapi);
    },
};
