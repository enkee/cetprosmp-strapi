import { generarMenuCarreras } from '../../../../utils/_otros/generar-menu';

export default {
    async afterCreate() {
        await generarMenuCarreras(strapi);
    },
    async afterUpdate() {
        await generarMenuCarreras(strapi);
    },
    async afterDelete() {
        await generarMenuCarreras(strapi);
    },
};
