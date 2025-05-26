export default {
  kind: "collectionType",
  collectionName: "sectores",
  info: {
    singularName: "sector",
    pluralName: "sectores",
    displayName: "Sector",
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
    },
    familias: {
      type: "relation",
      relation: "oneToMany",
      target: "api::familia.familia",
      mappedBy: "sector",
    },
  },
} as const;
