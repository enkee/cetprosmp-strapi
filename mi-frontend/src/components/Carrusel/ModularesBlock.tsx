'use client';

import { Box, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Modulo } from './CarruselPortada'; // Asegúrate de importar el tipo

type Props = {
  modulares: Modulo[];
};

export default function ModularesBlock({ modulares }: Props) {
  if (modulares.length === 0) return null;

  return (
    <Box 
      sx={{
        textAlign: 'left',//{xs: 'center', sm: 'left'}
        width: '100%',
        maxWidth:'600px',
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Cursos Modulares
      </Typography>
      <Box pl={2}>
        {modulares.map((modulo) => (
          <Box
            key={modulo.id}
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.7, mb: 0.5 }}
          >
            <FiberManualRecordIcon 
            sx={{ fontSize: 8, mt: '6px', alignSelf: 'flex-start'}}
            />
            <Typography variant="body2">{modulo.tituloComercial}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
