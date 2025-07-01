import { Box } from '@mui/material';


export default function LogoNombre() {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', width: 'auto', whiteSpace: 'nowrap', px: 1 }}>
      <Box component="img" src="/logo-smp.svg" alt="logo" sx={{ height:{xs:'40px',md:'56px'}, mr: 1 }} />
      <Box component="img" src="/nombre-smp.svg" alt="nombre" sx={{ display: { xs: 'none', md: 'inline' }, height: '40px' }} />
      <Box component="img" src="/nombre-smp2.svg" alt="nombre" sx={{ display: { xs: 'inline', md: 'none' }, height: '16px' }} />
    </Box>
  );
}
