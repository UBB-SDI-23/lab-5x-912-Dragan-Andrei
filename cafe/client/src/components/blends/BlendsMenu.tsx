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
import UserItem from "../users/UserItem";

// utils
import { useState, useEffect, useContext } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

// images
import supportImage from "../../assets/images/blends.jpg";

// create a local custom interface for the Blend object
interface LocalBlend {
  id: number;
  name: string;
  description: string;
  country_of_origin: string;
  level: number;
  in_stock: boolean;
  used_by: number;
  username: string;
}

const BlendsMenu = () => {
  const [blends, setBlends] = useState<LocalBlend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastFetchCall, setLastFetchCall] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(Number(localStorage.getItem("defaultPageSize")) || 10);

  const [totalEntries, setTotalEntries] = useState<number>(0);

  const navigate = useNavigate();
  const contextData = useContext<any>(AuthContext);

  // function to get all blends
  const getBlends = async () => {
    setLoading(true);
    const currentFetchCall = lastFetchCall;

    let url = `${BASE_URL_API}/blends?page_size=${pageSize}`;
    url += "&p=" + page;

    setLastFetchCall((prev) => prev + 1);
    try {
      const response = await axios.get(url);
      const data = await response.data;
      if (currentFetchCall === lastFetchCall) {
        setBlends(data.results);
        setTotalEntries(data.count);
      }
      setLoading(false);
    } catch (error) {
      setError("There was an internal error! Try again later!");
      setLoading(false);
    }
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
            {loading ? (
              <Typography variant="h2" ml="0px">
                Loading...
              </Typography>
            ) : error ? (
              <Typography variant="h2" ml="0px">
                {error}
              </Typography>
            ) : blends.length === 0 ? (
              <Typography variant="h2" ml="0px">
                We don't have any blends for you!
              </Typography>
            ) : (
              blends.map((blend) => (
                <Box key={blend.id}>
                  <UserItem username={blend.username} />
                  <ListItem sx={{ width: "100%", padding: "0 0 40px 0" }} onClick={() => getBlendDetails(blend.id)}>
                    <BlendItem blend={blend} />
                  </ListItem>
                </Box>
              ))
            )}
          </List>
          <Pagination page={page} pageSize={pageSize} totalEntries={totalEntries} setPage={setPage} setPageSize={setPageSize} entityName="blends" />

          {contextData.user && contextData.user.is_active && (
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
          )}
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
