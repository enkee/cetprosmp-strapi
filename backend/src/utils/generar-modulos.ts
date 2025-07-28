import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export async function generarModulos(strapi: any) {
    const nombreArchivo = 'modulos.json';
    const rutaBase = process.env.RUTA_BASE_JSON!;
    const rutaAbsoluta = path.resolve(__dirname, rutaBase, nombreArchivo);

    const modulos = await strapi.entityService.findMany('api::modulo.modulo', {
        fields: [
            'id',
            'titulo',
            'titulo-comercial',
            'orden',
            'descripcion2',
            'horas',
            'creditos',
            'metas',
            'slug',
            'activo',
        ],
        populate: {
            imagen: { fields: ['url'] },
            imagenes: {
                fields: ['url', 'alternativeText', 'caption', 'width', 'height', 'mime'],
            },
            carrera: {
                fields: ['id', 'titulo-comercial', 'slug', 'codigo'], // 👈 se añade 'codigo'
            },
            videosYoutube: true,
        },
        filters: {
            activo: true,
        },
    });

    const baseUrl = process.env.STRAPI_PUBLIC_URL?.replace(/\/$/, '') || '';

    const estructura: Record<number, any> = {};

    for (const mod of modulos) {
        const carrera = mod.carrera;
        if (!carrera?.id) continue;

        const carId = carrera.id;

        if (!estructura[carId]) {
            estructura[carId] = {
                id: carId,
                tituloComercial: carrera['titulo-comercial'],
                slug: carrera.slug ?? '',
                codigo: carrera.codigo ?? '', // 👈 se agrega aquí
                modulos: [],
            };
        }

        estructura[carId].modulos.push({
            id: mod.id,
            titulo: mod.titulo,
            tituloComercial: mod['titulo-comercial'],
            orden: mod.orden ?? 0,
            descripcion2: mod.descripcion2 ?? [],
            horas: mod.horas ?? 0,
            creditos: mod.creditos ?? 0,
            metas: mod.metas ?? 15,
            slug: mod.slug ?? '',
            activo: mod.activo ?? true,
            imagen: mod.imagen?.url ? `${baseUrl}${mod.imagen.url}` : null,
            imagenes: (mod.imagenes ?? []).map((img: any) => ({
                url: `${baseUrl}${img.url}`,
                alternativeText: img.alternativeText ?? '',
                caption: img.caption ?? '',
                width: img.width ?? null,
                height: img.height ?? null,
                mime: img.mime ?? '',
            })),
            videosYoutube: (mod.videosYoutube ?? []).map((vid: any) => ({
                url: vid.url,
            })),
        });
    }

    // Ordenar módulos por ID dentro de cada carrera
    for (const car of Object.values(estructura)) {
        car.modulos.sort((a: any, b: any) => a.id - b.id);
    }

    // Ordenar carreras por ID
    const data = Object.values(estructura).sort((a: any, b: any) => a.id - b.id);

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
