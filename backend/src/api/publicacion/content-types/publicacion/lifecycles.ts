
import { generarPublicaciones } from '../../../../utils/generar-publicaciones';

export default {
    async afterCreate() {
        await generarPublicaciones(strapi);
    },
    async afterUpdate() {
        await generarPublicaciones(strapi);
    },
    async afterDelete() {
        await generarPublicaciones(strapi);
    },
};
