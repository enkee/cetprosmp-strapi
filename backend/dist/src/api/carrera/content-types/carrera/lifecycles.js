"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { generarMenuCarreras } from '../../../../utils/_otros/generar-menu';
const generar_carrusel_1 = require("../../../../utils/generar-carrusel");
const generar_carreras_1 = require("../../../../utils/generar-carreras");
exports.default = {
    async afterCreate() {
        //await generarMenuCarreras(strapi);
        await (0, generar_carrusel_1.generarCarruselPortada)(strapi);
        await (0, generar_carreras_1.generarCarreras)(strapi);
    },
    async afterUpdate() {
        //await generarMenuCarreras(strapi);
        await (0, generar_carrusel_1.generarCarruselPortada)(strapi);
        await (0, generar_carreras_1.generarCarreras)(strapi);
    },
    async afterDelete() {
        //await generarMenuCarreras(strapi);
        await (0, generar_carrusel_1.generarCarruselPortada)(strapi);
        await (0, generar_carreras_1.generarCarreras)(strapi);
    },
};
