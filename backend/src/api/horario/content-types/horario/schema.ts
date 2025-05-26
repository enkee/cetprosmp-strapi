export default {
    kind: "collectionType",
    collectionName: "horarios",
    info: {
        singularName: "horario",
        pluralName: "horarios",
        displayName: "Horario",
        description: "",
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        turno: {
            type: "enumeration",
            enum: ["Mañana", "Tarde", "Noche"],
        },
        descripcion: {
            type: "string",
        },
        imagen: {
            type: "media",
            multiple: false,
            required: false,
        },
        grupos: {
            type: "relation",
            relation: "oneToMany",
            target: "api::grupo.grupo",
            mappedBy: "horario",
        },
    },
} as const;
