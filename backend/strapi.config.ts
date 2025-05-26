console.log("✅ Strapi está leyendo strapi.config.ts correctamente");

export default {
    typescript: {
        // Esta línea activa la lectura de schema.ts
        enableProjectTypeScriptServer: true,
    },
};
