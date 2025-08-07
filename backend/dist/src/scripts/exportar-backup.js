"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportarBackup = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const populate_all_relations_1 = require("./populate-all-relations");
/**
 * Función para exportar un backup completo de todas las colecciones del backend de Strapi,
 * incluyendo sus relaciones (anidadas hasta 3 niveles).
 */
async function exportarBackup(strapi) {
    // 🔍 Filtra todos los UIDs que pertenecen a colecciones de tipo 'api::'
    const colecciones = Object.keys(strapi.contentTypes).filter(uid => uid.startsWith('api::'));
    // 📁 Define y crea la carpeta de destino para los backups (por defecto: /public/backups)
    const backupDir = path_1.default.resolve('public', 'backups');
    fs_1.default.mkdirSync(backupDir, { recursive: true });
    // 🔁 Itera sobre cada colección API
    for (const uid of colecciones) {
        try {
            // 🧠 Obtiene una estructura de populate con todas las relaciones hasta 3 niveles de profundidad
            const populate = (0, populate_all_relations_1.populateAllRelations)(strapi, uid, 3);
            // 📥 Recupera todos los registros de esa colección con relaciones pobladas
            const data = await strapi.entityService.findMany(uid, {
                populate,
                pagination: { pageSize: 1000 }, // máximo 1000 por colección
            });
            // 📝 Guarda los datos en un archivo JSON con el nombre de la colección
            const filePath = path_1.default.join(backupDir, `${uid.split('.')[1]}.json`);
            fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
            console.log(`✅ Backup de ${uid} exportado`);
        }
        catch (err) {
            // 🚨 Si hay un error exportando una colección, se muestra en consola
            console.error(`❌ Error exportando ${uid}: ${err.message}`);
        }
    }
    // ✅ Mensaje final indicando que se completaron todos los backups
    console.log('📁 Backups completos con relaciones anidadas (hasta nivel 3).');
}
exports.exportarBackup = exportarBackup;
