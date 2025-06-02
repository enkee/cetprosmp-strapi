export default {
    // Después de crear un registro en personal
    async afterCreate(event: any) {
        const { result } = event;
        // Espera breve antes de ejecutar la función que actualiza el campo
        setTimeout(() => generarDisplayName(result.id), 50);
    },

    // Después de actualizar un registro en personal
    async afterUpdate(event: any) {
        const { result } = event;
        // Espera breve antes de ejecutar la función que actualiza el campo
        setTimeout(() => generarDisplayName(result.id), 50);
    },
};

/**
 * Actualiza el campo `display_name` con el `username` del usuario relacionado.
 * Ejemplo: William Palomino
 */
async function generarDisplayName(personalId: number | string) {
    try {
        const personal = await strapi.entityService.findOne('api::personal.personal', personalId, {
            populate: {
                user: { fields: ['username'] },
            },
        } as any) as any;

        const username = personal?.user?.username || 'Sin usuario';

        if (personal.display_name !== username) {
            await strapi.entityService.update('api::personal.personal', personalId, {
                data: { display_name: username },
            } as any);

            console.log(`✅ display_name actualizado: ${username}`);
        }
    } catch (error) {
        console.error('❌ Error al generar display_name:', error);
    }
}
