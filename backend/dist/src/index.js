"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
// Define a type for the admin user
type AdminUser = {
  id: number;
  email?: string;
  username?: string;
  // Add other properties you might need
};
*/
exports.default = {
    async bootstrap({ strapi }) {
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
