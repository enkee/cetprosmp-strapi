// src/components/CarrerasMenuWrapper.tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Paper, Popper } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

// Tipos de datos
type Modulo = { id: number; tituloComercial: string };
type Carrera = {
  id: number;
  tituloComercial: string;
  codigo: string | null;
  duracion: number;
  modulos: Modulo[];
};
type Especialidad = {
  id: number;
  tituloComercial: string;
  carreras: Carrera[];
};

export default function CarrerasMenuWrapper() {
  const anchoMenu = "256px";

  // Estados principales
  const [open, setOpen] = useState(false);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [carreras, setCarreras] = useState<Carrera[] | null>(null);
  const [modulosSueltos, setModulosSueltos] = useState<Modulo[] | null>(null);
  const [modulos, setModulos] = useState<Modulo[] | null>(null);

  // Referencias para posicionamiento de poppers
  const [anchorCarrera, setAnchorCarrera] = useState<HTMLElement | null>(null);
  const [anchorModulo, setAnchorModulo] = useState<HTMLElement | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carga inicial del JSON
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data/carreras.json");
      const data: Especialidad[] = await res.json();

      // Ordenar todo por ID ascendente
      const sortedData = data
        .sort((a, b) => a.id - b.id)
        .map((esp) => ({
          ...esp,
          carreras: esp.carreras
            .sort((a, b) => a.id - b.id)
            .map((car) => ({
              ...car,
              modulos: car.modulos.sort((a, b) => a.id - b.id),
            })),
        }));

      setEspecialidades(sortedData);
    };

    fetchData();
  }, []);

  // Control de cierre automático
  const startCloseTimer = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setCarreras(null);
      setModulosSueltos(null);
      setModulos(null);
      setAnchorCarrera(null);
      setAnchorModulo(null);
    }, 150);
  };

  const cancelCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Al pasar sobre una especialidad: mostrar sus carreras válidas + módulos sueltos
  const handleEspecialidadEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    carreras: Carrera[]
  ) => {
    setAnchorCarrera(e.currentTarget);

    // Separar carreras con código (válidas) y sin código (solo módulos)
    const carrerasConCodigo = carreras.filter((car) => car.codigo !== null);
    const carrerasSinCodigo = carreras.filter((car) => car.codigo === null);

    // Agrupar módulos sueltos de carreras sin código
    const modulos = carrerasSinCodigo
      .flatMap((car) => car.modulos)
      .sort((a, b) => a.id - b.id);

    setCarreras(carrerasConCodigo);
    setModulosSueltos(modulos.length > 0 ? modulos : null);
    setModulos(null);
  };

  // Al pasar sobre una carrera válida: mostrar sus módulos
  const handleCarreraEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    modulos: Modulo[]
  ) => {
    setAnchorModulo(e.currentTarget);
    setModulos(modulos);
  };

  return (
    <Box
      sx={{ lineHeight: "0px" }}
      ref={wrapperRef}
      onMouseEnter={() => {
        cancelCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={startCloseTimer}
    >
      {/* Botón principal */}
      <Button color="inherit" ref={anchorRef}>
        Carreras
      </Button>

      {/* Menú de especialidades */}
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start">
        <Paper sx={{ width: anchoMenu, mt: 1, ml: -20 }}>
          {especialidades.map((esp) => (
            <Box
              key={esp.id}
              onMouseEnter={(e) => handleEspecialidadEnter(e, esp.carreras)}
              sx={{
                px: 2,
                py: 1,
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#eee" },
              }}
            >
              <Typography noWrap>{esp.tituloComercial}</Typography>
              <ArrowRightIcon fontSize="small" />
            </Box>
          ))}
        </Paper>
      </Popper>

      {/* Submenú de carreras con código + módulos sueltos */}
      <Popper open={Boolean(carreras)} anchorEl={anchorCarrera} placement="right-start">
        <Paper sx={{ width: anchoMenu, ml:-1 }}>
          {/* Carreras válidas */}
          {carreras?.map((car) => (
            <Box
              key={car.id}
              onMouseEnter={(e) => handleCarreraEnter(e, car.modulos)}
              sx={{
                px: 2,
                py: 1,
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#eee" },
              }}
            >
              <Typography>{car.tituloComercial}</Typography>
              <ArrowRightIcon fontSize="small" />
            </Box>
          ))}

          {/* Módulos sueltos */}
          {modulosSueltos?.map((mod) => (
            <Box
              key={mod.id}
              sx={{
                px: 2,
                py: 1,
                cursor: "default",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <Typography>{mod.tituloComercial}</Typography>
            </Box>
          ))}
        </Paper>
      </Popper>

      {/* Submenú de módulos al pasar sobre una carrera */}
      <Popper open={Boolean(modulos)} anchorEl={anchorModulo} placement="right-start">
        <Paper sx={{ width: anchoMenu, ml:-1 }}>
          {modulos?.map((mod) => (
            <Box
              key={mod.id}
              sx={{
                px: 2,
                py: 1,
                cursor: "default",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <Typography>{mod.tituloComercial}</Typography>
            </Box>
          ))}
        </Paper>
      </Popper>
    </Box>
  );
}
