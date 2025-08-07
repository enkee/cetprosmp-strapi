"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarCarruselPortada = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function generarCarruselPortada(strapi) {
    var _a, _b, _c, _d, _e, _f, _g;
    const nombreArchivo = 'carrusel.json';
    const rutaBase = process.env.RUTA_BASE_JSON;
    const rutaAbsoluta = path_1.default.resolve(__dirname, rutaBase, nombreArchivo);
    const modulos = await strapi.entityService.findMany('api::modulo.modulo', {
        fields: ['id', 'titulo-comercial', 'horas', 'activo', 'slug'], // ✅ agregar slug de módulo
        populate: {
            carrera: {
                fields: ['id', 'titulo-comercial', 'codigo', 'duracion', 'slug'], // ✅ agregar slug de carrera
                populate: {
                    'act-economica': {
                        populate: {
                            especialidad: {
                                fields: ['id', 'titulo-comercial', 'slug'],
                                populate: {
                                    imagen: { fields: ['url'] },
                                    imagenes: { fields: ['url'] },
                                },
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
    const estructura = {};
    for (const mod of modulos) {
        const carrera = mod.carrera;
        const actividad = carrera === null || carrera === void 0 ? void 0 : carrera['act-economica'];
        const especialidad = actividad === null || actividad === void 0 ? void 0 : actividad.especialidad;
        if (!(especialidad === null || especialidad === void 0 ? void 0 : especialidad.id) || !(carrera === null || carrera === void 0 ? void 0 : carrera.id))
            continue;
        const baseUrl = ((_a = process.env.STRAPI_PUBLIC_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '')) || '';
        const fondo = ((_b = especialidad.imagen) === null || _b === void 0 ? void 0 : _b.url) ? `${baseUrl}${especialidad.imagen.url}` : null;
        const portada = ((_d = (_c = especialidad.imagenes) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.url) ? `${baseUrl}${especialidad.imagenes[0].url}` : null;
        if (!estructura[especialidad.id]) {
            estructura[especialidad.id] = {
                id: especialidad.id,
                tituloComercial: especialidad['titulo-comercial'],
                slug: (_e = especialidad.slug) !== null && _e !== void 0 ? _e : '',
                fondo,
                portada,
                carreras: {},
            };
        }
        if (!estructura[especialidad.id].carreras[carrera.id]) {
            estructura[especialidad.id].carreras[carrera.id] = {
                id: carrera.id,
                tituloComercial: carrera['titulo-comercial'],
                slug: (_f = carrera.slug) !== null && _f !== void 0 ? _f : '', // ✅ agregar slug
                codigo: carrera.codigo,
                duracion: carrera.duracion,
                modulos: [],
            };
        }
        estructura[especialidad.id].carreras[carrera.id].modulos.push({
            id: mod.id,
            tituloComercial: mod['titulo-comercial'],
            slug: (_g = mod.slug) !== null && _g !== void 0 ? _g : '', // ✅ agregar slug
            horas: mod.horas,
            activo: mod.activo,
        });
    }
    const data = Object.values(estructura).map((esp) => ({
        id: esp.id,
        tituloComercial: esp.tituloComercial,
        slug: esp.slug,
        fondo: esp.fondo,
        portada: esp.portada,
        carreras: Object.values(esp.carreras).map((car) => ({
            id: car.id,
            tituloComercial: car.tituloComercial,
            slug: car.slug, // ✅ incluir en output
            codigo: car.codigo,
            duracion: car.duracion,
            modulos: car.modulos
                .sort((a, b) => a.tituloComercial.localeCompare(b.tituloComercial)),
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
exports.generarCarruselPortada = generarCarruselPortada;
