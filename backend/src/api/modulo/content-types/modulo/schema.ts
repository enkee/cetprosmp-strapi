export default {
    kind: "collectionType",
    collectionName: "modulos",
    info: {
        singularName: "modulo",
        pluralName: "modulos",
        displayName: "Modulo",
        description: "",
    },
    options: {
        draftAndPublish: true,
    },
    attributes: {
        titulo: {
            type: "string",
        },
        comercial: {
            type: "string",
        },
        orden: {
            type: "integer",
        },
        descripcion: {
            type: "customField",
            customField: "plugin::ckeditor5.CKEditor",
            options: {
                preset: "defaultHtml",
            },
        },
        horas: {
            type: "integer",
        },
        creditos: {
            type: "integer",
        },
        metas: {
            type: "integer",
            default: 15,
        },
        imagenes: {
            type: "media",
            multiple: true,
            required: false,
            allowedTypes: ["images"],
        },
        destacada: {
            type: "media",
            multiple: false,
            required: false,
            allowedTypes: ["images"],
        },
        activo: {
            type: "boolean",
            default: true,
        },
        carrera: {
            type: "relation",
            relation: "manyToOne",
            target: "api::carrera.carrera",
            inversedBy: "modulos",
        },
        grupos: {
            type: "relation",
            relation: "oneToMany",
            target: "api::grupo.grupo",
            mappedBy: "modulo",
        },
    },
} as const;
