import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export async function generarMenuCarreras(strapi: any) {
    const nombreArchivo = 'carreras.json';
    const rutaBase = process.env.RUTA_BASE_JSON!;
    const rutaAbsoluta = path.resolve(__dirname, rutaBase, nombreArchivo);

    // Obtener módulos con su carrera > act-economica > especialidad
    const modulos = await strapi.entityService.findMany('api::modulo.modulo', {
        fields: ['id', 'titulo-comercial', 'horas', 'activo'],
        populate: {
            carrera: {
                fields: ['id', 'titulo-comercial', 'codigo', 'duracion'],
                populate: {
                    'act-economica': {
                        populate: {
                            especialidad: {
                                fields: ['id', 'titulo-comercial'],
                            },
                        },
                    },
                },
            },
        },
        filters: {
            activo: true,
        },
    });

    // Agrupar en estructura especialidad > carrera > módulos
    const estructura: Record<number, any> = {};

    for (const mod of modulos) {
        const carrera = mod.carrera;
        const actividad = carrera?.['act-economica'];
        const especialidad = actividad?.especialidad;

        if (!especialidad?.id || !carrera?.id) continue;

        if (!estructura[especialidad.id]) {
            estructura[especialidad.id] = {
                id: especialidad.id,
                tituloComercial: especialidad['titulo-comercial'],
                carreras: {},
            };
        }

        if (!estructura[especialidad.id].carreras[carrera.id]) {
            estructura[especialidad.id].carreras[carrera.id] = {
                id: carrera.id,
                tituloComercial: carrera['titulo-comercial'],
                codigo: carrera.codigo,
                duracion: carrera.duracion,
                modulos: [],
            };
        }

        estructura[especialidad.id].carreras[carrera.id].modulos.push({
            id: mod.id,
            tituloComercial: mod['titulo-comercial'],
            horas: mod.horas,
            activo: mod.activo,
        });
    }

    // Convertir a array ordenado
    const data = Object.values(estructura).map((esp: any) => ({
        id: esp.id,
        tituloComercial: esp.tituloComercial,
        carreras: Object.values(esp.carreras).map((car: any) => ({
            id: car.id,
            tituloComercial: car.tituloComercial,
            codigo: car.codigo,
            duracion: car.duracion,
            modulos: car.modulos.sort((a: any, b: any) =>
                a.tituloComercial.localeCompare(b.tituloComercial)
            ),
        })),
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
