"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importarBackup = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ordenar_por_dependencias_1 = require("./ordenar-por-dependencias");
/**
 * Restaura los datos de los archivos JSON exportados, en orden correcto según sus relaciones.
 * Hace una segunda pasada sobre colecciones cíclicas para actualizar relaciones.
 */
async function importarBackup(strapi) {
    var _a, _b;
    const { orden, ciclicos } = (0, ordenar_por_dependencias_1.ordenarColeccionesPorDependencias)(strapi);
    const backupDir = path_1.default.resolve('public', 'backups');
    const idMap = new Map(); // uid → { oldId → newId }
    const dataPorColeccion = new Map(); // uid → datos originales sin id
    // PRIMERA PASADA: crear todos los registros
    for (const uid of orden) {
        const nombreArchivo = uid.split('.')[1] + '.json';
        const ruta = path_1.default.join(backupDir, nombreArchivo);
        if (!fs_1.default.existsSync(ruta)) {
            console.warn(`⚠️ Archivo no encontrado: ${ruta}`);
            continue;
        }
        const raw = fs_1.default.readFileSync(ruta, 'utf-8');
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
                (_a = idMap.get(uid)) === null || _a === void 0 ? void 0 : _a.set(oldId, nuevo.id);
                console.log(`  ✅ ${oldId} → ${nuevo.id}`);
            }
            catch (err) {
                console.error(`  ❌ Error al insertar en ${uid}:`, err);
            }
        }
    }
    // SEGUNDA PASADA: actualizar relaciones solo en colecciones cíclicas
    for (const uid of ciclicos) {
        const registros = dataPorColeccion.get(uid);
        if (!registros)
            continue;
        console.log(`🔁 Segunda pasada (actualizando relaciones) en ${uid}`);
        for (const item of registros) {
            const oldId = item.id;
            const nuevoId = (_b = idMap.get(uid)) === null || _b === void 0 ? void 0 : _b.get(oldId);
            if (!nuevoId)
                continue;
            const sinId = limpiarIds(item);
            const relacionesActualizadas = await traducirRelacionesGenerico(strapi, uid, sinId, idMap);
            try {
                await strapi.entityService.update(uid, nuevoId, { data: relacionesActualizadas });
                console.log(`  🔄 Relaciones actualizadas para ID ${nuevoId}`);
            }
            catch (err) {
                console.error(`  ⚠️ Error al actualizar ${uid} ID ${nuevoId}:`, err);
            }
        }
    }
    console.log('🎉 Restauración e integridad completa.');
}
exports.importarBackup = importarBackup;
function limpiarIds(obj) {
    if (Array.isArray(obj))
        return obj.map(limpiarIds);
    if (obj && typeof obj === 'object') {
        const nuevo = {};
        for (const clave in obj) {
            if (clave === 'id')
                continue;
            nuevo[clave] = limpiarIds(obj[clave]);
        }
        return nuevo;
    }
    return obj;
}
function eliminarRelaciones(uid, data, strapi) {
    const model = strapi.contentTypes[uid];
    if (!model)
        return data;
    const limpio = { ...data };
    for (const key in model.attributes) {
        const attr = model.attributes[key];
        if (attr.type === 'relation') {
            delete limpio[key];
        }
    }
    return limpio;
}
async function traducirRelacionesGenerico(strapi, uid, data, idMap) {
    var _a, _b, _c, _d;
    const model = strapi.contentTypes[uid];
    if (!model)
        return data;
    const resultado = { ...data };
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
                        .map((rel) => { var _a; return (_a = idMap.get(targetUid)) === null || _a === void 0 ? void 0 : _a.get(rel.id); })
                        .filter((id) => typeof id === 'number');
                }
                else if (valor === null || valor === void 0 ? void 0 : valor.id) {
                    resultado[key] = (_b = (_a = idMap.get(targetUid)) === null || _a === void 0 ? void 0 : _a.get(valor.id)) !== null && _b !== void 0 ? _b : null;
                }
            }
            if (relacion === 'oneToOne') {
                resultado[key] = (valor === null || valor === void 0 ? void 0 : valor.id)
                    ? (_d = (_c = idMap.get(targetUid)) === null || _c === void 0 ? void 0 : _c.get(valor.id)) !== null && _d !== void 0 ? _d : null
                    : null;
            }
        }
    }
    return resultado;
}
