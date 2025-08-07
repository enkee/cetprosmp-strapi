"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarEspecialidades = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function generarEspecialidades(strapi) {
    var _a;
    const nombreArchivo = 'especialidades.json';
    const rutaBase = process.env.RUTA_BASE_JSON;
    const rutaAbsoluta = path_1.default.resolve(__dirname, rutaBase, nombreArchivo);
    const especialidades = await strapi.entityService.findMany('api::especialidad.especialidad', {
        fields: ['id', 'titulo', 'titulo-comercial', 'slug', 'descripcion2'], // 👈 incluye 'slug'
        populate: {
            imagen: { fields: ['url'] },
            imagenes: { fields: ['url'] },
        },
    });
    const baseUrl = ((_a = process.env.STRAPI_PUBLIC_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '')) || '';
    const data = especialidades.map((esp) => {
        var _a, _b, _c, _d;
        return ({
            id: esp.id,
            titulo: esp.titulo,
            tituloComercial: esp['titulo-comercial'],
            slug: (_a = esp.slug) !== null && _a !== void 0 ? _a : '', // 👈 slug seguro para rutas frontend
            descripcion2: (_b = esp.descripcion2) !== null && _b !== void 0 ? _b : [],
            imagen: ((_c = esp.imagen) === null || _c === void 0 ? void 0 : _c.url) ? `${baseUrl}${esp.imagen.url}` : null,
            imagenes: ((_d = esp.imagenes) !== null && _d !== void 0 ? _d : []).map((img) => `${baseUrl}${img.url}`),
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
exports.generarEspecialidades = generarEspecialidades;
