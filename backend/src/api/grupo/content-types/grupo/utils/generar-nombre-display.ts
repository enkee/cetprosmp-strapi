/**
 * Esta función genera y actualiza el campo `nombre_display` de un grupo
 * combinando datos del módulo, calendario, turno y responsable asignado.
 */
export async function generarNombreDisplay(grupoId: number | string) {
    try {
        // Obtiene el grupo con sus relaciones necesarias: módulo, calendario y personal (incluyendo usuario)
        const grupo = await strapi.entityService.findOne('api::grupo.grupo', grupoId, {
            populate: {
                modulo: { fields: ['titulo-comercial'] },
                calendario: { fields: ['titulo'] },
                personal: {
                    populate: {
                        user: { fields: ['username'] },
                    },
                },
            },
        } as any) as any;

        const moduloTitulo = grupo.modulo?.['titulo-comercial'] || 'Sin módulo';
        const turno = grupo.turno || 'Sin turno';
        const calendarioTitulo = grupo.calendario?.titulo || '';
        const diasMatch = calendarioTitulo.match(/\[(.*?)\]/);
        const dias = diasMatch ? diasMatch[1] : 'Sin calendario';
        const responsable = grupo.personal?.user?.username;

        // Si hay responsable, lo incluye entre paréntesis; si no, lo omite completamente
        const responsableTexto = responsable ? `  (${responsable})` : '';

        // Construye el nuevo valor para el campo nombre_display
        const nuevoDisplay = `${moduloTitulo}  [${turno}]  ${dias}${responsableTexto}`;

        if (grupo.nombre_display !== nuevoDisplay) {
            await strapi.entityService.update('api::grupo.grupo', grupoId, {
                data: { nombre_display: nuevoDisplay },
            } as any);
            console.log(`✅ nombre_display actualizado: ${nuevoDisplay}`);
        } else {
            console.log(`ℹ️ nombre_display ya estaba actualizado para grupo ${grupoId}`);
        }

    } catch (error) {
        console.error('❌ Error al generar nombre_display:', error);
    }
}
