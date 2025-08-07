"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generar_publicaciones_1 = require("../../../../utils/generar-publicaciones");
exports.default = {
    async afterCreate() {
        await (0, generar_publicaciones_1.generarPublicaciones)(strapi);
    },
    async afterUpdate() {
        await (0, generar_publicaciones_1.generarPublicaciones)(strapi);
    },
    async afterDelete() {
        await (0, generar_publicaciones_1.generarPublicaciones)(strapi);
    },
};
