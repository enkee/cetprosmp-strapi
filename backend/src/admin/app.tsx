import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['es'],
  },
  bootstrap(app: StrapiApp) {
    app.registerHook('CM/pages/ListView/inject-filter-initial', ({ layout, query }) => {
      console.log(`🧪 Hook activo para modelo: ${layout.apiID}`); // ⬅️ Agregado

      const modelos = ['grupo', 'paquete', 'matricula', 'calendario', 'semestre'];

      if (modelos.includes(layout.apiID)) {
        console.log(`➡️ Ocultando items archivados en: ${layout.apiID}`); // ⬅️ Agregado
        return {
          query: {
            ...query,
            filters: {
              ...query?.filters,
              archivado: { $eq: false },
            },
          },
        };
      }

      return {};
    });
  },
};
