export default {
    kind: "collectionType",
    collectionName: "noticias",
    info: {
        singularName: "noticia",
        pluralName: "noticias",
        displayName: "Noticia",
    },
    options: {
        draftAndPublish: true,
    },
    attributes: {
        titulo: {
            type: "string",
        },
        contenido: {
            type: "customField",
            customField: "plugin::ckeditor5.CKEditor",
            options: {
                preset: "defaultHtml",
            },
        },
        imagen_destacada: {
            type: "media",
            multiple: true,
            allowedTypes: ["images", "files", "videos", "audios"],
        },
        fecha_publicacion: {
            type: "date",
        },
        publicado: {
            type: "boolean",
        },
    },
} as const;
