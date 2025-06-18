import { Avatar, Button, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useUser } from '../../../context/UserContext';

export default function User() {
  const { user, setUser, logout } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Componente ya montado
  }, []);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const data = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    },
    onError: () => console.error("❌ Error al iniciar sesión con Google"),
    flow: 'implicit',
  });

  // ⛔️ Mientras no está montado, no mostrar nada
  if (!isMounted) return null;

  return (
    <>
      {user ? (
        <>
          <IconButton onClick={handleOpen} color="inherit">
            <Avatar
              alt={user.name}
              src={user.picture}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem disabled>{user.name}</MenuItem>
            <MenuItem onClick={() => { logout(); handleClose(); }}>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button variant="contained" color="inherit" onClick={() => login()}>
          Iniciar sesión
        </Button>
      )}
    </>
  );
}
