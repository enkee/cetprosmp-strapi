export default {
    kind: "collectionType",
    collectionName: "pruebas",
    info: {
        singularName: "prueba",
        pluralName: "pruebas",
        displayName: "Prueba",
        description: "",
    },
    options: {
        draftAndPublish: true,
    },
    attributes: {
        Descripcion: {
            type: "customField",
            customField: "plugin::ckeditor5.CKEditor",
            options: {
                preset: "defaultHtml",
            },
        },
        Descripcion_2: {
            type: "blocks",
        },
        Descripcion_3: {
            type: "richtext",
        },
    },
} as const;
