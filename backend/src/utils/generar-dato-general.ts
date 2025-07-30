import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export async function generarDatoGeneral(data: any) {
    const nombreArchivo = 'dato-general.json';
    const rutaBase = process.env.RUTA_BASE_JSON!;
    const rutaAbsoluta = path.resolve(__dirname, rutaBase, nombreArchivo);
    const baseUrl = process.env.STRAPI_PUBLIC_URL?.replace(/\/$/, '') || '';

    // Preparamos solo los campos necesarios manualmente
    const resultado = {
        nombreInstitucion: data.nombreInstitucion ?? '',
        direccion: data.direccion ?? '',
        telefono1: data.telefono1 ?? '',
        telefono2: data.telefono2 ?? '',
        correo: data.correo ?? '',
        mapa: data.mapa ?? '',
        paginaWeb: data.paginaWeb ?? '',
        facebook: data.facebook ?? '',
        youtube: data.youtube ?? '',
        twitter: data.twitter ?? '',
        instagram: data.instagram ?? '',
        tiktok: data.tiktok ?? '',
        ruc: data.ruc ?? '',
        rd: data.rd ?? '',
        logo: data.logo?.url
            ? {
                url: `${baseUrl}${data.logo.url}`,
                alternativeText: data.logo.alternativeText ?? '',
                width: data.logo.width ?? null,
                height: data.logo.height ?? null,
                mime: data.logo.mime ?? '',
            }
            : null,
    };

    const nuevoContenido = JSON.stringify(resultado, null, 2);

    try {
        fs.mkdirSync(path.dirname(rutaAbsoluta), { recursive: true });
        fs.writeFileSync(rutaAbsoluta, nuevoContenido, 'utf-8');
        console.log(`✅ ${nombreArchivo} generado correctamente sin campos extras.`);
    } catch (error) {
        console.error(`❌ Error al guardar ${nombreArchivo}: ${error}`);
    }
}
