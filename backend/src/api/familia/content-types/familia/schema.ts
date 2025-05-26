export default {
    kind: "collectionType",
    collectionName: "familias",
    info: {
        singularName: "familia",
        pluralName: "familias",
        displayName: "Familia",
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        titulo: {
            type: "string",
        },
        descripcion: {
            type: "customField",
            customField: "plugin::ckeditor5.CKEditor",
            options: {
                preset: "defaultHtml",
            },
        },
        sector: {
            type: "relation",
            relation: "manyToOne",
            target: "api::sector.sector",
            inversedBy: "familias",
        },
        personales: {
            type: "relation",
            relation: "oneToMany",
            target: "api::personal.personal",
            mappedBy: "familia",
        },
        "act-economicas": {
            type: "relation",
            relation: "oneToMany",
            target: "api::act-economica.act-economica",
            mappedBy: "familia",
        },
        imagen: {
            type: "media",
            multiple: false,
            required: false,
            allowedTypes: ["images", "files", "videos", "audios"],
        },
    },
} as const;
