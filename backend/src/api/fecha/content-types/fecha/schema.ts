export default {
    kind: "collectionType",
    collectionName: "fechas",
    info: {
        singularName: "fecha",
        pluralName: "fechas",
        displayName: "Fecha",
        description: "",
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        titulo: {
            type: "string",
        },
        "fecha-ini": {
            type: "date",
            required: true,
        },
        "fecha-fin": {
            type: "date",
            required: true,
        },
        tipo: {
            type: "enumeration",
            enum: ["cronograma", "simulacro", "festividad"],
            default: "cronograma",
            required: true,
        },
        semestre: {
            type: "relation",
            relation: "manyToOne",
            target: "api::semestre.semestre",
            inversedBy: "fecha",
        },
        grupo: {
            type: "relation",
            relation: "oneToMany",
            target: "api::grupo.grupo",
            mappedBy: "fecha",
        },
    },
} as const;
