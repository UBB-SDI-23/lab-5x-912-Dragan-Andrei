// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// css
import "../../assets/css/locations/addLocation.css";

// utils
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { BASE_URL_API } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import BadWords from "bad-words";

// react components
import MainNavbar from "../MainNavbar";
import { Box } from "@mui/material";

// images
import supportImage from "../../assets/images/create_location.jpg";

// create a new LocalLocation objecet model for the add location form
interface LocalLocation {
  name: string;
  address: string;
  city: string;
  postal_code: string;
  profit: string;
  description: string;
}

// create an error object model
interface LocalError {
  generic: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  profit: string;
  description: string;
}

// create a model for the touched fields
interface TouchedFields {
  name: boolean;
  address: boolean;
  city: boolean;
  postal_code: boolean;
  profit: boolean;
  description: boolean;
}

const AddLocation = () => {
  const [localLocation, setLocalLocation] = useState<LocalLocation>({
    name: "",
    address: "",
    city: "",
    postal_code: "",
    profit: "",
    description: "",
  });

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    name: false,
    address: false,
    city: false,
    postal_code: false,
    profit: false,
    description: false,
  });

  const [localError, setLocalError] = useState<LocalError>({
    generic: "",
    name: "",
    address: "",
    city: "",
    postal_code: "",
    profit: "",
    description: "",
  });

  const navigate = useNavigate();
  const contextData = useContext<any>(AuthContext);

  // every time the localLocation state changes, validate the data
  useEffect(() => {
    validateLocationData();
  }, [localLocation]);

  // function to validate the location data
  const validateLocationData = () => {
    // validate the name
    if (localLocation.name === "") {
      setLocalError((prevError) => ({
        ...prevError,
        name: "Name is required",
      }));
    } else if (localLocation.name.length > 50) {
      setLocalError((prevError) => ({
        ...prevError,
        name: "Name cannot be longer than 50 characters",
      }));
    } else if (new BadWords().isProfane(localLocation.name)) {
      setLocalError((prevError) => ({
        ...prevError,
        name: "Name cannot contain profanity",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        name: "",
      }));
    }

    // validate the address
    if (localLocation.address === "") {
      setLocalError((prevError) => ({
        ...prevError,
        address: "Address is required",
      }));
    } else if (localLocation.address.length > 1000) {
      setLocalError((prevError) => ({
        ...prevError,
        address: "Address cannot be longer than 1000 characters",
      }));
    } else if (new BadWords().isProfane(localLocation.address)) {
      setLocalError((prevError) => ({
        ...prevError,
        address: "Address cannot contain profanity",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        address: "",
      }));
    }

    // validate the city
    if (localLocation.city === "") {
      setLocalError((prevError) => ({
        ...prevError,
        city: "City is required",
      }));
    } else if (localLocation.city.length > 1000) {
      setLocalError((prevError) => ({
        ...prevError,
        city: "City cannot be longer than 1000 characters",
      }));
    } else if (new BadWords().isProfane(localLocation.city)) {
      setLocalError((prevError) => ({
        ...prevError,
        city: "City cannot contain profanity",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        city: "",
      }));
    }

    // validate the postal code
    if (localLocation.postal_code === "") {
      setLocalError((prevError) => ({
        ...prevError,
        postal_code: "Postal code is required",
      }));
    } else if (localLocation.postal_code.length !== 5) {
      setLocalError((prevError) => ({
        ...prevError,
        postal_code: "Postal code must be 5 characters long",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        postal_code: "",
      }));
    }

    // validate the profit
    if (localLocation.profit === "") {
      setLocalError((prevError) => ({
        ...prevError,
        profit: "Profit is required",
      }));
    } else if (!Number(localLocation.profit)) {
      setLocalError((prevError) => ({
        ...prevError,
        profit: "Profit must be a number",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        profit: "",
      }));
    }

    // validate the description
    if (localLocation.description === "") {
      setLocalError((prevError) => ({
        ...prevError,
        description: "Description is required",
      }));
    } else if (new BadWords().isProfane(localLocation.description)) {
      setLocalError((prevError) => ({
        ...prevError,
        description: "Description cannot contain profanity",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        description: "",
      }));
    }
  };

  // function that adds a new location to the database
  const addLocation = async () => {
    // touch all the fields so that the errors show up
    setTouchedFields((prevTouched) => ({
      ...prevTouched,
      name: true,
      address: true,
      city: true,
      postal_code: true,
      profit: true,
      description: true,
    }));

    // validate the data
    validateLocationData();

    // if there are any errors, return
    if (
      localError.name !== "" ||
      localError.address !== "" ||
      localError.city !== "" ||
      localError.postal_code !== "" ||
      localError.profit !== "" ||
      localError.description !== ""
    )
      return;

    // create the location object to send to the server
    const addedLocation = {
      name: localLocation.name,
      address: localLocation.address,
      city: localLocation.city,
      postal_code: localLocation.postal_code,
      profit: Number(localLocation.profit),
      description: localLocation.description,
    };

    // send the post request
    try {
      const response = await axios.post(`${BASE_URL_API}/locations/`, addedLocation, {
        headers: {
          Authorization: `Bearer ${contextData.authTokens.access}`,
        },
      });
      navigate("/locations");
      return;
    } catch (error: any) {
      if (error.response && error.response.data) {
        if (error.response.data.name) {
          setLocalError((prevError) => ({
            ...prevError,
            name: error.response.data.name,
          }));
          setLocalLocation((prevLocation) => ({ ...prevLocation, name: "" }));
        }
        if (error.response.data.address) {
          setLocalError((prevError) => ({
            ...prevError,
            address: error.response.data.address,
          }));
          setLocalLocation((prevLocation) => ({ ...prevLocation, address: "" }));
        }
        if (error.response.data.city) {
          setLocalError((prevError) => ({
            ...prevError,
            city: error.response.data.city,
          }));
          setLocalLocation((prevLocation) => ({ ...prevLocation, city: "" }));
        }
        if (error.response.data.postal_code) {
          setLocalError((prevError) => ({
            ...prevError,
            postal_code: error.response.data.postal_code,
          }));
          setLocalLocation((prevLocation) => ({ ...prevLocation, postal_code: "" }));
        }
        if (error.response.data.profit) {
          setLocalError((prevError) => ({
            ...prevError,
            profit: error.response.data.profit,
          }));
          setLocalLocation((prevLocation) => ({ ...prevLocation, profit: "" }));
        }
        if (error.response.data.description) {
          setLocalError((prevError) => ({
            ...prevError,
            description: error.response.data.description,
          }));
          setLocalLocation((prevLocation) => ({ ...prevLocation, description: "" }));
        }
        if (error.response.data.auth) {
          setLocalError((prevError) => ({
            ...prevError,
            generic: error.response.data.auth,
          }));
        }
      } else {
        setLocalError((prevError) => ({
          ...prevError,
          generic: "Something went wrong! Make sure you filled all the fields correctly.",
        }));
      }
    }
  };

  return (
    <>
      <MainNavbar />
      <Container className="create-location-content-container">
        <Container className="create-location-content" sx={{ minHeight: "calc(100vh - 160px)" }}>
          <Typography variant="h1" className="create-location-big-header" sx={{ mt: 10, mb: 2 }}>
            Create a new location!
          </Typography>

          {localError.generic && (
            <Typography variant="body2" sx={{ color: "#e64545", mb: 4, marginLeft: "4px" }}>
              {localError.generic}
            </Typography>
          )}

          <Box className="create-location-fields">
            <TextField
              label="Name"
              variant="outlined"
              sx={{ margin: "12px 0px", width: "96%" }}
              value={localLocation.name}
              onChange={(e) => setLocalLocation((prevLocation) => ({ ...prevLocation, name: e.target.value }))}
              error={localError.name && touchedFields.name ? true : false}
              onBlur={(e) =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  name: true,
                }))
              }
              helperText={localError.name && touchedFields.name && localError.name}
            />

            <TextField
              label="Address"
              variant="outlined"
              sx={{ margin: "12px 0px", width: "96%" }}
              value={localLocation.address}
              onChange={(e) => setLocalLocation((prevLocation) => ({ ...prevLocation, address: e.target.value }))}
              error={localError.address && touchedFields.address ? true : false}
              onBlur={(e) =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  address: true,
                }))
              }
              helperText={localError.address && touchedFields.address && localError.address}
              className="address-field"
            />

            <TextField
              label="City"
              variant="outlined"
              sx={{ margin: "12px 0px", width: "96%" }}
              value={localLocation.city}
              onChange={(e) => setLocalLocation((prevLocation) => ({ ...prevLocation, city: e.target.value }))}
              error={localError.city && touchedFields.city ? true : false}
              onBlur={(e) =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  city: true,
                }))
              }
              helperText={localError.city && touchedFields.city && localError.city}
              className="city-field"
            />

            <TextField
              label="Postal Code"
              variant="outlined"
              sx={{ margin: "12px 0px", width: "96%" }}
              value={localLocation.postal_code}
              onChange={(e) => setLocalLocation((prevLocation) => ({ ...prevLocation, postal_code: e.target.value }))}
              error={localError.postal_code && touchedFields.postal_code ? true : false}
              onBlur={(e) =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  postal_code: true,
                }))
              }
              helperText={localError.postal_code && touchedFields.postal_code && localError.postal_code}
              className="postal-code-field"
            />

            <TextField
              label="Profit"
              variant="outlined"
              sx={{ margin: "12px 0px", width: "96%" }}
              value={localLocation.profit}
              onChange={(e) => setLocalLocation((prevLocation) => ({ ...prevLocation, profit: e.target.value }))}
              error={localError.profit && touchedFields.profit ? true : false}
              onBlur={(e) =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  profit: true,
                }))
              }
              helperText={localError.profit && touchedFields.profit && localError.profit}
              className="profit-field"
            />

            <TextField
              multiline
              label="Description"
              variant="outlined"
              sx={{ margin: "12px 0px", width: "96%" }}
              value={localLocation.description}
              onChange={(e) => setLocalLocation((prevLocation) => ({ ...prevLocation, description: e.target.value }))}
              error={localError.description && touchedFields.description ? true : false}
              onBlur={(e) =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  description: true,
                }))
              }
              helperText={localError.description && touchedFields.description && localError.description}
              className="description-field"
            />
          </Box>

          <Button
            onClick={() => addLocation()}
            variant="contained"
            className="create-location-button"
            sx={{
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <AddIcon sx={{ mr: "8px" }} /> Create
          </Button>
        </Container>
        <Container className="create-location-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="create a new location" height="600px" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default AddLocation;
