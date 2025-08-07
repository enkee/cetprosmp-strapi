"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generar_carrusel_1 = require("../../../../utils/generar-carrusel");
const generar_especialidades_1 = require("../../../../utils/generar-especialidades");
exports.default = {
    async afterCreate() {
        //await generarMenuCarreras(strapi);
        await (0, generar_carrusel_1.generarCarruselPortada)(strapi);
        await (0, generar_especialidades_1.generarEspecialidades)(strapi);
    },
    async afterUpdate() {
        //await generarMenuCarreras(strapi);
        await (0, generar_carrusel_1.generarCarruselPortada)(strapi);
        await (0, generar_especialidades_1.generarEspecialidades)(strapi);
    },
    async afterDelete() {
        //await generarMenuCarreras(strapi);
        await (0, generar_carrusel_1.generarCarruselPortada)(strapi);
        await (0, generar_especialidades_1.generarEspecialidades)(strapi);
    },
};
