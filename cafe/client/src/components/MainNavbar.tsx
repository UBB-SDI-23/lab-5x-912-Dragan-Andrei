// material ui
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

// css
import "../assets/css/mainNavbar.css";

// images
import simpleLogo from "../assets/images/logo_white_simple_version.png";
import expandedLogo from "../assets/images/top_part_logo.png";

// navigation bar pages
const pages = ["HOME", "MENU", "CONTACT", "LOCATIONS"];

// utils
import { useState } from "react";
import { Link } from "react-router-dom";

// react components
import ExpandedNavbar from "./ExpandedNavbar";

const MainNavbar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const openNav = () => {
    setIsNavbarOpen(true);
  };

  const closeNav = () => {
    setIsNavbarOpen(false);
  };

  return (
    <>
      {isNavbarOpen ? <ExpandedNavbar openNav={openNav} closeNav={closeNav} /> : null}

      <AppBar position="static" sx={{ bgcolor: "#be9063", height: "80px" }} elevation={6}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: "80px" }}>
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
              <img src={simpleLogo} alt="logo" height="30px" />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} onClick={openNav}>
              <div id="open_nav" onClick={() => openNav()}>
                <div id="line1"></div>
                <div id="line2"></div>
                <div id="line1"></div>
              </div>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" }, mr: 0 }}>
              <img src={expandedLogo} alt="logo" height="40px" />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <div id="navbar_links">
                <Link to="/">Home</Link>
                <Link to="/coffees">Menu</Link>
                <Link to="/">About</Link>
                <Link to="/locations">Locations</Link>
                <Link to="/">Contact</Link>
              </div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default MainNavbar;
