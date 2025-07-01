import { Box, Button, styled } from "@mui/material";
import CarrerasMenuWrapper from "./CarrerasMenuWrapper3";

const MenuBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "none",
  justifyContent: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",

  [theme.breakpoints.up("md")]: {
    display: "flex",
    "& button": {
      display: "inline-flex",
      alignitems: "flex-end",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: 0,
      paddingBottom: 0,
      minWidth: "auto",
      height: "1.2rem",
      transform: 'translateY(2px)'
    },
  },

  [theme.breakpoints.up("lg")]: {
    "& button": {
      display: "inline-flex",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      height: "1.2rem",
      transform: 'translateY(2px)'
    },
  },
}));


export default function MenuPrincipal() {
  return (
    <MenuBox>
      <Button color="inherit">Inicio</Button>

      {/* Botón Carreras con referencia */}
      <CarrerasMenuWrapper />

      <Button color="inherit">Nosotros</Button>
      <Button color="inherit">Novedades</Button>
      <Button color="inherit">Matrícula</Button>
    </MenuBox>
  );
}
