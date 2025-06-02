// Función principal para generar y actualizar automáticamente el campo `titulo` del paquete
export async function generarTituloPaquete(paqueteId: number | string) {
    try {
        console.log(`🚀 Generando título para paquete ${paqueteId}`);

        const paquete = await strapi.entityService.findOne('api::paquete.paquete', paqueteId, {
            populate: {
                grupos: {
                    populate: {
                        modulo: { fields: ['titulo-comercial'] },
                        calendario: { fields: ['titulo'] },
                        personal: {
                            populate: { user: { fields: ['username'] } }
                        }
                    }
                } as any
            }
        } as any) as any;

        if (!paquete.grupos?.length) {
            console.log(`⚠️ Paquete ${paqueteId} no tiene grupos relacionados.`);
            return;
        }

        const grupos = paquete.grupos;

        const partesUnicas = grupos.map((grupo: any) =>
            grupo.modulo?.['titulo-comercial'] || 'Sin módulo'
        );

        const sufijoEjemplo = (() => {
            const grupo = grupos.find((g: any) => g.personal?.user?.username) || grupos[0];

            const turno = grupo.turno || 'Sin turno';
            const calendarioTitulo = grupo.calendario?.titulo || '';
            const diasMatch = calendarioTitulo.match(/\[(.*?)\]/);
            const dias = diasMatch ? diasMatch[1] : 'Sin calendario';
            const responsable = grupo.personal?.user?.username;

            const responsableTexto = responsable ? `  (${responsable})` : '';
            return `[${turno}]  ${dias}${responsableTexto}`;
        })();

        const nuevoTitulo = `${partesUnicas.join(' / ')}  ${sufijoEjemplo}`.trim();

        if (paquete.titulo !== nuevoTitulo) {
            await strapi.entityService.update('api::paquete.paquete', paqueteId, {
                data: { titulo: nuevoTitulo }
            } as any);

            console.log(`✅ Título actualizado: ${nuevoTitulo}`);
        } else {
            console.log(`ℹ️ Título del paquete ${paqueteId} ya estaba actualizado.`);
        }

    } catch (error) {
        console.error('❌ Error al generar título del paquete:', error);
    }
}
