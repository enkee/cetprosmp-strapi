"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarCarreras = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function generarCarreras(strapi) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const nombreArchivo = 'carreras.json';
    const rutaBase = process.env.RUTA_BASE_JSON;
    const rutaAbsoluta = path_1.default.resolve(__dirname, rutaBase, nombreArchivo);
    const carreras = await strapi.entityService.findMany('api::carrera.carrera', {
        fields: [
            'id',
            'titulo',
            'titulo-comercial',
            'codigo',
            'duracion',
            'creditos',
            'nivel',
            'slug',
            'descripcion2', // 👉 campo nuevo tipo blocks
        ],
        populate: {
            imagen: { fields: ['url'] },
            imagenes: { fields: ['url', 'alternativeText', 'caption', 'width', 'height', 'mime'] },
            'act-economica': {
                fields: ['id'],
                populate: {
                    especialidad: {
                        fields: ['id', 'titulo-comercial', 'slug'],
                    },
                },
            },
        },
    });
    const baseUrl = ((_a = process.env.STRAPI_PUBLIC_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '')) || '';
    const estructura = {};
    for (const car of carreras) {
        const especialidad = (_b = car['act-economica']) === null || _b === void 0 ? void 0 : _b.especialidad;
        if (!(especialidad === null || especialidad === void 0 ? void 0 : especialidad.id))
            continue;
        const espId = especialidad.id;
        if (!estructura[espId]) {
            estructura[espId] = {
                id: espId,
                tituloComercial: especialidad['titulo-comercial'],
                slug: (_c = especialidad.slug) !== null && _c !== void 0 ? _c : '',
                carreras: [],
            };
        }
        estructura[espId].carreras.push({
            id: car.id,
            titulo: car.titulo,
            tituloComercial: car['titulo-comercial'],
            codigo: (_d = car.codigo) !== null && _d !== void 0 ? _d : '',
            descripcion2: (_e = car.descripcion2) !== null && _e !== void 0 ? _e : [], // 👈 blocks de tipo texto enriquecido
            duracion: (_f = car.duracion) !== null && _f !== void 0 ? _f : 0,
            creditos: (_g = car.creditos) !== null && _g !== void 0 ? _g : 0,
            nivel: (_h = car.nivel) !== null && _h !== void 0 ? _h : '',
            slug: (_j = car.slug) !== null && _j !== void 0 ? _j : '',
            imagen: ((_k = car.imagen) === null || _k === void 0 ? void 0 : _k.url) ? `${baseUrl}${car.imagen.url}` : null,
            imagenes: ((_l = car.imagenes) !== null && _l !== void 0 ? _l : []).map((img) => {
                var _a, _b, _c, _d, _e;
                return ({
                    url: `${baseUrl}${img.url}`,
                    alternativeText: (_a = img.alternativeText) !== null && _a !== void 0 ? _a : '',
                    caption: (_b = img.caption) !== null && _b !== void 0 ? _b : '',
                    width: (_c = img.width) !== null && _c !== void 0 ? _c : null,
                    height: (_d = img.height) !== null && _d !== void 0 ? _d : null,
                    mime: (_e = img.mime) !== null && _e !== void 0 ? _e : '',
                });
            }),
        });
    }
    // Ordenar carreras por ID dentro de cada especialidad
    for (const esp of Object.values(estructura)) {
        esp.carreras.sort((a, b) => a.id - b.id);
    }
    // Ordenar especialidades por ID
    const data = Object.values(estructura).sort((a, b) => a.id - b.id);
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
exports.generarCarreras = generarCarreras;
