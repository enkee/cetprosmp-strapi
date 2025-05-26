export default {
  kind: "collectionType",
  collectionName: "act-economicas",
  info: {
    singularName: "act-economica",
    pluralName: "act-economicas",
    displayName: "Act-Economica",
    description: "",
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
    imagen_destacada: {
      type: "media",
      multiple: false,
      required: false,
    },
    especialidad: {
      type: "relation",
      relation: "manyToOne",
      target: "api::especialidad.especialidad",
      inversedBy: "act-economicas",
    },
    familia: {
      type: "relation",
      relation: "manyToOne",
      target: "api::familia.familia",
      inversedBy: "act-economicas",
    },
    carreras: {
      type: "relation",
      relation: "oneToMany",
      target: "api::carrera.carrera",
      mappedBy: "act-economica",
    },
    modulos: {
      type: "relation",
      relation: "oneToMany",
      target: "api::modulo.modulo",
      mappedBy: "act-economica",
    },
  },
} as const;
