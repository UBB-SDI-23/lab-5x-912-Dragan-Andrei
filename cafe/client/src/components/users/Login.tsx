// material ui
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// react components
import MainNavbar from "../MainNavbar";

// utils
import AuthContext from "../../context/AuthContext";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import jwt_decode from "jwt-decode";

// css
import "../../assets/css/users/login.css";

// create a local model for the user to be logged in
interface LocalUser {
  username: string;
  password: string;
}

// create a local error object model
interface LocalError {
  generic: string;
  username: string;
  password: string;
}

// create a local model for the touched fields
interface TouchedFields {
  username: boolean;
  password: boolean;
}

const Login = () => {
  const [localUser, setLocalUser] = useState<LocalUser>({
    username: "",
    password: "",
  });

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    username: false,
    password: false,
  });

  const [localError, setLocalError] = useState<LocalError>({
    generic: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const contextData = useContext<any>(AuthContext);

  // every time the localUser state changes, validate the data
  useEffect(() => {
    validateLoginData();
  }, [localUser]);

  // validate the login data
  const validateLoginData = () => {
    // validate the username
    if (localUser.username.length == 0) {
      setLocalError((prevError) => ({ ...prevError, username: "Username is required" }));
    } else {
      setLocalError((prevError) => ({ ...prevError, username: "" }));
    }

    // validate the password
    if (localUser.password.length < 8) {
      setLocalError((prevError) => ({ ...prevError, password: "Password must be at least 8 characters long" }));
    } else if (!localUser.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z@$!%*?&]+$/)) {
      setLocalError((prevError) => ({
        ...prevError,
        password: "Password must contain one uppercase letter, one lowercase letter, and one special character",
      }));
    } else {
      setLocalError((prevError) => ({ ...prevError, password: "" }));
    }
  };

  const login = async () => {
    // touch all the fields so that the errors show up
    setTouchedFields((prevTouched) => ({
      ...prevTouched,
      username: true,
      password: true,
    }));

    // validate the data
    validateLoginData();

    // if there are any errors, return
    if (localError.username || localError.password) {
      return;
    }

    // send the post request to the server
    try {
      const response = await axios.post(`${BASE_URL_API}/token/`, {
        username: localUser.username,
        password: localUser.password,
      });

      const data = await response.data;
      const user: any = jwt_decode(data.access);

      if (user.is_active) {
        contextData.setAuthTokens(data);
        contextData.setUser(user);
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/coffees");
      } else {
        setLocalError((prevError) => ({
          ...prevError,
          generic: "Your account is not active! Please contact the administrator!",
        }));
      }
    } catch (error: any) {
      if (error.response.data.username) {
        setLocalError((prevError) => ({
          ...prevError,
          username: error.response.data.username,
        }));
      } else if (error.response.data.password) {
        setLocalError((prevError) => ({
          ...prevError,
          password: error.response.data.password,
        }));
      } else if (error.response.data.detail) {
        setLocalError((prevError) => ({
          ...prevError,
          generic: error.response.data.detail,
        }));
      } else {
        setLocalError((prevError) => ({
          ...prevError,
          generic: "Something went wrong! Try again later!",
        }));
      }
    }
  };

  return (
    <>
      <MainNavbar />
      <Container className="login-user-container">
        <Container className="login-user-content" sx={{ minHeight: "calc(100vh - 160px)" }}>
          <Typography variant="h1" className="login-user-big-header" sx={{ mt: 10, mb: 2 }}>
            Welcome back!
          </Typography>

          <>
            {localError.generic && (
              <Typography variant="body2" sx={{ color: "#e64545", mb: 4, marginLeft: "4px" }}>
                {localError.generic}
              </Typography>
            )}

            <Box className="login-user-fields">
              <TextField
                label="Username"
                variant="outlined"
                value={localUser.username}
                onChange={(e) => setLocalUser((prevUser) => ({ ...prevUser, username: e.target.value }))}
                className="login-user-field"
                error={localError.username && touchedFields.username ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    username: true,
                  }))
                }
                helperText={localError.username && touchedFields.username && localError.username}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={localUser.password}
                onChange={(e) => setLocalUser((prevUser) => ({ ...prevUser, password: e.target.value }))}
                className="login-user-field"
                error={localError.password && touchedFields.password ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    password: true,
                  }))
                }
                helperText={localError.password && touchedFields.password && localError.password}
              />
            </Box>

            <Button
              onClick={() => login()}
              variant="contained"
              className="login-user-button"
              sx={{
                boxShadow: 4,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              Login
            </Button>
          </>
        </Container>
      </Container>
    </>
  );
};

export default Login;
