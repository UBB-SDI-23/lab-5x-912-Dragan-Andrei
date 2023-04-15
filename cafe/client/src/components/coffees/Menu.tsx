// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// css
import "../../assets/css/coffees/menu.css";

// react components
import MainNavbar from "../MainNavbar";
import CoffeeItem from "./CoffeeItem";
import Pagination from "../Pagination";

// utils
import { useState, useEffect, useCallback } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// models
import { Coffee } from "../../models/Coffee";

// images
import supportImage from "../../assets/images/macaroons_v2.png";

// create local coffee object
interface LocalCoffee {
  id: number;
  name: string;
  price: number;
  calories: number;
  quantity: number;
  vegan: boolean;
  blend_id: number;
}

const Menu = () => {
  const [coffees, setCoffees] = useState<LocalCoffee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [isSort, setIsSort] = useState<Boolean>(false);
  const [lastFetchCall, setLastFetchCall] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [totalEntries, setTotalEntries] = useState<number>(0);

  const navigate = useNavigate();

  // function to get all coffees
  const getCoffees = async () => {
    setLoading(true);
    const currentFetchCall = lastFetchCall;

    let url = `${BASE_URL_API}/coffees?page_size=${pageSize}`;
    Number(minPrice) && Number(minPrice) >= 0 ? (url += "&min_price=" + minPrice + "&p=" + page) : (url += "&p=" + page);
    isSort && (url += "&sort=true");

    setLastFetchCall((prev) => prev + 1);
    const response = await axios.get(url);
    const data = await response.data;
    if (currentFetchCall === lastFetchCall) {
      setCoffees(data.results);
      setTotalEntries(data.count);
    }
    setLoading(false);
  };

  // everytime the sort state changes, reorder the coffees
  useEffect(() => {
    if (page === 1) getCoffees();
    else setPage(1);
  }, [isSort, pageSize]);

  // navigator to a clicked coffee
  const getCoffeeDetails = (id: number) => {
    navigate(`/coffees/${id}`);
  };

  // everytime the content of the filter / the selected page / the page size changes, fetch the coffees
  useEffect(() => {
    if (minPrice === "0" || minPrice === "" || (Number(minPrice) && Number(minPrice) >= 0)) {
      getCoffees();
    }
  }, [minPrice, page, pageSize]);

  return (
    <>
      <MainNavbar />
      <Container maxWidth="xl" sx={{ display: "flex", paddingBottom: "32px" }}>
        <Container sx={{ minHeight: "calc(100vh)" }}>
          <Typography variant="h1" sx={{ mt: 10, mb: 5 }}>
            Our coffees!
          </Typography>
          <List>
            <ListItem sx={{ width: "100%", display: "flex" }}>
              <Box sx={{ width: "100%" }}>
                <TextField label="Minimum price" variant="standard" value={minPrice ? minPrice : ""} onChange={(e) => setMinPrice(e.target.value)} />
              </Box>
              <Box
                className="sort-button"
                onClick={() => {
                  setIsSort(!isSort);
                }}
              >
                <Typography variant="h6" mr="8px">
                  ascending by price{" "}
                </Typography>
                <Box
                  className="sort-icon"
                  sx={{
                    bgcolor: isSort ? "#be9063" : "#fff",
                    color: isSort ? "#be9063" : "#333",
                  }}
                ></Box>
              </Box>
            </ListItem>

            {loading && (
              <Typography variant="h2" ml="8px">
                Loading...
              </Typography>
            )}
            {!loading &&
              coffees.map((coffee) => (
                <ListItem key={coffee.id} sx={{ width: "100%" }} onClick={() => getCoffeeDetails(coffee.id)}>
                  <CoffeeItem coffee={coffee} />
                </ListItem>
              ))}
          </List>
          <Pagination page={page} pageSize={pageSize} totalEntries={totalEntries} setPage={setPage} setPageSize={setPageSize} />
          <Button
            className="add-coffee-button"
            onClick={() => navigate("/coffees/add")}
            variant="contained"
            sx={{
              mt: 5,
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <ArrowForwardIcon sx={{ marginRight: "8px" }} /> Add coffee
          </Button>
        </Container>
        <Container sx={{ display: { md: "none", sm: "none", xs: "none", lg: "block" } }}>
          <Box mt={20} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="macaroons" height="600px" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default Menu;
