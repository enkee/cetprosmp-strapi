"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarMenuCarreras = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function generarMenuCarreras(strapi) {
    const nombreArchivo = 'carreras.json';
    const rutaBase = process.env.RUTA_BASE_JSON;
    const rutaAbsoluta = path_1.default.resolve(__dirname, rutaBase, nombreArchivo);
    // Obtener módulos con su carrera > act-economica > especialidad
    const modulos = await strapi.entityService.findMany('api::modulo.modulo', {
        fields: ['id', 'titulo-comercial', 'horas', 'activo'],
        populate: {
            carrera: {
                fields: ['id', 'titulo-comercial', 'codigo', 'duracion'],
                populate: {
                    'act-economica': {
                        populate: {
                            especialidad: {
                                fields: ['id', 'titulo-comercial'],
                            },
                        },
                    },
                },
            },
        },
        filters: {
            activo: true,
        },
    });
    // Agrupar en estructura especialidad > carrera > módulos
    const estructura = {};
    for (const mod of modulos) {
        const carrera = mod.carrera;
        const actividad = carrera === null || carrera === void 0 ? void 0 : carrera['act-economica'];
        const especialidad = actividad === null || actividad === void 0 ? void 0 : actividad.especialidad;
        if (!(especialidad === null || especialidad === void 0 ? void 0 : especialidad.id) || !(carrera === null || carrera === void 0 ? void 0 : carrera.id))
            continue;
        if (!estructura[especialidad.id]) {
            estructura[especialidad.id] = {
                id: especialidad.id,
                tituloComercial: especialidad['titulo-comercial'],
                carreras: {},
            };
        }
        if (!estructura[especialidad.id].carreras[carrera.id]) {
            estructura[especialidad.id].carreras[carrera.id] = {
                id: carrera.id,
                tituloComercial: carrera['titulo-comercial'],
                codigo: carrera.codigo,
                duracion: carrera.duracion,
                modulos: [],
            };
        }
        estructura[especialidad.id].carreras[carrera.id].modulos.push({
            id: mod.id,
            tituloComercial: mod['titulo-comercial'],
            horas: mod.horas,
            activo: mod.activo,
        });
    }
    // Convertir a array ordenado
    const data = Object.values(estructura).map((esp) => ({
        id: esp.id,
        tituloComercial: esp.tituloComercial,
        carreras: Object.values(esp.carreras).map((car) => ({
            id: car.id,
            tituloComercial: car.tituloComercial,
            codigo: car.codigo,
            duracion: car.duracion,
            modulos: car.modulos.sort((a, b) => a.tituloComercial.localeCompare(b.tituloComercial)),
        })),
    }));
    const nuevoContenido = JSON.stringify(data, null, 2);
    try {
        if (fs_1.default.existsSync(rutaAbsoluta)) {
            const contenidoActual = fs_1.default.readFileSync(rutaAbsoluta, 'utf-8');
            if (contenidoActual === nuevoContenido) {
                strapi.log.info(`ℹ️ Sin cambios en ${nombreArchivo}.`);
                return;
            }
        }
        fs_1.default.mkdirSync(path_1.default.dirname(rutaAbsoluta), { recursive: true });
        fs_1.default.writeFileSync(rutaAbsoluta, nuevoContenido, 'utf-8');
        strapi.log.info(`✅ ${nombreArchivo} actualizado correctamente.`);
    }
    catch (error) {
        strapi.log.error(`❌ Error al guardar ${nombreArchivo}: ${error}`);
    }
}
exports.generarMenuCarreras = generarMenuCarreras;
