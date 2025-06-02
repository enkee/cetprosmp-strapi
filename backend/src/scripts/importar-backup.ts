import fs from 'fs';
import path from 'path';
import { ordenarColeccionesPorDependencias } from './ordenar-por-dependencias';

/**
 * Restaura los datos de los archivos JSON exportados, en orden correcto según sus relaciones.
 * Hace una segunda pasada sobre colecciones cíclicas para actualizar relaciones.
 */
export async function importarBackup(strapi: any) {
    const { orden, ciclicos } = ordenarColeccionesPorDependencias(strapi);
    const backupDir = path.resolve('public', 'backups');

    const idMap = new Map<string, Map<number, number>>(); // uid → { oldId → newId }
    const dataPorColeccion = new Map<string, any[]>(); // uid → datos originales sin id

    // PRIMERA PASADA: crear todos los registros
    for (const uid of orden) {
        const nombreArchivo = uid.split('.')[1] + '.json';
        const ruta = path.join(backupDir, nombreArchivo);

        if (!fs.existsSync(ruta)) {
            console.warn(`⚠️ Archivo no encontrado: ${ruta}`);
            continue;
        }

        const raw = fs.readFileSync(ruta, 'utf-8');
        const registros = JSON.parse(raw);
        idMap.set(uid, new Map());
        dataPorColeccion.set(uid, registros);

        console.log(`📥 Importando ${registros.length} registros para ${uid}`);

        // Eliminar datos existentes (opcional)
        //*
        const existentes = await strapi.entityService.findMany(uid, { limit: 1000 });
        for (const item of existentes) {
            await strapi.entityService.delete(uid, item.id);
            console.log(`  🗑️ Eliminado ID ${item.id}`);
        }
        //*/

        for (const item of registros) {
            const oldId = item.id;
            const sinId = limpiarIds(item);
            const sinRelaciones = eliminarRelaciones(uid, sinId, strapi);

            try {
                const nuevo = await strapi.entityService.create(uid, { data: sinRelaciones });
                idMap.get(uid)?.set(oldId, nuevo.id);
                console.log(`  ✅ ${oldId} → ${nuevo.id}`);
            } catch (err) {
                console.error(`  ❌ Error al insertar en ${uid}:`, err);
            }
        }
    }

    // SEGUNDA PASADA: actualizar relaciones solo en colecciones cíclicas
    for (const uid of ciclicos) {
        const registros = dataPorColeccion.get(uid);
        if (!registros) continue;

        console.log(`🔁 Segunda pasada (actualizando relaciones) en ${uid}`);

        for (const item of registros) {
            const oldId = item.id;
            const nuevoId = idMap.get(uid)?.get(oldId);
            if (!nuevoId) continue;

            const sinId = limpiarIds(item);
            const relacionesActualizadas = await traducirRelacionesGenerico(strapi, uid, sinId, idMap);

            try {
                await strapi.entityService.update(uid, nuevoId, { data: relacionesActualizadas });
                console.log(`  🔄 Relaciones actualizadas para ID ${nuevoId}`);
            } catch (err) {
                console.error(`  ⚠️ Error al actualizar ${uid} ID ${nuevoId}:`, err);
            }
        }
    }

    console.log('🎉 Restauración e integridad completa.');
}

function limpiarIds(obj: any): any {
    if (Array.isArray(obj)) return obj.map(limpiarIds);
    if (obj && typeof obj === 'object') {
        const nuevo: any = {};
        for (const clave in obj) {
            if (clave === 'id') continue;
            nuevo[clave] = limpiarIds(obj[clave]);
        }
        return nuevo;
    }
    return obj;
}

function eliminarRelaciones(uid: string, data: any, strapi: any): any {
    const model = strapi.contentTypes[uid];
    if (!model) return data;

    const limpio = { ...data };
    for (const key in model.attributes) {
        const attr = model.attributes[key];
        if (attr.type === 'relation') {
            delete limpio[key];
        }
    }
    return limpio;
}

async function traducirRelacionesGenerico(
    strapi: any,
    uid: string,
    data: any,
    idMap: Map<string, Map<number, number>>
): Promise<any> {
    const model = strapi.contentTypes[uid];
    if (!model) return data;

    const resultado: any = { ...data };

    for (const key in model.attributes) {
        const attr = model.attributes[key];
        const tipo = attr.type;
        const relacion = attr.relation;
        const targetUid = attr.target;

        if (tipo === 'relation' && targetUid) {
            const valor = data[key];

            if (['manyToMany', 'oneToMany', 'manyToOne'].includes(relacion)) {
                if (Array.isArray(valor)) {
                    resultado[key] = valor
                        .map((rel: any) => idMap.get(targetUid)?.get(rel.id))
                        .filter((id): id is number => typeof id === 'number');
                } else if (valor?.id) {
                    resultado[key] = idMap.get(targetUid)?.get(valor.id) ?? null;
                }
            }

            if (relacion === 'oneToOne') {
                resultado[key] = valor?.id
                    ? idMap.get(targetUid)?.get(valor.id) ?? null
                    : null;
            }
        }
    }

    return resultado;
}
