// css
import { Box } from "@mui/material";
import "../assets/css/expandedNavbar.css";

// utils
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  openNav: () => void;
  closeNav: () => void;
}

const ExpandedNavbar = ({ openNav, closeNav, ...otherProps }: NavbarProps) => {
  const contextData = useContext<any>(AuthContext);
  const navigate = useNavigate();

  return (
    <section id="navbar">
      <div id="navbar_background"></div>

      <div id="navbar_links">
        <Link onClick={() => closeNav()} to="/">
          Home
        </Link>
        <Link onClick={() => closeNav()} to="/coffees">
          Menu
        </Link>
        <Link onClick={() => closeNav()} to="/locations">
          Locations
        </Link>
        <Link onClick={() => closeNav()} to="/blends">
          Blends
        </Link>

        {contextData.user && contextData.user.is_superuser && (
          <>
            <Link onClick={() => closeNav()} to="/users">
              Users
            </Link>

            <Link onClick={() => closeNav()} to="/scripts">
              Config
            </Link>
          </>
        )}

        {contextData.user && (
          <Box onClick={() => navigate(`/profile/${contextData.user.username}`)}>
            <Link onClick={() => closeNav()} to="/blends">
              Profile
            </Link>
          </Box>
        )}

        <div id="navbar-action-buttons">
          {!contextData.authTokens ? (
            <>
              <Link onClick={() => closeNav()} id="action-button" to="/register">
                Register
              </Link>
              <Link onClick={() => closeNav()} id="action-button" to="/login">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link id="action-button" to="/" onClick={contextData.logoutUser}>
                Logout
              </Link>
            </>
          )}
        </div>
      </div>

      <div id="close_button" onClick={closeNav}>
        <div id="close_navbar_line1"></div>
        <div id="close_navbar_line2"></div>
      </div>
    </section>
  );
};

export default ExpandedNavbar;
