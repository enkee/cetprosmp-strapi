"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generar_menu_1 = require("../../../../utils/_otros/generar-menu");
exports.default = {
    async afterCreate() {
        await (0, generar_menu_1.generarMenuCarreras)(strapi);
    },
    async afterUpdate() {
        await (0, generar_menu_1.generarMenuCarreras)(strapi);
    },
    async afterDelete() {
        await (0, generar_menu_1.generarMenuCarreras)(strapi);
    },
};
