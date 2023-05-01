// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Switch from "@mui/material/Switch";

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

// images
import supportImage from "../../assets/images/coffees.jpg";

// create local coffee object
interface LocalCoffee {
  id: number;
  name: string;
  price: number;
  calories: number;
  quantity: number;
  vegan: boolean;
  blend_id: number;
  blend_count: number;
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

  // everytime the sort state / page size changes, reset the coffee pagination
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
      <Container className="coffees-content-container">
        <Container className="coffees-content" sx={{ minHeight: "calc(100vh)" }}>
          <Typography className="coffees-big-header" variant="h1" sx={{ mt: 10, mb: 5 }}>
            Our coffees!
          </Typography>
          <List className="coffees-list">
            <ListItem className="coffees-filter-section">
              <Box sx={{ width: "200px" }}>
                <TextField label="Minimum price" variant="outlined" value={minPrice ? minPrice : ""} onChange={(e) => setMinPrice(e.target.value)} />
              </Box>
              <Box
                className="coffees-sort-button"
                onClick={() => {
                  setIsSort(!isSort);
                }}
              >
                <Switch checked={!!isSort} onChange={() => setIsSort(!isSort)} sx={{ alignItems: "center" }} />
                <Typography variant="h6">sort by price</Typography>
              </Box>
            </ListItem>

            {loading && (
              <Typography variant="h2" ml="8px">
                Loading...
              </Typography>
            )}
            {!loading &&
              coffees.map((coffee) => (
                <ListItem key={coffee.id} sx={{ width: "100%", padding: "8px 0" }} onClick={() => getCoffeeDetails(coffee.id)}>
                  <CoffeeItem coffee={coffee} />
                </ListItem>
              ))}
          </List>
          <Pagination page={page} pageSize={pageSize} totalEntries={totalEntries} setPage={setPage} setPageSize={setPageSize} entityName="coffees" />
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
        <Container className="coffees-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="image with some tasty coffees made by us" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default Menu;
