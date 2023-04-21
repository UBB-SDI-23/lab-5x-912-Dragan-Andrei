// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// css
import "../../assets/css/blends/blendsMenu.css";

// react components
import MainNavbar from "../MainNavbar";
import BlendItem from "./BlendItem";
import Pagination from "../Pagination";

// utils
import { useState, useEffect } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// images
import supportImage from "../../assets/images/blends.jpg";

// objects
import { Blend } from "../../models/Blend";

const BlendsMenu = () => {
  const [blends, setBlends] = useState<Blend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastFetchCall, setLastFetchCall] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [totalEntries, setTotalEntries] = useState<number>(0);

  const navigate = useNavigate();

  // function to get all blends
  const getBlends = async () => {
    setLoading(true);
    const currentFetchCall = lastFetchCall;

    let url = `${BASE_URL_API}/blends?page_size=${pageSize}`;
    url += "&p=" + page;

    setLastFetchCall((prev) => prev + 1);
    const response = await axios.get(url);
    const data = await response.data;
    if (currentFetchCall === lastFetchCall) {
      setBlends(data.results);
      setTotalEntries(data.count);
    }
    setLoading(false);
  };

  // everytime the page size changes, reset the page to 1 and fetch the blends if needed
  useEffect(() => {
    if (page === 1) getBlends();
    else setPage(1);
  }, [pageSize]);

  // navigator to a clicked blend
  const getBlendDetails = (id: number) => {
    navigate(`/blends/${id}`);
  };

  // everytime the content of the selected page / the page size changes, fetch the blends
  useEffect(() => {
    getBlends();
  }, [page, pageSize]);

  return (
    <>
      <MainNavbar />
      <Container className="blends-content-container">
        <Container className="blends-content" sx={{ minHeight: "calc(100vh)" }}>
          <Typography className="blends-big-header" variant="h1" sx={{ mt: 10, mb: 0 }}>
            Our blends!
          </Typography>
          <Typography className="blends-small-header" variant="body2" sx={{ mb: 5, mt: 2 }} onClick={() => navigate("country")}>
            See from where our blends come from!
          </Typography>
          <List className="blends-list">
            {loading && (
              <Typography variant="h2" ml="8px">
                Loading...
              </Typography>
            )}
            {!loading &&
              blends.map((blend) => (
                <ListItem key={blend.id} sx={{ width: "100%", padding: "16px 0" }} onClick={() => getBlendDetails(blend.id)}>
                  <BlendItem blend={blend} />
                </ListItem>
              ))}
          </List>
          <Pagination page={page} pageSize={pageSize} totalEntries={totalEntries} setPage={setPage} setPageSize={setPageSize} entityName="blends" />
          <Button
            className="add-blend-button"
            onClick={() => navigate("/blends/add")}
            variant="contained"
            sx={{
              mt: 5,
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <ArrowForwardIcon sx={{ marginRight: "8px" }} /> Add blend
          </Button>
        </Container>
        <Container className="blends-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="image with some of our tasty blends" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default BlendsMenu;
