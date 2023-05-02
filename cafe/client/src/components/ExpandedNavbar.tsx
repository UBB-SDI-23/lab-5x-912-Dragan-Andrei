// css
import "../assets/css/expandedNavbar.css";

// utils
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  openNav: () => void;
  closeNav: () => void;
}

const ExpandedNavbar = ({ openNav, closeNav, ...otherProps }: NavbarProps) => {
  const contextData = useContext<any>(AuthContext);

  return (
    <section id="navbar">
      <div id="navbar_background"></div>

      <div id="navbar_links">
        <Link to="/">Home</Link>
        <Link to="/coffees">Menu</Link>
        <Link to="/">About</Link>
        <Link to="/locations">Locations</Link>
        <Link to="/blends">Blends</Link>

        <div id="navbar-action-buttons">
          {!contextData.authTokens ? (
            <>
              <Link id="action-button" to="/register">
                Register
              </Link>
              <Link id="action-button" to="/login">
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
