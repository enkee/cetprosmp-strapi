import { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import AppBarHeader from "./components/AppBarHeader";
import SideMenu from "./components/SideMenu";
import Noticias from "./components/Noticias";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <CssBaseline />
      <AppBarHeader onMenuClick={handleDrawerToggle} />
      {/*<Box sx={{ display: "flex", backgroundColor: "red" }}>*/}
        <SideMenu
          mobileOpen={mobileOpen}
          onClose={handleDrawerToggle}
          onOpen={() => {}}
        />
        <Box component="main" sx={{ flex: '1 0 calc(100% - 300px)', p: 3 }}>
          <Toolbar />
          <Noticias />
        </Box>
      {/*</Box>*/}
    </>
  );
}

export default App;
