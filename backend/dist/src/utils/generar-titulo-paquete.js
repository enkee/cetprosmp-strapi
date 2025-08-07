"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarTituloPaquete = void 0;
// Función principal para generar y actualizar automáticamente el campo `titulo` del paquete
async function generarTituloPaquete(paqueteId) {
    var _a;
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
                }
            }
        });
        if (!((_a = paquete.grupos) === null || _a === void 0 ? void 0 : _a.length)) {
            console.log(`⚠️ Paquete ${paqueteId} no tiene grupos relacionados.`);
            return;
        }
        const grupos = paquete.grupos;
        const partesUnicas = grupos.map((grupo) => { var _a; return ((_a = grupo.modulo) === null || _a === void 0 ? void 0 : _a['titulo-comercial']) || 'Sin módulo'; });
        const sufijoEjemplo = (() => {
            var _a, _b, _c;
            const grupo = grupos.find((g) => { var _a, _b; return (_b = (_a = g.personal) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.username; }) || grupos[0];
            const turno = grupo.turno || 'Sin turno';
            const calendarioTitulo = ((_a = grupo.calendario) === null || _a === void 0 ? void 0 : _a.titulo) || '';
            const diasMatch = calendarioTitulo.match(/\[(.*?)\]/);
            const dias = diasMatch ? diasMatch[1] : 'Sin calendario';
            const responsable = (_c = (_b = grupo.personal) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.username;
            const responsableTexto = responsable ? `  (${responsable})` : '';
            return `[${turno}]  ${dias}${responsableTexto}`;
        })();
        const nuevoTitulo = `${partesUnicas.join(' / ')}  ${sufijoEjemplo}`.trim();
        if (paquete.titulo !== nuevoTitulo) {
            await strapi.entityService.update('api::paquete.paquete', paqueteId, {
                data: { titulo: nuevoTitulo }
            });
            console.log(`✅ Título actualizado: ${nuevoTitulo}`);
        }
        else {
            console.log(`ℹ️ Título del paquete ${paqueteId} ya estaba actualizado.`);
        }
    }
    catch (error) {
        console.error('❌ Error al generar título del paquete:', error);
    }
}
exports.generarTituloPaquete = generarTituloPaquete;
