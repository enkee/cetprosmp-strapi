'use client';

import { Box, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Especialidad } from './CarruselPortada';

export default function CarrerasBlock({ carreras }: { carreras: Especialidad['carreras'] }) {
  if (carreras.length === 0) return null;

  return (
    <Box
      sx={{
        textAlign: 'left',
        width: '100%',
        maxWidth: '600px',
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Carreras Técnicas
      </Typography>
      {carreras.map(carrera => (
        <Box key={carrera.id}>
          <Typography variant="h6" sx={{ pl: 1.5 }}>
            {carrera.tituloComercial}
          </Typography>
          <Box pl={2}>
            {carrera.modulos.map(mod => (
              <Box
                key={mod.id}
                sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.7, mb: 0.5 }}
              >
                <FiberManualRecordIcon
                  sx={{ fontSize: 8, mt: '6px', alignSelf: 'flex-start' }}
                />
                <Typography variant="body2">{mod.tituloComercial}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
