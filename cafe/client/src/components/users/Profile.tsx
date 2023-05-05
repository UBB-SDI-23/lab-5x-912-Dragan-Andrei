// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// css
import "../../assets/css/users/profile.css";

// utils
import { useEffect, useState, useContext } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

// react components
import MainNavbar from "../MainNavbar";

// create a custom local profile interface
interface LocalProfile {
  id: number;
  username: string;
  bio: string;
  age: number;
  gender: string;
  nationality: string;
  favourite_flavour: string;
  no_coffees: number;
  no_blends: number;
  no_locations: number;
  no_sales: number;
}

const Profile = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<LocalProfile>({} as LocalProfile);
  const [error, setError] = useState<string>("");

  const username = useParams<{ username: string }>().username;

  const navigate = useNavigate();
  const contextData = useContext<any>(AuthContext);

  // function to get a user's profile based on username
  const getProfile = async (username: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL_API}/profile/${username}`);
      const data = await response.data;
      setProfile(data);
      setLoading(false);
    } catch (error) {
      setError("The profile could not be loaded! Please try again later.");
    }
  };

  useEffect(() => {
    username && getProfile(username);
  }, [username]);

  return (
    <>
      <MainNavbar />
      <Container className="profile-content-container" sx={{ minHeight: "100vh" }}>
        <Container className="profile-content">
          <Typography variant="h1" sx={{ mt: 10, mb: 2 }}>
            {!error && (profile.username ? `${profile.username}'s Profile` : "Loading...")}
          </Typography>

          {error && (
            <Typography variant="h1" sx={{ mt: 10, mb: 2 }}>
              {error}
            </Typography>
          )}

          {profile.username && (
            <>
              {contextData.user && contextData.user.username == username && (
                <Box
                  mt={2}
                  mb={8}
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button
                    className="edit-profile-button"
                    variant="contained"
                    sx={{
                      boxShadow: 4,
                      "&:hover": {
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => navigate(`edit`)}
                  >
                    Edit
                  </Button>
                </Box>
              )}

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Age:</Typography>
                <Typography ml={2} variant="h3">
                  {profile.age}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Gender:</Typography>
                <Typography ml={2} variant="h3">
                  {profile.gender === "M" && "Male"}
                  {profile.gender === "F" && "Female"}
                  {profile.gender === "O" && "Other"}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Nationality:</Typography>
                <Typography ml={2} variant="h3">
                  {profile.nationality}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Favourite flavour:</Typography>
                <Typography ml={2} variant="h3">
                  {profile.favourite_flavour}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Coffees added:</Typography>
                <Typography ml={2} variant="h3">
                  {profile.no_coffees}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Blends added:</Typography>
                <Typography ml={2} variant="h3">
                  {profile.no_blends}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Locations addes:</Typography>
                <Typography ml={2} variant="h3">
                  {profile.no_locations}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Sales addes:</Typography>
                <Typography ml={2} variant="h3">
                  {profile.no_sales}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Typography variant="h5" sx={{ fontWeight: "normal" }}>
                Bio - {profile.bio}
              </Typography>
            </>
          )}
        </Container>
      </Container>
    </>
  );
};

export default Profile;
