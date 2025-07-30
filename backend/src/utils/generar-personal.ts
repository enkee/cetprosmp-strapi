import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export async function generarPersonal(strapi: any) {
    const nombreArchivo = 'personal.json';
    const rutaBase = process.env.RUTA_BASE_JSON!;
    const rutaAbsoluta = path.resolve(__dirname, rutaBase, nombreArchivo);

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

    const baseUrl = process.env.STRAPI_PUBLIC_URL?.replace(/\/$/, '') || '';

    const data = personales.map((p: any) => {
        const u = p.user ?? {};
        const foto = u.foto ? `${baseUrl}${u.foto.url}` : null;

        return {
            id: p.id,
            displayName: p.display_name,
            memo: p.memo ?? '',
            user: {
                id: u.id ?? null,
                nombre: u.nombre ?? '',
                apellidoPaterno: u.apellido_paterno ?? '',
                apellidoMaterno: u.apellido_materno ?? '',
                apellidos: u.apellidos ?? '',
                dni: u.dni ?? '',
                celular: u.celular ?? '',
                email: u.email ?? '',
                avatar: u.avatar ?? '',
                sexo: u.sexo ?? '',
                fechaNacimiento: u.fecha_nacimiento ?? '',
                direccion: u.direccion ?? '',
                distrito: u.distrito ?? '',
                estadoCivil: u.estado_civil ?? '',
                instruccion: u.instruccion ?? '',
                foto: foto
            },
            especialidades: (p.especialidad ?? []).map((esp: any) => ({
                id: esp.id,
                tituloComercial: esp['titulo-comercial'],
                slug: esp.slug
            }))
        };
    });

    const nuevoContenido = JSON.stringify(data, null, 2);

    try {
        if (fs.existsSync(rutaAbsoluta)) {
            const contenidoActual = fs.readFileSync(rutaAbsoluta, 'utf-8');
            if (contenidoActual === nuevoContenido) {
                strapi.log.info(`ℹ️ Sin cambios en ${nombreArchivo}.`);
                return;
            }
        }

        fs.mkdirSync(path.dirname(rutaAbsoluta), { recursive: true });
        fs.writeFileSync(rutaAbsoluta, nuevoContenido, 'utf-8');
        strapi.log.info(`✅ ${nombreArchivo} actualizado correctamente.`);
    } catch (error) {
        strapi.log.error(`❌ Error al guardar ${nombreArchivo}: ${error}`);
    }
}
