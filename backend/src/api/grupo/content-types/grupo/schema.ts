export default {
    kind: "collectionType",
    collectionName: "grupos",
    info: {
        singularName: "grupo",
        pluralName: "grupos",
        displayName: "Grupo",
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        modulo: {
            type: "relation",
            relation: "manyToOne",
            target: "api::modulo.modulo",
            inversedBy: "grupos",
        },
        horario: {
            type: "relation",
            relation: "manyToOne",
            target: "api::horario.horario",
            inversedBy: "grupos",
        },
        fecha: {
            type: "relation",
            relation: "manyToOne",
            target: "api::fecha.fecha",
            inversedBy: "grupo",
        },
        personal: {
            type: "relation",
            relation: "manyToOne",
            target: "api::personal.personal",
            inversedBy: "grupos",
        },
        semestre: {
            type: "relation",
            relation: "manyToOne",
            target: "api::semestre.semestre",
            inversedBy: "grupo",
        },
        matriculas: {
            type: "relation",
            relation: "oneToMany",
            target: "api::matricula.matricula",
            mappedBy: "grupo",
        },
    },
} as const;
