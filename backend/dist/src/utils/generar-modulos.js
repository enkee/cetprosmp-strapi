"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarModulos = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function generarModulos(strapi) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const nombreArchivo = 'modulos.json';
    const rutaBase = process.env.RUTA_BASE_JSON;
    const rutaAbsoluta = path_1.default.resolve(__dirname, rutaBase, nombreArchivo);
    const modulos = await strapi.entityService.findMany('api::modulo.modulo', {
        fields: [
            'id',
            'titulo',
            'titulo-comercial',
            'orden',
            'descripcion2',
            'horas',
            'creditos',
            'metas',
            'slug',
            'activo',
        ],
        populate: {
            imagen: { fields: ['url'] },
            imagenes: {
                fields: ['url', 'alternativeText', 'caption', 'width', 'height', 'mime'],
            },
            carrera: {
                fields: ['id', 'titulo-comercial', 'slug', 'codigo'], // 👈 se añade 'codigo'
            },
            videosYoutube: true,
        },
        filters: {
            activo: true,
        },
    });
    const baseUrl = ((_a = process.env.STRAPI_PUBLIC_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '')) || '';
    const estructura = {};
    for (const mod of modulos) {
        const carrera = mod.carrera;
        if (!(carrera === null || carrera === void 0 ? void 0 : carrera.id))
            continue;
        const carId = carrera.id;
        if (!estructura[carId]) {
            estructura[carId] = {
                id: carId,
                tituloComercial: carrera['titulo-comercial'],
                slug: (_b = carrera.slug) !== null && _b !== void 0 ? _b : '',
                codigo: (_c = carrera.codigo) !== null && _c !== void 0 ? _c : '', // 👈 se agrega aquí
                modulos: [],
            };
        }
        estructura[carId].modulos.push({
            id: mod.id,
            titulo: mod.titulo,
            tituloComercial: mod['titulo-comercial'],
            orden: (_d = mod.orden) !== null && _d !== void 0 ? _d : 0,
            descripcion2: (_e = mod.descripcion2) !== null && _e !== void 0 ? _e : [],
            horas: (_f = mod.horas) !== null && _f !== void 0 ? _f : 0,
            creditos: (_g = mod.creditos) !== null && _g !== void 0 ? _g : 0,
            metas: (_h = mod.metas) !== null && _h !== void 0 ? _h : 15,
            slug: (_j = mod.slug) !== null && _j !== void 0 ? _j : '',
            activo: (_k = mod.activo) !== null && _k !== void 0 ? _k : true,
            imagen: ((_l = mod.imagen) === null || _l === void 0 ? void 0 : _l.url) ? `${baseUrl}${mod.imagen.url}` : null,
            imagenes: ((_m = mod.imagenes) !== null && _m !== void 0 ? _m : []).map((img) => {
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
            videosYoutube: ((_o = mod.videosYoutube) !== null && _o !== void 0 ? _o : []).map((vid) => ({
                url: vid.url,
            })),
        });
    }
    // Ordenar módulos por ID dentro de cada carrera
    for (const car of Object.values(estructura)) {
        car.modulos.sort((a, b) => a.id - b.id);
    }
    // Ordenar carreras por ID
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
exports.generarModulos = generarModulos;
