// services/service.ts actualizado con filtros anidados y correcciones
import type { Core } from '@strapi/strapi';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async toggle(semestreId: number) {
    if (!semestreId) throw new Error('semestreId es requerido');

    const semestre = await strapi.entityService.findOne('api::semestre.semestre', semestreId);
    if (!semestre) throw new Error('Semestre no encontrado');

    const nuevoEstado = !semestre.archivado;

    // Archivar CALENDARIOS relacionados al SEMESTRE
    const calendarios = await strapi.entityService.findMany('api::calendario.calendario', {
      filters: {
        semestre: semestreId,
      },
      fields: ['id'],
    });

    await Promise.all(
      calendarios.map((calendario) =>
        strapi.entityService.update('api::calendario.calendario', calendario.id, {
          data: { archivado: nuevoEstado } as any,
        })
      )
    );

    // Archivar GRUPOS con relación a CALENDARIO -> SEMESTRE
    const grupos = await strapi.entityService.findMany('api::grupo.grupo', {
      filters: {
        calendario: {
          semestre: semestreId,
        },
      },
      fields: ['id'],
    });

    await Promise.all(
      grupos.map((grupo) =>
        strapi.entityService.update('api::grupo.grupo', grupo.id, {
          data: { archivado: nuevoEstado } as any,
        })
      )
    );

    // Archivar PAQUETES relacionados con GRUPOS relacionados al semestre
    const paquetes = await strapi.entityService.findMany('api::paquete.paquete', {
      filters: {
        grupos: {
          calendario: {
            semestre: semestreId,
          },
        },
      },
      fields: ['id'],
    });

    await Promise.all(
      paquetes.map((paquete) =>
        strapi.entityService.update('api::paquete.paquete', paquete.id, {
          data: { archivado: nuevoEstado } as any,
        })
      )
    );

    // Archivar MATRÍCULAS relacionadas por GRUPO
    const matriculasPorGrupo = await strapi.entityService.findMany('api::matricula.matricula', {
      filters: {
        grupo: {
          calendario: {
            semestre: semestreId,
          },
        },
      },
      fields: ['id'],
    });

    if (Array.isArray(matriculasPorGrupo)) {
      await Promise.all(
        matriculasPorGrupo.map((matricula) =>
          strapi.entityService.update('api::matricula.matricula', matricula.id, {
            data: { archivado: nuevoEstado } as any,
          })
        )
      );
    }

    // Archivar MATRÍCULAS relacionadas por PAQUETE
    const matriculasPorPaquete = await strapi.entityService.findMany('api::matricula.matricula', {
      filters: {
        paquete: {
          grupos: {
            calendario: {
              semestre: semestreId,
            },
          },
        },
      },
      fields: ['id'],
    });

    if (Array.isArray(matriculasPorPaquete)) {
      await Promise.all(
        matriculasPorPaquete.map((matricula) =>
          strapi.entityService.update('api::matricula.matricula', matricula.id, {
            data: { archivado: nuevoEstado } as any,
          })
        )
      );
    }

    // Actualizar el propio semestre
    await strapi.entityService.update('api::semestre.semestre', semestreId, {
      data: { archivado: nuevoEstado } as any,
    });

    return {
      mensaje: `Semestre ${nuevoEstado ? 'archivado' : 'desarchivado'} correctamente.`,
    };
  },
});

export default service;
