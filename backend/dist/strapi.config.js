"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("✅ Strapi está leyendo strapi.config.ts correctamente");
exports.default = {
    typescript: {
        // Esta línea activa la lectura de schema.ts
        enableProjectTypeScriptServer: true,
    },
};
