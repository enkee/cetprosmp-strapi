'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import PersonalCard from './PersonalCard';
import type { Personal } from '@/types/personal';

interface Props {
  personal: Personal[];
}

const ListaPersonal: React.FC<Props> = ({ personal }) => {
  if (personal.length === 0) {
    return <Typography>No hay personal registrado.</Typography>;
  }

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      {personal.map((p) => (
        <Box key={p.id} sx={{ width: '100%' }}>
          <PersonalCard {...p} />
        </Box>
      ))}
    </Stack>
  );
};

export default ListaPersonal;
