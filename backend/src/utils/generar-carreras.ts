import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export async function generarCarreras(strapi: any) {
    const nombreArchivo = 'carreras.json';
    const rutaBase = process.env.RUTA_BASE_JSON!;
    const rutaAbsoluta = path.resolve(__dirname, rutaBase, nombreArchivo);

    const carreras = await strapi.entityService.findMany('api::carrera.carrera', {
        fields: [
            'id',
            'titulo',
            'titulo-comercial',
            'codigo',
            'duracion',
            'creditos',
            'nivel',
            'slug',
            'descripcion2', // 👉 campo nuevo tipo blocks
        ],
        populate: {
            imagen: { fields: ['url'] },
            imagenes: { fields: ['url', 'alternativeText', 'caption', 'width', 'height', 'mime'] },
            'act-economica': {
                fields: ['id'],
                populate: {
                    especialidad: {
                        fields: ['id', 'titulo-comercial', 'slug'],
                    },
                },
            },
        },
    });

    const baseUrl = process.env.STRAPI_PUBLIC_URL?.replace(/\/$/, '') || '';

    const estructura: Record<number, any> = {};

    for (const car of carreras) {
        const especialidad = car['act-economica']?.especialidad;
        if (!especialidad?.id) continue;

        const espId = especialidad.id;

        if (!estructura[espId]) {
            estructura[espId] = {
                id: espId,
                tituloComercial: especialidad['titulo-comercial'],
                slug: especialidad.slug ?? '',
                carreras: [],
            };
        }

        estructura[espId].carreras.push({
            id: car.id,
            titulo: car.titulo,
            tituloComercial: car['titulo-comercial'],
            codigo: car.codigo ?? '',
            descripcion2: car.descripcion2 ?? [], // 👈 blocks de tipo texto enriquecido
            duracion: car.duracion ?? 0,
            creditos: car.creditos ?? 0,
            nivel: car.nivel ?? '',
            slug: car.slug ?? '',
            imagen: car.imagen?.url ? `${baseUrl}${car.imagen.url}` : null,
            imagenes: (car.imagenes ?? []).map((img: any) => ({
                url: `${baseUrl}${img.url}`,
                alternativeText: img.alternativeText ?? '',
                caption: img.caption ?? '',
                width: img.width ?? null,
                height: img.height ?? null,
                mime: img.mime ?? '',
            })),
        });
    }

    // Ordenar carreras por ID dentro de cada especialidad
    for (const esp of Object.values(estructura)) {
        esp.carreras.sort((a: any, b: any) => a.id - b.id);
    }

    // Ordenar especialidades por ID
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
