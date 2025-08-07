'use client';

import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Especialidad } from './CarruselPortada';
import CarrerasBlock from './CarrerasBlock';
import ModularesBlock from './ModularesBlock';
import PortadaImagen from './PortadaImagen';
import EspecialidadTitulo from './EspecialidadTitulo'; // Asegúrate de que la ruta sea correcta


const fondoDefault = process.env.NEXT_PUBLIC_DEFAULT_BACKGROUND_URL;

export default function CarruselSlide({ especialidad }: { especialidad: Especialidad }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const carrerasConCodigo = especialidad.carreras.filter((c) => c.codigo);
  const todosLosModulos = especialidad.carreras.flatMap((c) => c.modulos);
  const modulosDeCarrerasConCodigo = carrerasConCodigo.flatMap((c) => c.modulos);
  const modularesSueltos = todosLosModulos.filter(
    (m) => !modulosDeCarrerasConCodigo.some((c) => c.id === m.id)
  );

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: isMobile ? 'calc(100vh - 48px)' : 500,
        backgroundImage: `url(${especialidad.fondo || fondoDefault})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: isMobile ? 1 : 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        borderRadius:2,
      }}
    >
      {/* Contenido textual */}
      <Box
        sx={{
          position:'relative',
          zIndex: 2,
          color: 'black',
          textShadow: '0 0 3px white, 0 0 6px white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: 2,
          padding:{xs:1, md:2},
          width: '100%',
          maxWidth:{sx:'100%', md:'60%'},
          height:{sx:'50%', md:'100%'},
          //bgcolor: 'rgba(255, 255, 255, 0.272)',
          borderRadius:4,
        }}
      >
        <EspecialidadTitulo titulo={especialidad.tituloComercial} />

        <CarrerasBlock carreras={carrerasConCodigo} />
        <ModularesBlock modulares={modularesSueltos} />
      </Box>

      {/* Imagen flotante inferior */}
      <PortadaImagen portada={especialidad.portada} />
    </Box>
  );
}
