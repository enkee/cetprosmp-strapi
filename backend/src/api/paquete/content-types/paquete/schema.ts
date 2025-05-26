export default {
    kind: "collectionType",
    collectionName: "paquetes",
    info: {
        singularName: "paquete",
        pluralName: "paquetes",
        displayName: "Paquete",
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        titulo: {
            type: "string",
            required: true,
        },
        descripcion: {
            type: "text",
        },
        grupos: {
            type: "relation",
            relation: "manyToMany",
            target: "api::grupo.grupo",
        },
    },
} as const;
