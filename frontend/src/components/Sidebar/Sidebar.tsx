// src/components/Sidebar.tsx

import SidebarUserInfo from "../Sidebar/SidebarUserInfo";
import AcordionGeneral from "./AcordionGeneral";
import { SwipeableDrawer, Box } from "@mui/material";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void; // necesario para SwipeableDrawer
}

export default function Sidebar({ open, onClose, onOpen = () => { } }: SidebarProps) {
  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      disableBackdropTransition={false}
      disableDiscovery={false}
      disableSwipeToOpen={true}        // ✅ Desactiva deslizamiento desde borde
      swipeAreaWidth={0}               // ✅ Elimina zona sensible en el borde
      transitionDuration={250}
      hysteresis={0.4} // Más sensible al deslizamiento
      sx={{
        "& .MuiDrawer-paper": {
          width: 300,
          boxSizing: "border-box",
        },
      }}
    >
      <Box>
        <SidebarUserInfo />
        <AcordionGeneral />
      </Box>
    </SwipeableDrawer>
  );
}
