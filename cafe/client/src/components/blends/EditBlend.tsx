// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MenuItem from "@mui/material/MenuItem";

// css
import "../../assets/css/blends/addBlend.css";

// utils
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { BASE_URL_API } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import BadWords from "bad-words";

// react components
import MainNavbar from "../MainNavbar";
import { Box } from "@mui/material";

// images
import supportImage from "../../assets/images/create_blend.jpg";
import EditLocation from "../locations/EditLocation";

// create a new LocalBlend objecet model for the add blend form
interface LocalBlend {
  name: string;
  description: string;
  country_of_origin: string;
  level: string;
  in_stock: boolean;
}

// create an error object model
interface LocalError {
  generic: string;
  name: string;
  description: string;
  country_of_origin: string;
  level: string;
  in_stock: string;
}

// create a model for the touched fields
interface TouchedFields {
  name: boolean;
  description: boolean;
  country_of_origin: boolean;
  level: boolean;
  in_stock: boolean;
}

const EditBlend = () => {
  const [localBlend, setLocalBlend] = useState<LocalBlend>({
    name: "",
    description: "",
    country_of_origin: "",
    level: "",
    in_stock: true,
  });

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    name: false,
    description: false,
    country_of_origin: false,
    level: false,
    in_stock: false,
  });

  const [localError, setLocalError] = useState<LocalError>({
    generic: "",
    name: "",
    description: "",
    country_of_origin: "",
    level: "",
    in_stock: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const id = Number(useParams<{ id: string }>().id);

  const navigate = useNavigate();
  const contextData = useContext<any>(AuthContext);

  // function to get a blend based on id
  const getBlend = async (id: number) => {
    setLoading(true);

    const response = await axios.get(`${BASE_URL_API}/blends/${id}`);
    const data = await response.data;
    setLocalBlend({
      name: data.name,
      description: data.description,
      country_of_origin: data.country_of_origin,
      level: data.level.toString(),
      in_stock: data.in_stock,
    });

    setLoading(false);
  };
  useEffect(() => {
    getBlend(id);
  }, [id]);

  // every time the localBlend state changes, validate the data
  useEffect(() => {
    validateBlendData();
  }, [localBlend]);

  // function to validate the blend data
  const validateBlendData = () => {
    // validate the name
    if (localBlend.name === "") {
      setLocalError((prevError) => ({
        ...prevError,
        name: "Name is required",
      }));
    } else if (localBlend.name.length > 50) {
      setLocalError((prevError) => ({
        ...prevError,
        name: "Name cannot be longer than 50 characters",
      }));
    } else if (new BadWords().isProfane(localBlend.name)) {
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

    // validate the description
    if (localBlend.description === "") {
      setLocalError((prevError) => ({
        ...prevError,
        description: "Description is required",
      }));
    } else if (new BadWords().isProfane(localBlend.description)) {
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

    // validate the country of origin
    if (localBlend.country_of_origin === "") {
      setLocalError((prevError) => ({
        ...prevError,
        country_of_origin: "Country of origin is required",
      }));
    } else if (localBlend.country_of_origin.length > 1000) {
      setLocalError((prevError) => ({
        ...prevError,
        country_of_origin: "Country of origin cannot be longer than 1000 characters",
      }));
    } else if (new BadWords().isProfane(localBlend.country_of_origin)) {
      setLocalError((prevError) => ({
        ...prevError,
        country_of_origin: "Country of origin cannot contain profanity",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        country_of_origin: "",
      }));
    }

    // validate the level
    if (localBlend.level === "") {
      setLocalError((prevError) => ({
        ...prevError,
        level: "Strength is required",
      }));
    } else if (!Number(localBlend.level)) {
      setLocalError((prevError) => ({
        ...prevError,
        level: "Strength must be a number between 1 and 5",
      }));
    } else if (!(1 <= Number(localBlend.level) && Number(localBlend.level) <= 5)) {
      setLocalError((prevError) => ({
        ...prevError,
        level: "Strength must be a number between 1 and 5",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        level: "",
      }));
    }
  };

  // function that adds a new blend to the database
  const editBlend = async () => {
    // touch all the fields so that the errors show up
    setTouchedFields((prevTouched) => ({
      ...prevTouched,
      name: true,
      description: true,
      country_of_origin: true,
      level: true,
      in_stock: true,
    }));

    // validate the data
    validateBlendData();

    // if there are any errors, return
    if (localError.name !== "" || localError.description !== "" || localError.country_of_origin !== "" || localError.level !== "") return;

    // create the blend object to send to the server
    const updatedBlend = {
      name: localBlend.name,
      description: localBlend.description,
      country_of_origin: localBlend.country_of_origin,
      level: Number(localBlend.level),
      in_stock: localBlend.in_stock,
    };

    // send the post request
    try {
      await axios.put(`${BASE_URL_API}/blends/${id}`, updatedBlend, {
        headers: {
          Authorization: `Bearer ${contextData.authTokens.access}`,
        },
      });
      navigate("/blends");
      return;
    } catch (error: any) {
      if (error.response && error.response.data) {
        if (error.response.data.name) {
          setLocalError((prevError) => ({
            ...prevError,
            name: error.response.data.name,
          }));
          setLocalBlend((prevBlend) => ({ ...prevBlend, name: "" }));
        }
        if (error.response.data.description) {
          setLocalError((prevError) => ({
            ...prevError,
            description: error.response.data.description,
          }));
          setLocalBlend((prevBlend) => ({ ...prevBlend, description: "" }));
        }
        if (error.response.data.country_of_origin) {
          setLocalError((prevError) => ({
            ...prevError,
            country_of_origin: error.response.data.country_of_origin,
          }));
          setLocalBlend((prevBlend) => ({ ...prevBlend, country_of_origin: "" }));
        }
        if (error.response.data.level) {
          setLocalError((prevError) => ({
            ...prevError,
            level: error.response.data.level,
          }));
          setLocalBlend((prevBlend) => ({ ...prevBlend, level: "" }));
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
      <Container className="create-blend-content-container">
        <Container className="create-blend-content" sx={{ minHeight: "calc(100vh - 160px)" }}>
          <Typography variant="h1" className="create-blend-big-header" sx={{ mt: 10, mb: 2 }}>
            Edit a blend!
          </Typography>

          {localError.generic && (
            <Typography variant="body2" sx={{ color: "#e64545", mb: 4, marginLeft: "4px" }}>
              {localError.generic}
            </Typography>
          )}
          {!loading ? (
            <Box className="create-blend-fields">
              <TextField
                label="Name"
                variant="outlined"
                sx={{ margin: "12px 0px", width: "96%" }}
                value={localBlend.name}
                onChange={(e) => setLocalBlend((prevBlend) => ({ ...prevBlend, name: e.target.value }))}
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
                label="Country"
                variant="outlined"
                sx={{ margin: "12px 0px", width: "96%" }}
                value={localBlend.country_of_origin}
                onChange={(e) => setLocalBlend((prevBlend) => ({ ...prevBlend, country_of_origin: e.target.value }))}
                error={localError.country_of_origin && touchedFields.country_of_origin ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    country_of_origin: true,
                  }))
                }
                helperText={localError.country_of_origin && touchedFields.country_of_origin && localError.country_of_origin}
                className="country-field"
              />

              <TextField
                label="Strength"
                variant="outlined"
                sx={{ margin: "12px 0px", width: "96%" }}
                value={localBlend.level}
                onChange={(e) => setLocalBlend((prevBlend) => ({ ...prevBlend, level: e.target.value }))}
                error={localError.level && touchedFields.level ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    level: true,
                  }))
                }
                helperText={localError.level && touchedFields.level && localError.level}
                className="level-field"
              />

              <TextField
                select
                label="In stock"
                defaultValue={localBlend.in_stock ? 1 : 0}
                value={localBlend.in_stock ? 1 : 0}
                onChange={(e) =>
                  setLocalBlend((prevBlend) => ({
                    ...prevBlend,
                    in_stock: Number(e.target.value) === 1,
                  }))
                }
                className="in-stock-field"
              >
                <MenuItem value={1}>Yes</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </TextField>

              <TextField
                multiline
                label="Description"
                variant="outlined"
                sx={{ margin: "12px 0px", width: "96%" }}
                value={localBlend.description}
                onChange={(e) => setLocalBlend((prevBlend) => ({ ...prevBlend, description: e.target.value }))}
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
          ) : (
            <Typography variant="h2">Loading...</Typography>
          )}

          <Button
            onClick={() => editBlend()}
            variant="contained"
            className="create-blend-button"
            sx={{
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <ModeEditIcon sx={{ mr: "8px" }} /> Edit
          </Button>
        </Container>
        <Container className="create-blend-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="edit a blend" height="600px" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default EditBlend;
