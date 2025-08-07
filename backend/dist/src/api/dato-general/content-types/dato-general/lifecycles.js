"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generar_dato_general_1 = require("../../../../utils/generar-dato-general");
exports.default = {
    async afterUpdate(event) {
        console.log('✅ Hook afterUpdate ejecutado para dato-general');
        try {
            await (0, generar_dato_general_1.generarDatoGeneral)(event.result);
        }
        catch (error) {
            console.error('❌ Error en afterUpdate al generar JSON:', error);
        }
    },
};
