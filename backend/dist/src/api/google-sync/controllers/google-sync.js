"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 📦 Importa la función de servicio que sincroniza los datos del usuario desde Google Workspace
const google_sync_1 = require("../services/google-sync");
// 🔐 Importa la librería para generar tokens JWT
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 📁 Exporta un objeto controlador que contiene la función sync para manejar peticiones
exports.default = {
    // 🚀 Función asíncrona que sincroniza un usuario institucional desde su correo
    async sync(ctx) {
        // 📥 Extrae el correo enviado en el body de la petición
        const { email } = ctx.request.body;
        // ❌ Si no se proporciona un correo, lanza un error 400 (Bad Request)
        if (!email) {
            ctx.throw(400, 'Falta el correo institucional');
        }
        try {
            // 🔄 Llama al servicio para obtener o actualizar el usuario en la base de datos
            const datos = await (0, google_sync_1.sincronizarUsuarioPorCorreo)(email);
            // 🔐 Genera un token JWT con los datos mínimos del usuario
            const token = jsonwebtoken_1.default.sign({
                id: datos.email, // Puedes cambiar esto por el ID real del usuario si lo deseas
                email: datos.email,
                nombre: `${datos.nombre} ${datos.apellidos}`, // Nombre completo para mostrar
            }, process.env.JWT_SECRET, // 🔑 Clave secreta definida en el archivo .env
            { expiresIn: '180d' } // ⏳ Token válido por 180 días (6 meses)
            );
            // ✅ Devuelve al frontend los datos del usuario y el token generado
            ctx.body = {
                user: datos,
                token, // Token alineado con lo que el frontend espera recibir
            };
        }
        catch (error) {
            // ❌ Registra el error en los logs del servidor Strapi
            strapi.log.error('❌ Error en el controlador google-sync:', error.message);
            // ⛔ Devuelve error 500 si ocurre algún fallo interno
            ctx.throw(500, 'Error interno al sincronizar el usuario');
        }
    },
};
