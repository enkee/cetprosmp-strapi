// src/components/User.tsx
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Popper,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

export default function User() {
  const { user, setUser, logout } = useUser();
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Referencia para anclar el Popper al botón Avatar
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const resGoogle = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const googleUser = resGoogle.data;

        const resStrapi = await axios.post(
          "http://localhost:1337/api/google-sync",
          {
            email: googleUser.email,
            name: {
              givenName: googleUser.given_name,
              familyName: googleUser.family_name,
            },
            picture: googleUser.picture,
          }
        );

        const { user: userData, token } = resStrapi.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("jwt", token);
      } catch (error) {
        console.error("❌ Error en login o sincronización:", error);
      }
    },
    onError: () => console.error("❌ Error al iniciar sesión con Google"),
    flow: "implicit",
  });

  if (!isMounted) return null;

  return (
    <>
      {user ? (
        <ClickAwayListener onClickAway={handleClose}>
          <Box ref={anchorRef} sx={{ display: "inline-block" }}>
            {/* Botón con avatar del usuario */}
            <IconButton onClick={handleToggle} color="inherit">
              <Avatar
                alt={user.nombre || user.nombres || "Usuario"}
                src={user.avatar}
                sx={{ width: 32, height: 32 }}
                imgProps={{ referrerPolicy: "no-referrer" }} // <- solución clave
              />
            </IconButton>

            {/* Menú flotante con Popper */}
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              placement="bottom-end"
              modifiers={[
                {
                  name: "offset",
                  options: {
                    offset: [0, 8],
                  },
                },
              ]}
            >
              <Box
                sx={{
                  width: 320,
                  borderRadius: 6,
                  mt:-0.5,
                  padding: 2,
                  backgroundColor: "#fff",
                  color: "rgba(0, 0, 0, 0.87)",
                  position: "relative",
                  boxShadow: 3,
                }}
              >
                {/* Botón Cerrar */}
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    color: "rgba(0, 0, 0, 0.87)",
                    backgroundColor: "rgba(255, 255, 255, 0.514)",
                    "&:hover": {
                      backgroundColor: "rgba(228, 228, 228, 0.523)",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                {/* Correo y rol */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(0, 0, 0, 0.87)",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {user.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0, 0, 0, 0.87)", mb: 3, textAlign: "center" }}
                >
                  {user.cargo || "—"}
                </Typography>

                {/* Avatar, saludo y nombre */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mb={2}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.nombre || user.nombres}
                    sx={{ width: 64, height: 64, mb: 1 }}
                    imgProps={{ referrerPolicy: "no-referrer" }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    ¡Hola, {user.nombre || user.nombres}!
                  </Typography>
                </Box>

                {/* Botón para cuenta */}
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="outlined"
                    href="https://accounts.google.com/AccountChooser?continue=https://myaccount.google.com"
                    target="_blank"
                    sx={{
                      borderRadius: 999,
                      textTransform: "none",
                      borderColor: "rgba(0, 0, 0, 0.87)",
                      color: "rgba(0, 0, 0, 0.87)",
                      "&:hover": {
                        backgroundColor: "rgba(176, 176, 176, 0.208)",
                        borderColor: "#6a6a6a87",
                      },
                    }}
                  >
                    Administrar tu Cuenta de Google
                  </Button>
                </Box>

                {/* Botón cerrar sesión */}
                <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap">
                  <Button
                    onClick={() => {
                      logout();
                      handleClose();
                    }}
                    variant="text"
                    startIcon={<LogoutIcon />}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "none",
                      opacity: 0.8,
                      marginBottom: 2,
                      borderRadius: 999,
                      backgroundColor: "#1076dc",
                      color: "white",
                      px: "16px",
                      "&:hover": {
                        backgroundColor: "#0051a1",
                        borderColor: "#fff",
                      },
                    }}
                  >
                    Cerrar sesión
                  </Button>

                  {/* Divisor */}
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 1 }} />

                  {/* Footer */}
                  <Box
                    sx={{
                      display: "flex !important",
                      justifyContent: "space-around !important",
                      width: "100%",
                      "& .miTexto": {
                        fontSize: 12,
                        color: "rgb(0, 0, 0)",
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Typography className="miTexto">
                      Política de Privacidad
                    </Typography>
                    <Typography className="miTexto">
                      Condiciones del Servicio
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Popper>
          </Box>
        </ClickAwayListener>
      ) : (
        <Button
          onClick={() => login()}
          sx={{
            backgroundColor: "#cceeff",
            color: "black",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "999px",
            paddingX: 1.2,
            ml:"8px",
            paddingY: 0.5,
            whiteSpace: "nowrap",
            minWidth: "auto",
            letterSpacing: "0",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#b3e6ff",
              boxShadow: "none",
            },
          }}
        >
          Iniciar sesión
        </Button>
      )}
    </>
  );
}
