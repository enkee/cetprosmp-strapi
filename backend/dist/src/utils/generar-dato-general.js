"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarDatoGeneral = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function generarDatoGeneral(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    const nombreArchivo = 'dato-general.json';
    const rutaBase = process.env.RUTA_BASE_JSON;
    const rutaAbsoluta = path_1.default.resolve(__dirname, rutaBase, nombreArchivo);
    const baseUrl = ((_a = process.env.STRAPI_PUBLIC_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '')) || '';
    // Preparamos solo los campos necesarios manualmente
    const resultado = {
        nombreInstitucion: (_b = data.nombreInstitucion) !== null && _b !== void 0 ? _b : '',
        direccion: (_c = data.direccion) !== null && _c !== void 0 ? _c : '',
        telefono1: (_d = data.telefono1) !== null && _d !== void 0 ? _d : '',
        telefono2: (_e = data.telefono2) !== null && _e !== void 0 ? _e : '',
        correo: (_f = data.correo) !== null && _f !== void 0 ? _f : '',
        mapa: (_g = data.mapa) !== null && _g !== void 0 ? _g : '',
        paginaWeb: (_h = data.paginaWeb) !== null && _h !== void 0 ? _h : '',
        facebook: (_j = data.facebook) !== null && _j !== void 0 ? _j : '',
        youtube: (_k = data.youtube) !== null && _k !== void 0 ? _k : '',
        twitter: (_l = data.twitter) !== null && _l !== void 0 ? _l : '',
        instagram: (_m = data.instagram) !== null && _m !== void 0 ? _m : '',
        tiktok: (_o = data.tiktok) !== null && _o !== void 0 ? _o : '',
        ruc: (_p = data.ruc) !== null && _p !== void 0 ? _p : '',
        rd: (_q = data.rd) !== null && _q !== void 0 ? _q : '',
        logo: ((_r = data.logo) === null || _r === void 0 ? void 0 : _r.url)
            ? {
                url: `${baseUrl}${data.logo.url}`,
                alternativeText: (_s = data.logo.alternativeText) !== null && _s !== void 0 ? _s : '',
                width: (_t = data.logo.width) !== null && _t !== void 0 ? _t : null,
                height: (_u = data.logo.height) !== null && _u !== void 0 ? _u : null,
                mime: (_v = data.logo.mime) !== null && _v !== void 0 ? _v : '',
            }
            : null,
    };
    const nuevoContenido = JSON.stringify(resultado, null, 2);
    try {
        fs_1.default.mkdirSync(path_1.default.dirname(rutaAbsoluta), { recursive: true });
        fs_1.default.writeFileSync(rutaAbsoluta, nuevoContenido, 'utf-8');
        console.log(`✅ ${nombreArchivo} generado correctamente sin campos extras.`);
    }
    catch (error) {
        console.error(`❌ Error al guardar ${nombreArchivo}: ${error}`);
    }
}
exports.generarDatoGeneral = generarDatoGeneral;
