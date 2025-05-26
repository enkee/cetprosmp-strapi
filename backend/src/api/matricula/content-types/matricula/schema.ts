export default {
  kind: "collectionType",
  collectionName: "matriculas",
  info: {
    singularName: "matricula",
    pluralName: "matriculas",
    displayName: "Matricula",
    description: "",
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    num_recibo: {
      type: "integer",
      required: true,
    },
    fecha_matricula: {
      type: "date",
      required: true,
    },
    user: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::users-permissions.user",
      inversedBy: "matriculas",
    },
    grupo: {
      type: "relation",
      relation: "manyToOne",
      target: "api::grupo.grupo",
      inversedBy: "matriculas",
    },
    paquete: {
      type: "relation",
      relation: "manyToOne",
      target: "api::grupo.grupo",
      inversedBy: "matriculas",
    },
  },
} as const;
