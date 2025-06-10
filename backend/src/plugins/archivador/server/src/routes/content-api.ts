import { Auth } from "@strapi/types/dist/modules";

export default [
  {
    method: 'PUT',
    path: '/:semestreId',
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
];

