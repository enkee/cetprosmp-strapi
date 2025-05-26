export default {
    kind: "collectionType",
    collectionName: "carreras",
    info: {
        singularName: "carrera",
        pluralName: "carreras",
        displayName: "Carrera",
        description: "",
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        titulo: {
            type: "string",
        },
        codigo: {
            type: "string",
        },
        descripcion: {
            type: "customField",
            customField: "plugin::ckeditor5.CKEditor",
            options: {
                preset: "defaultHtml",
            },
        },
        duracion: {
            type: "integer",
        },
        creditos: {
            type: "integer",
        },
        "Nivel-formativo": {
            type: "enumeration",
            enum: ["Auxiliar Técnico", "Técnico", "Profesional"],
        },
        imagen: {
            type: "media",
            multiple: false,
            required: false,
            allowedTypes: ["images", "files", "videos", "audios"],
        },
        "act-economica": {
            type: "relation",
            relation: "manyToOne",
            target: "api::act-economica.act-economica",
            inversedBy: "carreras",
        },
        modulos: {
            type: "relation",
            relation: "oneToMany",
            target: "api::modulo.modulo",
            mappedBy: "carrera",
        },
    },
} as const;
