'use client';

import { Typography } from '@mui/material';

export default function EspecialidadTitulo({ titulo }: { titulo: string }) {
  return (
    <Typography
      variant="h4"
      fontWeight="bold"
      textAlign="center"
      sx={{
          variant: {xs:'h4', md:'h3'},
          textAlign: {xs:'center', md:'left'},
          fontSize: 'clamp(2rem, 5vw, 3rem)',
      }}
    >
      {titulo}
    </Typography>
  );
}
