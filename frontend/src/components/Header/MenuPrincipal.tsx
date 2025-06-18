import { Box, Button } from '@mui/material';

export default function MenuPrincipal() {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
      <Button color="inherit">Inicio</Button>
      <Button color="inherit">Carreras</Button>
      <Button color="inherit">Nosotros</Button>
      <Button color="inherit">Noticias</Button>
      <Button color="inherit">Matrícula</Button>
    </Box>
  );
}
