import { useState } from "react";
//import { Box, CssBaseline, Toolbar } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; //Router
//Pages
import Home from "./pages/Home";
import Publicaciones from "./pages/Publicaciones";
//Components
//import AppBarHeader from "./components/AppBarHeader";
//import SideMenu from "./components/SideMenu";
//import Noticias from "./components/Noticias";
import { UserProvider } from './context/UserContext';


function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
    <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publicaciones" element={<Publicaciones />} />
        </Routes>
    </UserProvider>
{/* 
      <CssBaseline />
      <AppBarHeader onMenuClick={handleDrawerToggle} />
    
      <SideMenu
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
        onOpen={() => {}}
      />
      <Box component="main" sx={{ flex: "1 0 calc(100% - 300px)", p: 3 }}>
        <Toolbar />
        <Noticias />
      </Box>
*/}      
    </>
  );
}

export default App;
