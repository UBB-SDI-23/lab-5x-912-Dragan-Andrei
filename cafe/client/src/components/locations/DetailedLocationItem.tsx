// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// css
import "../../assets/css/locations/detailedLocation.css";

// utils
import { useEffect, useState, useContext } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

// models
import { Location } from "../../models/Location";
import { Coffee } from "../../models/Coffee";
import { Sale } from "../../models/Sale";

// react components
import MainNavbar from "../MainNavbar";
import WarningModal from "../WarningModal";
import SalesMenu from "../sales/SalesMenu";

// images
import supportImage1 from "../../assets/images/landing1.jpg";
import supportImage2 from "../../assets/images/landing2.jpg";
import supportImage3 from "../../assets/images/landing3.jpg";
import supportImage4 from "../../assets/images/landing4.jpg";

const DetailedLocationItem = () => {
  const [location, setLocation] = useState<Location>({} as Location);
  const [coffee, setCoffee] = useState<Coffee>({} as Coffee);
  const [sales, setSales] = useState<Sale>({} as Sale);

  const [error, setError] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const id = Number(useParams<{ id: string }>().id);

  const navigate = useNavigate();
  const contextData = useContext<any>(AuthContext);

  // function to get a location based on id
  const getLocation = async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL_API}/locations/${id}`);
      setLocation(response.data);
    } catch (error) {
      setError("The location could not be loaded! Please try again later.");
    }
  };

  // function to delete a location based on id
  const deleteLocation = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL_API}/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${contextData.authTokens.access}`,
        },
      });
      navigate("/locations");
      return;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.auth) {
        setError(error.response.data.auth);
      } else setError("The location could not be deleted! Please try again later.");
    }
  };

  useEffect(() => {
    getLocation(id);
  }, [id]);

  return (
    <>
      <MainNavbar />
      {deleteModal && (
        <WarningModal
          message="Are you sure you want to delete this location?"
          accept={() => deleteLocation(location.id)}
          reject={() => setDeleteModal(false)}
        />
      )}
      <Box sx={{ minHeight: "100vh" }}>
        <Container className="location-content-container">
          <Container className="location-support-image">
            <Box sx={{ textAlign: "center" }}>
              {!location.id && <img src={supportImage1} alt="image with our beautiful location" />}
              {(location.id % 4) + 1 == 1 && <img src={supportImage1} alt="image with our beautiful location" />}
              {(location.id % 4) + 1 == 2 && <img src={supportImage2} alt="image with our beautiful location" />}
              {(location.id % 4) + 1 == 3 && <img src={supportImage3} alt="image with our beautiful location" />}
              {(location.id % 4) + 1 == 4 && <img src={supportImage4} alt="image with our beautiful location" />}
            </Box>
          </Container>
          <Container className="location-content">
            <Typography variant="h1" sx={{ mt: 10, mb: 2 }}>
              {location.name ? location.name : "Loading..."}
            </Typography>

            <Typography variant="body2" sx={{ color: "#e64545", marginLeft: "2px" }}>
              {error}
            </Typography>

            {location.name && (
              <>
                {contextData.user &&
                  contextData.user.is_active &&
                  (contextData.user.is_staff || contextData.user.is_superuser || contextData.user.user_id == location.user_id) && (
                    <Box
                      mt={2}
                      mb={8}
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Button
                        className="edit-location-button"
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

                      <Button
                        className="delete-location-button"
                        onClick={() => setDeleteModal(true)}
                        variant="outlined"
                        sx={{
                          ml: 3,
                          boxShadow: 4,
                          "&:hover": {
                            boxShadow: 2,
                          },
                        }}
                      >
                        DELETE
                      </Button>
                    </Box>
                  )}

                <Box sx={{ display: "flex" }}>
                  <Typography variant="h5" sx={{ fontWeight: "normal" }}>
                    {location.description}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

                <Box sx={{ display: "flex" }}>
                  <Typography variant="h5">Address:</Typography>
                  <Typography ml={2} variant="h5" sx={{ color: "#be9063" }}>
                    {location.address} - {location.city}, {location.postal_code}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

                <Box sx={{ display: "flex" }}>
                  <Typography variant="h5">Profit last year:</Typography>
                  <Typography ml={2} variant="h5" sx={{ color: "#be9063" }}>
                    {location.profit}$
                  </Typography>
                </Box>

                <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />
              </>
            )}
          </Container>
        </Container>
        <Box className="location-sales">{location.id && <SalesMenu locationId={location.id} />}</Box>
      </Box>
    </>
  );
};

export default DetailedLocationItem;
