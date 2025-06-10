import type { Core } from '@strapi/strapi';
/*
// Define a type for the admin user
type AdminUser = {
  id: number;
  email?: string;
  username?: string;
  // Add other properties you might need
};
*/
export default {
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await strapi.admin.services.permission.conditionProvider.register({
      displayName: 'Ver solo no archivado',
      name: 'only-no-archived',
      plugin: 'admin',
      handler: () => {
        return { archivado: false };
      },
    });
  },
};