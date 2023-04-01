// material UI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

// css
import "./assets/css/mainNavbar.css";

// images
import simpleLogo from "./assets/images/logo_white_simple_version.png";
import expandedLogo from "./assets/images/top_part_logo.png";

// navigation bar pages
const pages = ["HOME", "MENU", "CONTACT", "LOCATIONS"];

// utils
import { useState } from "react";
import { Link } from "react-router-dom";

// react component
import HomeNavbar from "./ExpandedNavbar";

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
      {isNavbarOpen ? (
        <HomeNavbar openNav={openNav} closeNav={closeNav} />
      ) : null}

      <AppBar
        position="static"
        sx={{ bgcolor: "#be9063", boxShadow: 0, height: "80px" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: "80px" }}>
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
              <img src={simpleLogo} alt="logo" height="30px" />
            </Box>

            <Box
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
              onClick={openNav}
            >
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
                <Link to="/menu">Menu</Link>
                <Link to="/">About</Link>
                <Link to="/">Location</Link>
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
