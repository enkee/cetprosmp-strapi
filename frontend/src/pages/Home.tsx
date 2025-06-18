// src/pages/Home.tsx
import { Box, Typography } from '@mui/material';
import Header from '../components/Header/Header';

export default function HomePage() {
  return (
    <Box>
      <Header />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>Bienvenido a la Página de Inicio</Typography>
        <Typography>Este es el contenido principal de tu página.</Typography>
      </Box>
    </Box>
  );
}
