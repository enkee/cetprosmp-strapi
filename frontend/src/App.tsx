import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; //Router
//Pages
import Home from "./pages/Home";
import Publicaciones from "./pages/Publicaciones";
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
    </>
  );
}

export default App;
