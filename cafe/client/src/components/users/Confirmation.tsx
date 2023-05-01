// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// react components
import MainNavbar from "../MainNavbar";

// utils
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";

// css
import "../../assets/css/users/confirmation.css";

const Confirmation = () => {
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const fullConfirmationCode = code;

  useEffect(() => {
    if (fullConfirmationCode) {
      const splitConfirmationCode = fullConfirmationCode.split("-");
      if (splitConfirmationCode[0]) setConfirmationCode(splitConfirmationCode[0]);
      if (splitConfirmationCode[1]) setUsername(splitConfirmationCode[1]);
    }
  }, [fullConfirmationCode]);

  const activateUser = async () => {
    if (!username || !confirmationCode) {
      setFeedback("Invalid confirmation link! Please try again.");
      return;
    }
    try {
      await axios.get(`${BASE_URL_API}/register/confirm?username=${username}&confirmation_code=${confirmationCode}`);
      setFeedback("Your account has been activated. You can now log in.");
      setSuccess(true);
    } catch (error: any) {
      setFeedback(error.response.data.message || error);
    }
  };

  useEffect(() => {
    activateUser();
  }, [username, confirmationCode]);

  return (
    <>
      <MainNavbar />
      <Container className="activate-user-container" sx={{ minHeight: "calc(100vh - 160px)" }}>
        {feedback ? (
          <Typography variant="h1" className="activate-user-feedback" sx={{ mt: 10, mb: 2 }}>
            {feedback}
          </Typography>
        ) : (
          <Typography variant="h1" className="activate-user-feedback" sx={{ mt: 10, mb: 2 }}>
            Loading
          </Typography>
        )}

        {success && (
          <Button variant="contained" className="navigate-button" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Container>
    </>
  );
};

export default Confirmation;
