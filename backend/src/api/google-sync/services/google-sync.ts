// 📦 Importa el SDK de Google y el cliente de autenticación OAuth2
import { google, admin_directory_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// 🔐 Librería para generar tokens JWT
import jwt from 'jsonwebtoken';

// 📁 Módulos nativos de Node.js para manipular archivos y rutas
import fs from 'fs';
import path from 'path';

// 🔧 Función principal que sincroniza un usuario usando su correo institucional
export async function sincronizarUsuarioPorCorreo(correo: string) {
    try {
        // 🔑 Obtiene las credenciales de autenticación desde las variables de entorno
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
        const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
        const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
        const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;
        const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto';

        // 🔐 Inicializa el cliente OAuth2 con las credenciales
        const oAuth2Client: OAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        // 🛠 Inicializa el cliente de Admin SDK Directory API
        const admin: admin_directory_v1.Admin = google.admin({
            version: 'directory_v1',
            auth: oAuth2Client,
        });

        // 📡 Solicita los datos completos del usuario desde Google Workspace
        const res = await admin.users.get({ userKey: correo, projection: 'full' });
        const userData = res.data;

        // 💾 Guarda una copia local del JSON recibido, útil para depuración
        const tmpDir = path.resolve(__dirname, '../../../../public/tmp');
        fs.mkdirSync(tmpDir, { recursive: true }); // crea la carpeta si no existe
        const filePath = path.join(tmpDir, 'userData.json');
        fs.writeFileSync(filePath, JSON.stringify(res.data, null, 2), 'utf-8');
        console.log(`✅ Archivo guardado en ${filePath}`);

        // 🚨 Si el usuario no tiene correo principal, detiene el proceso
        if (!userData || !userData.primaryEmail) {
            throw new Error('Usuario no encontrado en el Admin SDK.');
        }

        // 📋 Extrae los datos relevantes del usuario
        const nombreCompleto = userData.name?.fullName || '';
        const nombre = userData.name?.givenName || '';
        const apellidos = userData.name?.familyName || '';
        const avatar = userData.thumbnailPhotoUrl || '';
        const celular = userData.phones?.[0]?.value || '';
        const direccion = userData.addresses?.[0]?.formatted || '';
        const dni = userData.primaryEmail.substring(0, 8);
        const estudios = userData.organizations?.[0]?.title || '';

        // 🧩 Extrae campos personalizados definidos en el esquema adicional
        const estado_civil = (userData?.customSchemas?.Datos_personales as any)?.Estado_Civil || '';
        const instruccion = (userData?.customSchemas?.Datos_personales as any)?.Grado_Instruccion || '';
        const fecha_nacimiento = (userData?.customSchemas?.Datos_personales as any)?.Fecha_Nacimiento || null;

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
        } else {
            await strapi.db.query('plugin::users-permissions.user').create({ data });
        }

        // 🔐 Genera un token JWT personalizado que durará 1 hora
        const token = jwt.sign(
            {
                email: data.email,
                nombre: data.nombre,
                apellidos: data.apellidos,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ✅ Devuelve los datos del usuario y el JWT al frontend
        return {
            ok: true,
            ...data,
            jwt: token,
        };
    } catch (error: any) {
        // ❌ Captura errores y los registra en el log del servidor
        strapi.log.error('❌ Error en el servicio google-sync (detalle):');
        strapi.log.error(error);
        throw new Error(`Fallo en sincronizarUsuarioPorCorreo: ${error.message}`);
    }
}
