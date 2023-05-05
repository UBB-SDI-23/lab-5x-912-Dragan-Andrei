// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

// css
import "../../assets/css/users/editProfile.css";

// utils
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { BASE_URL_API } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import BadWords from "bad-words";

// react components
import MainNavbar from "../MainNavbar";

// create a custom local profile interface
interface LocalProfile {
  bio: string;
  age: string;
  gender: string;
  nationality: string;
  favourite_flavour: string;
}

// create a custom local model for the touched fields
interface TouchedFields {
  bio: boolean;
  age: boolean;
  gender: boolean;
  nationality: boolean;
  favourite_flavour: boolean;
}

// create a custom local model for the error
interface LocalError {
  generic: string;
  bio: string;
  age: string;
  gender: string;
  nationality: string;
  favourite_flavour: string;
}

const EditProfile = () => {
  const [localProfile, setLocalProfile] = useState<LocalProfile>({
    bio: "",
    age: "",
    gender: "",
    nationality: "",
    favourite_flavour: "",
  });

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    bio: false,
    age: false,
    gender: false,
    nationality: false,
    favourite_flavour: false,
  });

  const [localError, setLocalError] = useState<LocalError>({
    generic: "",
    bio: "",
    age: "",
    gender: "",
    nationality: "",
    favourite_flavour: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const username = useParams<{ username: string }>().username;

  const navigate = useNavigate();
  const contextData = useContext<any>(AuthContext);

  // get the user's profile based on the username
  const getProfile = async (username: string) => {
    setLoading(true);
    const response = await axios.get(`${BASE_URL_API}/profile/${username}`);
    const data = await response.data;

    setLocalProfile({
      bio: data.bio,
      age: data.age,
      gender: data.gender,
      nationality: data.nationality,
      favourite_flavour: data.favourite_flavour,
    });

    setLoading(false);
  };
  useEffect(() => {
    username && getProfile(username);
  }, [username]);

  // every time the localProfile state changes, validate the data
  useEffect(() => {
    validateProfileData();
  }, [localProfile]);

  // function to vaidate the profile data
  const validateProfileData = () => {
    // validate the bio
    if (localProfile.bio.length > 500) {
      setLocalError((prev) => ({
        ...prev,
        bio: "The bio must be less than 500 characters!",
      }));
    } else if (new BadWords().isProfane(localProfile.bio)) {
      setLocalError((prev) => ({
        ...prev,
        bio: "The bio must not contain profanity!",
      }));
    } else {
      setLocalError((prev) => ({ ...prev, bio: "" }));
    }

    // validate the age
    if (!Number(localProfile.age)) {
      setLocalError((prev) => ({
        ...prev,
        age: "The age must be a number!",
      }));
    } else if (Number(localProfile.age) < 0) {
      setLocalError((prev) => ({
        ...prev,
        age: "The age must be a positive number!",
      }));
    } else {
      setLocalError((prev) => ({ ...prev, age: "" }));
    }

    // validate the gender
    if (localProfile.gender !== "M" && localProfile.gender !== "F" && localProfile.gender != "O") {
      setLocalError((prev) => ({
        ...prev,
        gender: "The gender can only be M - male, F - female or O - other!",
      }));
    } else {
      setLocalError((prev) => ({
        ...prev,
        gender: "",
      }));
    }

    // validate the nationality
    if (localProfile.nationality.length > 100) {
      setLocalError((prev) => ({
        ...prev,
        nationality: "The nationality must be less than 100 characters!",
      }));
    } else {
      setLocalError((prev) => ({
        ...prev,
        nationality: "",
      }));
    }

    // validate the favourite flavour
    if (localProfile.favourite_flavour.length > 100) {
      setLocalError((prev) => ({
        ...prev,
        favourite_flavour: "The favourite flavour must be less than 100 characters!",
      }));
    } else {
      setLocalError((prev) => ({
        ...prev,
        favourite_flavour: "",
      }));
    }
  };

  // update the profile
  const editProfile = async () => {
    // touch all the fields so that the errors show up
    setTouchedFields((prevTouched) => ({
      ...prevTouched,
      bio: true,
      age: true,
      gender: true,
      nationality: true,
      favourite_flavour: true,
    }));

    // validate the data
    validateProfileData();

    // if there are any errors, return
    if (localError.age !== "" || localError.bio !== "" || localError.gender !== "" || localError.nationality !== "" || localError.favourite_flavour !== "")
      return;

    // create the profile to send to the server
    const updatedProfile = {
      bio: localProfile.bio,
      age: Number(localProfile.age),
      gender: localProfile.gender,
      nationality: localProfile.nationality,
      favourite_flavour: localProfile.favourite_flavour,
    };

    // send the put request
    try {
      await axios.put(`${BASE_URL_API}/profile/${username}/`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${contextData.authTokens.access}`,
        },
      });
      navigate("/profile/" + username);
      return;
    } catch (error: any) {
      if (error.response && error.response.data) {
        let foundError = false;

        if (error.response.data.bio) {
          foundError = true;
          setLocalError((prev) => ({
            ...prev,
            bio: error.response.data.bio,
          }));
          setLocalProfile((prev) => ({
            ...prev,
            bio: "",
          }));
        }

        if (error.response.data.age) {
          foundError = true;
          setLocalError((prev) => ({
            ...prev,
            age: error.response.data.age,
          }));
          setLocalProfile((prev) => ({
            ...prev,
            age: "",
          }));
        }

        if (error.response.data.gender) {
          foundError = true;
          setLocalError((prev) => ({
            ...prev,
            gender: error.response.data.gender,
          }));
          setLocalProfile((prev) => ({
            ...prev,
            gender: "",
          }));
        }

        if (error.response.data.nationality) {
          foundError = true;
          setLocalError((prev) => ({
            ...prev,
            nationality: error.response.data.nationality,
          }));
          setLocalProfile((prev) => ({
            ...prev,
            nationality: "",
          }));
        }

        if (error.response.data.favourite_flavour) {
          foundError = true;
          setLocalError((prev) => ({
            ...prev,
            favourite_flavour: error.response.data.favourite_flavour,
          }));
          setLocalProfile((prev) => ({
            ...prev,
            favourite_flavour: "",
          }));
        }

        if (error.response.data.auth) {
          foundError = true;
          setLocalError((prevError) => ({
            ...prevError,
            generic: error.response.data.auth,
          }));
        }

        if (!foundError) {
          setLocalError((prev) => ({
            ...prev,
            generic: "An error occured! Please try again later.",
          }));
        }
      } else {
        setLocalError((prev) => ({
          ...prev,
          generic: "An error occured! Please try again later.",
        }));
      }
    }
  };

  return (
    <>
      <MainNavbar />
      <Container className="edit-profile-container">
        <Container className="edit-profile-content" sx={{ minHeight: "calc(100vh - 160px)" }}>
          <Typography variant="h1" sx={{ mt: 10, mb: 2 }}>
            Edit your profile!
          </Typography>

          {localError.generic && (
            <Typography variant="body2" sx={{ color: "#e64545", mb: 4, marginLeft: "4px" }}>
              {localError.generic}
            </Typography>
          )}
          {!loading ? (
            <Box className="create-blend-fields">
              <TextField
                multiline
                label="Bio"
                variant="outlined"
                sx={{ margin: "12px 0px", width: "96%" }}
                value={localProfile.bio}
                onChange={(e) => setLocalProfile((prev) => ({ ...prev, bio: e.target.value }))}
                error={localError.bio && touchedFields.bio ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    bio: true,
                  }))
                }
                helperText={localError.bio && touchedFields.bio && localError.bio}
              />

              <TextField
                label="Age"
                variant="outlined"
                sx={{ margin: "12px 8px 0 0", width: "20%" }}
                value={localProfile.age}
                onChange={(e) => setLocalProfile((prev) => ({ ...prev, age: e.target.value }))}
                error={localError.age && touchedFields.age ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    age: true,
                  }))
                }
                helperText={localError.age && touchedFields.age && localError.age}
                className="age-field"
              />

              <TextField
                label="Nationality"
                variant="outlined"
                sx={{ margin: "12px 8px", width: "20%" }}
                value={localProfile.nationality}
                onChange={(e) => setLocalProfile((prev) => ({ ...prev, nationality: e.target.value }))}
                error={localError.nationality && touchedFields.nationality ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    nationality: true,
                  }))
                }
                helperText={localError.nationality && touchedFields.nationality && localError.nationality}
                className="nationality-field"
              />

              <TextField
                select
                label="Gender"
                sx={{ margin: "12px 8px", width: "20%" }}
                defaultValue={localProfile.gender ? localProfile.gender : "M"}
                value={localProfile.gender}
                onChange={(e) => setLocalProfile((prev) => ({ ...prev, gender: e.target.value }))}
                className="gender-field"
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </TextField>

              <TextField
                label="Favorite flavour"
                variant="outlined"
                sx={{ margin: "12px 8px", width: "20%" }}
                value={localProfile.favourite_flavour}
                onChange={(e) => setLocalProfile((prev) => ({ ...prev, favourite_flavour: e.target.value }))}
                error={localError.favourite_flavour && touchedFields.favourite_flavour ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    favourite_flavour: true,
                  }))
                }
                helperText={localError.favourite_flavour && touchedFields.favourite_flavour && localError.favourite_flavour}
                className="flavour-field"
              />
            </Box>
          ) : (
            <Typography variant="h2">Loading...</Typography>
          )}

          <Button
            onClick={() => editProfile()}
            variant="contained"
            className="edit-profile-button"
            sx={{
              mt: 2,
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <ModeEditIcon sx={{ mr: "8px" }} /> Edit
          </Button>
        </Container>
      </Container>
    </>
  );
};

export default EditProfile;
