// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// react components
import MainNavbar from "./MainNavbar";

// utils
import { useNavigate } from "react-router-dom";

// css
import "../assets/css/notFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <MainNavbar />
      <Container className="not-found-page" sx={{ minHeight: "calc(100vh - 160px)" }}>
        <Typography variant="h1" className="not-found-page-header" sx={{ mt: 10, mb: 2 }}>
          Oops! You shouldn't be here!
        </Typography>
        <Button variant="contained" className="navigate-button" onClick={() => navigate("/")}>
          Take me home
        </Button>
      </Container>
    </>
  );
};

export default NotFound;
