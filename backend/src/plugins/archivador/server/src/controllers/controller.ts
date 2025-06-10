import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async index(ctx) {
    const semestreId = parseInt(ctx.params.semestreId);

    if (isNaN(semestreId)) {
      ctx.throw(400, 'ID de semestre inválido');
    }

    const resultado = await strapi
      .plugin('archivador')
      .service('service')
      .toggle(semestreId);

    ctx.send({ mensaje: resultado.mensaje });
  },
});

export default controller;
