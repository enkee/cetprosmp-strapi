import { generarPersonal } from '../../../../utils/generar-personal';

export default {
    async afterCreate(event: any) {
        const { result } = event;

        // ⚠️ Ejecutar fuera de la transacción para evitar errores de Knex
        setTimeout(() => {
            generarDisplayName(result.id);
            generarPersonal(strapi);
        }, 100);
    },

    async afterUpdate(event: any) {
        const { result } = event;

        // ⚠️ Ejecutar fuera de la transacción para evitar errores de Knex
        setTimeout(() => {
            generarDisplayName(result.id);
            generarPersonal(strapi);
        }, 100);
    },

    async afterDelete(event: any) {
        // ⚠️ Ejecutar fuera de la transacción para evitar errores de Knex
        setTimeout(() => {
            generarPersonal(strapi);
        }, 100);
    },
};

/**
 * Actualiza el campo `display_name` con el `username` del usuario relacionado.
 * Ejemplo: William Palomino
 */
async function generarDisplayName(personalId: number | string) {
    try {
        // 👇 Fuerza el tipo de respuesta como `any` para evitar errores de propiedades desconocidas
        const personal = await strapi.entityService.findOne('api::personal.personal', personalId, {
            populate: {
                user: { fields: ['username'] },
            },
        } as any) as any; // ⬅️ esta línea es clave

        // 👇 Maneja el posible null explícitamente (error TS18047)
        if (!personal) {
            console.warn(`⚠️ No se encontró el personal con ID ${personalId}`);
            return;
        }

        const username = personal?.user?.username || 'Sin usuario';

        if (personal.display_name !== username) {
            await strapi.entityService.update('api::personal.personal', personalId, {
                data: {
                    display_name: username,
                },
            } as any); // ⬅️ evita error en la propiedad personalizada
            console.log(`✅ display_name actualizado: ${username}`);
        }
    } catch (error) {
        console.error('❌ Error al generar display_name:', error);
    }
}