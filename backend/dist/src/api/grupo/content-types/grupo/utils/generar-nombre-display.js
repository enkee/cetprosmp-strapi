"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarNombreDisplay = void 0;
/**
 * Esta función genera y actualiza el campo `nombre_display` de un grupo
 * combinando datos del módulo, calendario, turno y responsable asignado.
 */
async function generarNombreDisplay(grupoId) {
    var _a, _b, _c, _d;
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
        });
        const moduloTitulo = ((_a = grupo.modulo) === null || _a === void 0 ? void 0 : _a['titulo-comercial']) || 'Sin módulo';
        const turno = grupo.turno || 'Sin turno';
        const calendarioTitulo = ((_b = grupo.calendario) === null || _b === void 0 ? void 0 : _b.titulo) || '';
        const diasMatch = calendarioTitulo.match(/\[(.*?)\]/);
        const dias = diasMatch ? diasMatch[1] : 'Sin calendario';
        const responsable = (_d = (_c = grupo.personal) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.username;
        // Si hay responsable, lo incluye entre paréntesis; si no, lo omite completamente
        const responsableTexto = responsable ? `  (${responsable})` : '';
        // Construye el nuevo valor para el campo nombre_display
        const nuevoDisplay = `${moduloTitulo}  [${turno}]  ${dias}${responsableTexto}`;
        if (grupo.nombre_display !== nuevoDisplay) {
            await strapi.entityService.update('api::grupo.grupo', grupoId, {
                data: { nombre_display: nuevoDisplay },
            });
            console.log(`✅ nombre_display actualizado: ${nuevoDisplay}`);
        }
        else {
            console.log(`ℹ️ nombre_display ya estaba actualizado para grupo ${grupoId}`);
        }
    }
    catch (error) {
        console.error('❌ Error al generar nombre_display:', error);
    }
}
exports.generarNombreDisplay = generarNombreDisplay;
