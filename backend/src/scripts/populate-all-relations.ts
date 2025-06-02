// Exportamos una función que construye automáticamente un objeto "populate"
// para ser usado en consultas de Strapi, incluyendo relaciones anidadas hasta cierta profundidad
export function populateAllRelations(strapi: any, uid: string, depth = 2): any {
    // Obtenemos el modelo (content-type) correspondiente al UID
    const model = strapi.contentTypes[uid];

    // Si no se encuentra el modelo, devolvemos un objeto vacío
    if (!model) return {};

    // Inicializamos el objeto que contendrá las relaciones a poblar
    const populate: Record<string, any> = {};

    // Recorremos cada atributo definido en el modelo
    for (const key in model.attributes) {
        const attr = model.attributes[key];

        // Verificamos si el atributo es de tipo relación, componente, zona dinámica o media
        if (['relation', 'component', 'dynamiczone', 'media'].includes(attr.type)) {
            // Si aún no se alcanzó el límite de profundidad
            if (depth > 1) {
                // Si es una relación y tiene un destino válido (otra colección)
                if (attr.type === 'relation' && attr.target) {
                    // Poblar de forma recursiva disminuyendo la profundidad
                    populate[key] = {
                        populate: populateAllRelations(strapi, attr.target, depth - 1),
                    };
                } else {
                    // Para otros tipos (componente, media, etc.), simplemente activamos populate
                    populate[key] = true;
                }
            } else {
                // Si se alcanzó el límite de profundidad, activamos populate sin anidar más
                populate[key] = true;
            }
        }
    }

    // Devolvemos el objeto populate construido para este modelo
    return populate;
}
