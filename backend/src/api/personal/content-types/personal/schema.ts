export default {
    kind: "collectionType",
    collectionName: "personals",
    info: {
        singularName: "personal",
        pluralName: "personals",
        displayName: "Personal",
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        memo: {
            type: "customField",
            customField: "plugin::ckeditor5.CKEditor",
            options: {
                preset: "defaultHtml",
            },
        },
        user: {
            type: "relation",
            relation: "oneToOne",
            target: "plugin::users-permissions.user",
            inversedBy: "personal",
        },
        especialidad: {
            type: "relation",
            relation: "oneToMany",
            target: "api::especialidad.especialidad",
            mappedBy: "personal",
        },
        grupos: {
            type: "relation",
            relation: "oneToMany",
            target: "api::grupo.grupo",
            mappedBy: "personal",
        },
    },
} as const;
