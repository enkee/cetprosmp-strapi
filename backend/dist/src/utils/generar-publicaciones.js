"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarPublicaciones = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function generarPublicaciones(strapi) {
    var _a;
    const nombreArchivo = 'publicaciones.json';
    const rutaBase = process.env.RUTA_BASE_JSON;
    const rutaAbsoluta = path_1.default.resolve(__dirname, rutaBase, nombreArchivo);
    const publicaciones = await strapi.entityService.findMany('api::publicacion.publicacion', {
        fields: [
            'id',
            'titulo',
            'slug',
            'tipo',
            'descripcionCorta',
            'contenido',
            'contenido2',
            'fechaPublicacion',
            'fechaEventoInicio',
            'fechaEventoFin',
            'ubicacion',
            'destacado'
        ],
        populate: {
            imagenPrincipal: { fields: ['url'] },
            galeria: { fields: ['url'] },
            videosYoutube: true,
        },
        sort: { fechaPublicacion: 'desc' }
    });
    const baseUrl = ((_a = process.env.STRAPI_PUBLIC_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '')) || '';
    const data = publicaciones.map((pub) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return ({
            id: pub.id,
            titulo: pub.titulo,
            slug: (_a = pub.slug) !== null && _a !== void 0 ? _a : '',
            tipo: pub.tipo,
            descripcionCorta: (_b = pub.descripcionCorta) !== null && _b !== void 0 ? _b : '',
            contenido: (_c = pub.contenido) !== null && _c !== void 0 ? _c : '',
            contenido2: (_d = pub.contenido2) !== null && _d !== void 0 ? _d : '',
            fechaPublicacion: (_e = pub.fechaPublicacion) !== null && _e !== void 0 ? _e : null,
            fechaEventoInicio: (_f = pub.fechaEventoInicio) !== null && _f !== void 0 ? _f : null,
            fechaEventoFin: (_g = pub.fechaEventoFin) !== null && _g !== void 0 ? _g : null,
            ubicacion: (_h = pub.ubicacion) !== null && _h !== void 0 ? _h : '',
            destacado: (_j = pub.destacado) !== null && _j !== void 0 ? _j : false,
            imagenPrincipal: ((_k = pub.imagenPrincipal) === null || _k === void 0 ? void 0 : _k.url) ? `${baseUrl}${pub.imagenPrincipal.url}` : null,
            galeria: ((_l = pub.galeria) !== null && _l !== void 0 ? _l : []).map((img) => `${baseUrl}${img.url}`),
            videosYoutube: ((_m = pub.videosYoutube) !== null && _m !== void 0 ? _m : []).map((v) => ({
                id: v.id,
                url: v.url
            })),
        });
    });
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
exports.generarPublicaciones = generarPublicaciones;
