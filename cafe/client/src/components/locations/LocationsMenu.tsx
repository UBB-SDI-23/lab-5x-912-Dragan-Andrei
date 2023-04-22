// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// css
import "../../assets/css/locations/locationsMenu.css";

// react components
import MainNavbar from "../MainNavbar";
import LocationItem from "./LocationItem";
import Pagination from "../Pagination";

// utils
import { useState, useEffect } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// images
import supportImage from "../../assets/images/location.jpg";

// objects
import { Location } from "../../models/Location";

const LocationsMenu = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastFetchCall, setLastFetchCall] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [totalEntries, setTotalEntries] = useState<number>(0);

  const navigate = useNavigate();

  // function to get all locations
  const getLocations = async () => {
    setLoading(true);
    const currentFetchCall = lastFetchCall;

    let url = `${BASE_URL_API}/locations?page_size=${pageSize}`;
    url += "&p=" + page;

    setLastFetchCall((prev) => prev + 1);
    const response = await axios.get(url);
    const data = await response.data;
    if (currentFetchCall === lastFetchCall) {
      setLocations(data.results);
      setTotalEntries(data.count);
    }
    setLoading(false);
  };

  // everytime the page size changes, reset the page to 1 and fetch the locations if needed
  useEffect(() => {
    if (page === 1) getLocations();
    else setPage(1);
  }, [pageSize]);

  // navigator to a clicked location
  const getLocationDetails = (id: number) => {
    navigate(`/locations/${id}`);
  };

  // everytime the content of the selected page / the page size changes, fetch the locations
  useEffect(() => {
    getLocations();
  }, [page, pageSize]);

  return (
    <>
      <MainNavbar />
      <Container className="locations-content-container">
        <Container className="locations-content" sx={{ minHeight: "calc(100vh)" }}>
          <Typography className="locations-big-header" variant="h1" sx={{ mt: 10, mb: 0 }}>
            Where can you find us!
          </Typography>
          <Typography className="locations-small-header" variant="body2" sx={{ mb: 5, mt: 2 }} onClick={() => navigate("sales-by-location")}>
            See how well our top locations performed!
          </Typography>
          <List className="locations-list">
            {loading && (
              <Typography variant="h2" ml="8px">
                Loading...
              </Typography>
            )}
            {!loading &&
              locations.map((location) => (
                <ListItem key={location.id} sx={{ width: "100%", padding: "16px 0" }} onClick={() => getLocationDetails(location.id)}>
                  <LocationItem location={location} />
                </ListItem>
              ))}
          </List>
          <Pagination page={page} pageSize={pageSize} totalEntries={totalEntries} setPage={setPage} setPageSize={setPageSize} entityName="locations" />
          <Button
            className="add-location-button"
            onClick={() => navigate("/locations/add")}
            variant="contained"
            sx={{
              mt: 5,
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <ArrowForwardIcon sx={{ marginRight: "8px" }} /> Add location
          </Button>
        </Container>
        <Container className="locations-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="image with one of our beautiful cafe" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default LocationsMenu;