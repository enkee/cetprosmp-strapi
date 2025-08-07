'use client';

import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BotonInscripcion from '@/components/Generales/BotonInscripcion';
import PortadaImagen from './PortadaImagen';


export default function CarruselBienvenidaSlide() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fondoDefault = process.env.NEXT_PUBLIC_DEFAULT_BACKGROUND_URL;
  const portadaDefault = process.env.NEXT_PUBLIC_DEFAULT_IMG_URL!;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: isMobile ? 'calc(100vh - 48px)' : 500,
        aspectRatio: isMobile ? 'auto' : '2.4',
        backgroundImage: `url(${fondoDefault})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? 2 : 4,
      }}
    >
      {/* Texto principal */}
      <Box
        sx={{
          //flex: 1,
          color: 'black',
          height: '100%',
          maxHeight: {xs:'60%', md:'43%'},
          textShadow: '0 0 3px white, 0 0 6px white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center' ,
          gap: 2,
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        <Typography variant={isMobile ? 'h4' : 'h3'}  fontWeight="bold">
          Bienvenido al CETPRO de<br />"SAN MARTIN DE PORRES"
        </Typography>
        <Typography variant={isMobile ? 'h6' : 'body1'}>
          Formando Técnicos Emprendedores
        </Typography>
        <BotonInscripcion />
      </Box>

      {/* Imagen de portada predeterminada */}
      {/*<Box
        sx={{
          width: isMobile ? '80%' : '40%',
          maxWidth: 400,
          alignSelf: 'center',
          position: 'relative',
          aspectRatio: '3/4',
          mt: isMobile ? 2 : 0,
        }}
      >
        <Image
          src={portadaDefault}
          alt="Portada bienvenida"
          fill
          style={{ objectFit: 'contain' }}
        />
      </Box>*/}
      <PortadaImagen portada={portadaDefault} sx={{maxHeight: {sm:'57%'}}}/>
    </Box>
  );
}
