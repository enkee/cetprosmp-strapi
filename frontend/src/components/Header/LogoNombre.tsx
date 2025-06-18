import { Box } from '@mui/material';

export default function LogoNombre() {
  return (
    <Box sx={{ width: '227px', height: '56px', display: 'flex', alignItems: 'center' }}>
      <img src="/logo-smp.svg" alt="logo" style={{ height: 56, marginRight: 8 }} />
      <img src="/nombre-smp.svg" alt="nombre" style={{ height: 40, marginRight: 8 }} />
    </Box>
  );
}
