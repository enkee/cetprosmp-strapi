import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export async function generarPublicaciones(strapi: any) {
    const nombreArchivo = 'publicaciones.json';
    const rutaBase = process.env.RUTA_BASE_JSON!;
    const rutaAbsoluta = path.resolve(__dirname, rutaBase, nombreArchivo);

    const publicaciones = await strapi.entityService.findMany('api::publicacion.publicacion', {
        fields: [
            'id',
            'titulo',
            'slug',
            'tipo',                // 'noticia' | 'evento' | 'comunicado'
            'descripcionCorta',
            'contenido1',          // 👈 blocks (dejamos tal cual)
            'contenido2',          // CKEditor (HTML)
            'fechaPublicacion',
            'fechaEventoInicio',
            'fechaEventoFin',
            'ubicacion',
            'destacado',
        ],
        populate: {
            imagenPrincipal: { fields: ['url'] },
            galeria: { fields: ['url'] },
            videosYoutube: true, // ajusta campos internos si tu componente tiene otros nombres
        },
        sort: { fechaPublicacion: 'desc' },
    });

    const baseUrl = (process.env.STRAPI_PUBLIC_URL || '').replace(/\/$/, '');

    const data = publicaciones.map((pub: any) => ({
        id: pub.id,
        titulo: pub.titulo,
        slug: pub.slug ?? '',
        tipo: pub.tipo,
        descripcionCorta: pub.descripcionCorta ?? '',
        // 👇 Exportamos el blocks crudo, sin transformar:
        contenido1: pub.contenido1 ?? [],
        // 👇 CKEditor HTML (si lo usas en otra parte):
        contenido2: pub.contenido2 ?? '',
        fechaPublicacion: pub.fechaPublicacion ?? null,
        fechaEventoInicio: pub.fechaEventoInicio ?? null,
        fechaEventoFin: pub.fechaEventoFin ?? null,
        ubicacion: pub.ubicacion ?? '',
        destacado: pub.destacado ?? false,
        imagenPrincipal: pub.imagenPrincipal?.url ? `${baseUrl}${pub.imagenPrincipal.url}` : null,
        galeria: Array.isArray(pub.galeria) ? pub.galeria.map((img: any) => `${baseUrl}${img.url}`) : [],
        videosYoutube: Array.isArray(pub.videosYoutube)
            ? pub.videosYoutube.map((v: any) => ({ id: v.id, url: v.url }))
            : [],
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
