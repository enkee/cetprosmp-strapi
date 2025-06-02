import fs from 'fs';
import path from 'path';
import { populateAllRelations } from './populate-all-relations';

/**
 * Función para exportar un backup completo de todas las colecciones del backend de Strapi,
 * incluyendo sus relaciones (anidadas hasta 3 niveles).
 */
export async function exportarBackup(strapi: any) {
    // 🔍 Filtra todos los UIDs que pertenecen a colecciones de tipo 'api::'
    const colecciones = Object.keys(strapi.contentTypes).filter(uid =>
        uid.startsWith('api::')
    );

    // 📁 Define y crea la carpeta de destino para los backups (por defecto: /public/backups)
    const backupDir = path.resolve('public', 'backups');
    fs.mkdirSync(backupDir, { recursive: true });

    // 🔁 Itera sobre cada colección API
    for (const uid of colecciones) {
        try {
            // 🧠 Obtiene una estructura de populate con todas las relaciones hasta 3 niveles de profundidad
            const populate = populateAllRelations(strapi, uid, 3);

            // 📥 Recupera todos los registros de esa colección con relaciones pobladas
            const data = await strapi.entityService.findMany(uid, {
                populate,
                pagination: { pageSize: 1000 }, // máximo 1000 por colección
            });

            // 📝 Guarda los datos en un archivo JSON con el nombre de la colección
            const filePath = path.join(backupDir, `${uid.split('.')[1]}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

            console.log(`✅ Backup de ${uid} exportado`);
        } catch (err: any) {
            // 🚨 Si hay un error exportando una colección, se muestra en consola
            console.error(`❌ Error exportando ${uid}: ${err.message}`);
        }
    }

    // ✅ Mensaje final indicando que se completaron todos los backups
    console.log('📁 Backups completos con relaciones anidadas (hasta nivel 3).');
}
