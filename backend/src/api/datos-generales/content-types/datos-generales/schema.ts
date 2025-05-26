export default {
    kind: "singleType",
    collectionName: "datos_generales",
    info: {
        singularName: "datos-generales",
        pluralName: "configuracion-general",
        displayName: "Datos Generales",
        description: "Información general de la institución educativa",
    },
    options: {
        draftAndPublish: false,
    },
    attributes: {
        nombreInstitucion: {
            type: "string",
            required: true,
        },
        direccion: {
            type: "string",
            required: true,
        },
        telefono1: {
            type: "string",
            required: true,
        },
        telefono2: {
            type: "string",
        },
        correo: {
            type: "email",
        },
        paginaWeb: {
            type: "string",
            regex: "^(https?://)?([\\w.-]+)\\.([a-z\\.]{2,6})([/\\w\\.-]*)*/?$",
        },
        facebook: {
            type: "string",
            regex: "^(https?:\\/\\/)?(www\\.)?facebook\\.com\\/[a-zA-Z0-9(.?)?]",
        },
        ruc: {
            type: "string",
            regex: "^\\d{11}$",
            required: true,
        },
        rd: {
            type: "string",
            required: true,
        },
        mapa: {
            type: "text",
        },
        logo: {
            type: "media",
            allowedTypes: ["images"],
            multiple: false,
            required: false,
        },
    },
} as const;
