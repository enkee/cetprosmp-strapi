export default {
    kind: "collectionType",
    collectionName: "semestres",
    info: {
        singularName: "semestre",
        pluralName: "semestres",
        displayName: "Semestre",
        description: "",
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        titulo: {
            type: "string",
        },
        direccior: {
            type: "string",
        },
        descripcion: {
            type: "text",
        },
        grupo: {
            type: "relation",
            relation: "oneToMany",
            target: "api::grupo.grupo",
            mappedBy: "semestre",
        },
        fecha: {
            type: "relation",
            relation: "oneToMany",
            target: "api::fecha.fecha",
            mappedBy: "semestre",
        },
    },
} as const;
