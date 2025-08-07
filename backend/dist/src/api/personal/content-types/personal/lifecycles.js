"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generar_personal_1 = require("../../../../utils/generar-personal");
exports.default = {
    async afterCreate(event) {
        const { result } = event;
        // ⚠️ Ejecutar fuera de la transacción para evitar errores de Knex
        setTimeout(() => {
            generarDisplayName(result.id);
            (0, generar_personal_1.generarPersonal)(strapi);
        }, 100);
    },
    async afterUpdate(event) {
        const { result } = event;
        // ⚠️ Ejecutar fuera de la transacción para evitar errores de Knex
        setTimeout(() => {
            generarDisplayName(result.id);
            (0, generar_personal_1.generarPersonal)(strapi);
        }, 100);
    },
    async afterDelete(event) {
        // ⚠️ Ejecutar fuera de la transacción para evitar errores de Knex
        setTimeout(() => {
            (0, generar_personal_1.generarPersonal)(strapi);
        }, 100);
    },
};
/**
 * Actualiza el campo `display_name` con el `username` del usuario relacionado.
 * Ejemplo: William Palomino
 */
async function generarDisplayName(personalId) {
    var _a;
    try {
        // 👇 Fuerza el tipo de respuesta como `any` para evitar errores de propiedades desconocidas
        const personal = await strapi.entityService.findOne('api::personal.personal', personalId, {
            populate: {
                user: { fields: ['username'] },
            },
        }); // ⬅️ esta línea es clave
        // 👇 Maneja el posible null explícitamente (error TS18047)
        if (!personal) {
            console.warn(`⚠️ No se encontró el personal con ID ${personalId}`);
            return;
        }
        const username = ((_a = personal === null || personal === void 0 ? void 0 : personal.user) === null || _a === void 0 ? void 0 : _a.username) || 'Sin usuario';
        if (personal.display_name !== username) {
            await strapi.entityService.update('api::personal.personal', personalId, {
                data: {
                    display_name: username,
                },
            }); // ⬅️ evita error en la propiedad personalizada
            console.log(`✅ display_name actualizado: ${username}`);
        }
    }
    catch (error) {
        console.error('❌ Error al generar display_name:', error);
    }
}
