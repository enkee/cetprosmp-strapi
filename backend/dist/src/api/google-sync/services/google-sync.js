"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sincronizarUsuarioPorCorreo = void 0;
// 📦 Importa el SDK de Google y el cliente de autenticación OAuth2
const googleapis_1 = require("googleapis");
// 🔐 Librería para generar tokens JWT
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 📁 Módulos nativos de Node.js para manipular archivos y rutas
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 🔧 Función principal que sincroniza un usuario usando su correo institucional
async function sincronizarUsuarioPorCorreo(correo) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    try {
        // 🔑 Obtiene las credenciales de autenticación desde las variables de entorno
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
        const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
        const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
        const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto';
        // 🔐 Inicializa el cliente OAuth2 con las credenciales
        const oAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        // 🛠 Inicializa el cliente de Admin SDK Directory API
        const admin = googleapis_1.google.admin({
            version: 'directory_v1',
            auth: oAuth2Client,
        });
        // 📡 Solicita los datos completos del usuario desde Google Workspace
        const res = await admin.users.get({ userKey: correo, projection: 'full' });
        const userData = res.data;
        // 💾 Guarda una copia local del JSON recibido, útil para depuración
        const tmpDir = path_1.default.resolve(__dirname, '../../../../public/tmp');
        fs_1.default.mkdirSync(tmpDir, { recursive: true }); // crea la carpeta si no existe
        const filePath = path_1.default.join(tmpDir, 'userData.json');
        fs_1.default.writeFileSync(filePath, JSON.stringify(res.data, null, 2), 'utf-8');
        console.log(`✅ Archivo guardado en ${filePath}`);
        // 🚨 Si el usuario no tiene correo principal, detiene el proceso
        if (!userData || !userData.primaryEmail) {
            throw new Error('Usuario no encontrado en el Admin SDK.');
        }
        // 📋 Extrae los datos relevantes del usuario
        const nombreCompleto = ((_a = userData.name) === null || _a === void 0 ? void 0 : _a.fullName) || '';
        const nombre = ((_b = userData.name) === null || _b === void 0 ? void 0 : _b.givenName) || '';
        const apellidos = ((_c = userData.name) === null || _c === void 0 ? void 0 : _c.familyName) || '';
        const avatar = userData.thumbnailPhotoUrl || '';
        const celular = ((_e = (_d = userData.phones) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.value) || '';
        const direccion = ((_g = (_f = userData.addresses) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.formatted) || '';
        const dni = userData.primaryEmail.substring(0, 8);
        const estudios = ((_j = (_h = userData.organizations) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.title) || '';
        // 🧩 Extrae campos personalizados definidos en el esquema adicional
        const estado_civil = ((_l = (_k = userData === null || userData === void 0 ? void 0 : userData.customSchemas) === null || _k === void 0 ? void 0 : _k.Datos_personales) === null || _l === void 0 ? void 0 : _l.Estado_Civil) || '';
        const instruccion = ((_o = (_m = userData === null || userData === void 0 ? void 0 : userData.customSchemas) === null || _m === void 0 ? void 0 : _m.Datos_personales) === null || _o === void 0 ? void 0 : _o.Grado_Instruccion) || '';
        const fecha_nacimiento = ((_q = (_p = userData === null || userData === void 0 ? void 0 : userData.customSchemas) === null || _p === void 0 ? void 0 : _p.Datos_personales) === null || _q === void 0 ? void 0 : _q.Fecha_Nacimiento) || null;
        // 🔎 Busca si el usuario ya existe en la base de datos (por correo)
        const existente = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { email: userData.primaryEmail },
        });
        // 📦 Arma el objeto de datos para crear o actualizar al usuario
        const data = {
            email: userData.primaryEmail,
            username: nombreCompleto,
            nombre,
            apellidos,
            dni,
            avatar,
            celular,
            direccion,
            estudios,
            estado_civil,
            instruccion,
            fecha_nacimiento,
            provider: 'google',
            confirmed: true,
        };
        // 🛠 Actualiza si ya existe, o lo crea si es nuevo
        if (existente) {
            await strapi.db.query('plugin::users-permissions.user').update({
                where: { id: existente.id },
                data,
            });
        }
        else {
            await strapi.db.query('plugin::users-permissions.user').create({ data });
        }
        // 🔐 Genera un token JWT personalizado que durará 1 hora
        const token = jsonwebtoken_1.default.sign({
            email: data.email,
            nombre: data.nombre,
            apellidos: data.apellidos,
        }, JWT_SECRET, { expiresIn: '1h' });
        // ✅ Devuelve los datos del usuario y el JWT al frontend
        return {
            ok: true,
            ...data,
            jwt: token,
        };
    }
    catch (error) {
        // ❌ Captura errores y los registra en el log del servidor
        strapi.log.error('❌ Error en el servicio google-sync (detalle):');
        strapi.log.error(error);
        throw new Error(`Fallo en sincronizarUsuarioPorCorreo: ${error.message}`);
    }
}
exports.sincronizarUsuarioPorCorreo = sincronizarUsuarioPorCorreo;
