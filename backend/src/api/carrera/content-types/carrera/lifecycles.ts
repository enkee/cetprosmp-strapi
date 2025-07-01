import { generarMenuCarreras } from '../../../../utils/generar-menu';

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
