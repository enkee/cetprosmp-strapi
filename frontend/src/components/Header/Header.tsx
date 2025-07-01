import React, { useState } from "react";
import { useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoNombre from "./LogoNombre";
import MenuPrincipal from "./MenuPrincipal/MenuPrincipal";
import Busqueda from "./Busqueda2"; // ⬅️ nuevo import
import Apps from "./Apps2";
import Settings from "./Settings2";
import User from "./User2";
import Sidebar from "../Sidebar/Sidebar";
import { useUser } from "../../context/UserContext";

export default function Header() {
  //variables del sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // pantallas pequeñas
  const { user } = useUser();

  //Sidebar oculto y cerrado en pantallas grandes
  useEffect(() => {
    if (!isSmallScreen && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isSmallScreen, sidebarOpen]);


  return (
    <>
      <AppBar position="static" sx={{ height: { xs: "48px", md: "64px" }, backgroundColor: "#1976d2", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Toolbar disableGutters sx={{ px: { xs: 1, md: 2 }, minHeight: "auto !important", width: "100%", maxHeight: "auto", maxWidth: "1200px", display: "flex", alignItems: "center", boxSizing: "border-box", justifyContent: "space-between" }}>
          {/* Botón menú hamburguesa solo visible en pantallas pequeñas */}
          {isSmallScreen && (
            <IconButton color="inherit" aria-label="menu"
              onClick={() => setSidebarOpen(true)}
              edge="start"
              sx={{ ml: "0px" }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* LogoNombre centrado solo en pantallas pequeñas */}
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <LogoNombre />
          </Box>

          {/* MenuPrincipal solo en desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <MenuPrincipal />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}>
            <Busqueda />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Settings />
            </Box>
            {/* Apps solo con usuarios autenticados */}
            {user && (
              // Apps solo en desktop
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Apps />
              </Box>
            )}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <User />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>


      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onOpen={() => { }} />

    </>
  );
}
