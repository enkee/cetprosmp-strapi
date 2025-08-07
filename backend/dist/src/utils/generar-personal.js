"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarPersonal = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function generarPersonal(strapi) {
    var _a;
    const nombreArchivo = 'personal.json';
    const rutaBase = process.env.RUTA_BASE_JSON;
    const rutaAbsoluta = path_1.default.resolve(__dirname, rutaBase, nombreArchivo);
    const personales = await strapi.entityService.findMany('api::personal.personal', {
        fields: ['id', 'display_name', 'memo'],
        populate: {
            user: {
                fields: [
                    'id',
                    'nombre',
                    'apellido_paterno',
                    'apellido_materno',
                    'apellidos',
                    'dni',
                    'celular',
                    'email',
                    'avatar',
                    'sexo',
                    'fecha_nacimiento',
                    'direccion',
                    'distrito',
                    'estado_civil',
                    'instruccion'
                ],
                populate: {
                    foto: { fields: ['url', 'alternativeText', 'width', 'height', 'mime'] }
                }
            },
            especialidad: {
                fields: ['id', 'titulo-comercial', 'slug']
            }
        }
    });
    const baseUrl = ((_a = process.env.STRAPI_PUBLIC_URL) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '')) || '';
    const data = personales.map((p) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const u = (_a = p.user) !== null && _a !== void 0 ? _a : {};
        const foto = u.foto ? `${baseUrl}${u.foto.url}` : null;
        return {
            id: p.id,
            displayName: p.display_name,
            memo: (_b = p.memo) !== null && _b !== void 0 ? _b : '',
            user: {
                id: (_c = u.id) !== null && _c !== void 0 ? _c : null,
                nombre: (_d = u.nombre) !== null && _d !== void 0 ? _d : '',
                apellidoPaterno: (_e = u.apellido_paterno) !== null && _e !== void 0 ? _e : '',
                apellidoMaterno: (_f = u.apellido_materno) !== null && _f !== void 0 ? _f : '',
                apellidos: (_g = u.apellidos) !== null && _g !== void 0 ? _g : '',
                dni: (_h = u.dni) !== null && _h !== void 0 ? _h : '',
                celular: (_j = u.celular) !== null && _j !== void 0 ? _j : '',
                email: (_k = u.email) !== null && _k !== void 0 ? _k : '',
                avatar: (_l = u.avatar) !== null && _l !== void 0 ? _l : '',
                sexo: (_m = u.sexo) !== null && _m !== void 0 ? _m : '',
                fechaNacimiento: (_o = u.fecha_nacimiento) !== null && _o !== void 0 ? _o : '',
                direccion: (_p = u.direccion) !== null && _p !== void 0 ? _p : '',
                distrito: (_q = u.distrito) !== null && _q !== void 0 ? _q : '',
                estadoCivil: (_r = u.estado_civil) !== null && _r !== void 0 ? _r : '',
                instruccion: (_s = u.instruccion) !== null && _s !== void 0 ? _s : '',
                foto: foto
            },
            especialidades: ((_t = p.especialidad) !== null && _t !== void 0 ? _t : []).map((esp) => ({
                id: esp.id,
                tituloComercial: esp['titulo-comercial'],
                slug: esp.slug
            }))
        };
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
exports.generarPersonal = generarPersonal;
