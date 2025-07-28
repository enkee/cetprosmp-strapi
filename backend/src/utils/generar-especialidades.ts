import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export async function generarEspecialidades(strapi: any) {
    const nombreArchivo = 'especialidades.json';
    const rutaBase = process.env.RUTA_BASE_JSON!;
    const rutaAbsoluta = path.resolve(__dirname, rutaBase, nombreArchivo);

    const especialidades = await strapi.entityService.findMany('api::especialidad.especialidad', {
        fields: ['id', 'titulo', 'titulo-comercial', 'slug', 'descripcion2'], // 👈 incluye 'slug'
        populate: {
            imagen: { fields: ['url'] },
            imagenes: { fields: ['url'] },
        },
    });

    const baseUrl = process.env.STRAPI_PUBLIC_URL?.replace(/\/$/, '') || '';

    const data = especialidades.map((esp: any) => ({
        id: esp.id,
        titulo: esp.titulo,
        tituloComercial: esp['titulo-comercial'],
        slug: esp.slug ?? '', // 👈 slug seguro para rutas frontend
        descripcion2: esp.descripcion2 ?? [],
        imagen: esp.imagen?.url ? `${baseUrl}${esp.imagen.url}` : null,
        imagenes: (esp.imagenes ?? []).map((img: any) => `${baseUrl}${img.url}`),
    }));

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
