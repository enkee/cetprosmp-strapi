import { AppBar, Box, Toolbar } from '@mui/material';
import LogoNombre from './LogoNombre';
import MenuPrincipal from './MenuPrincipal';
import UserSettings from './UserSettings/UserSettings';

export default function Header() {
  return (
    <Box>
      <AppBar position="static" sx={{ height: '64px', justifyContent: 'center', backgroundColor: '#1976d2' }}>
        <Toolbar sx={{ minHeight: '50px', width: '1000px', margin: '0 auto', padding: 0 }}>
          <LogoNombre />
          <MenuPrincipal />
          <UserSettings />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
