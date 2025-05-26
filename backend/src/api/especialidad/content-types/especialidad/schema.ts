export default {
  kind: "collectionType",
  collectionName: "especialidades",
  info: {
    singularName: "especialidad",
    pluralName: "especialidades",
    displayName: "Especialidad",
    description: "",
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    titulo: {
      type: "string",
    },
    "titulo-comercial": {
      type: "string",
    },
    descripcion: {
      type: "customField",
      customField: "plugin::ckeditor5.CKEditor",
      options: {
        preset: "defaultHtml",
      },
    },
    imagen_destacada: {
      type: "media",
      multiple: false,
      required: false,
    },
    "act-economicas": {
      type: "relation",
      relation: "oneToMany",
      target: "api::act-economica.act-economica",
      mappedBy: "especialidad",
    },
    personals: {
      type: "relation",
      relation: "manyToOne",
      target: "api::personal.personal",
      inversedBy: "especialidad",
    },
  },
} as const;
