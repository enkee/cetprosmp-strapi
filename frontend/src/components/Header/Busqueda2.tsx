// src/components/Busqueda.tsx

import React, { useRef, useState } from "react";
import {
  IconButton,
  Popper,
  Box,
  TextField,
  Button,
  ClickAwayListener,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Busqueda = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBuscar = () => {
    console.log("Buscar:", query);
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      {/* Contenedor que referencia el botón y ancla el Popper */}
      <Box ref={anchorRef} sx={{ display: "inline-block" }}>
        {/* Botón de búsqueda */}
        <IconButton color="inherit" onClick={handleToggle}>
          <SearchIcon />
        </IconButton>

        {/* Menú flotante tipo Popper */}
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-end"
          modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
        >
          {/* Contenido del popper */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
              minWidth: 280,
              display: "flex",
              gap: 1,
              alignItems: "center",
              bgcolor: "background.paper",
            }}
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={handleBuscar}>
              Buscar
            </Button>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default Busqueda;
