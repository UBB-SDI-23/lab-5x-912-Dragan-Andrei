// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

// react components
import MainNavbar from "./MainNavbar";
import CoffeeItem from "./CoffeeItem";

// utils
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL_API } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// models
import { Coffee } from "../models/Coffee";

// images
import supportImage from "../assets/images/macaroons_v2.png";

const Menu = () => {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [isSort, setIsSort] = useState<Boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);

  const navigate = useNavigate();

  // function to get all coffees
  const getCoffees = async () => {
    setLoading(true);

    let url = `${BASE_URL_API}/coffees`;
    Number(minPrice)
      ? (url += "?min_price=" + minPrice + "&p=" + page)
      : (url += "?p=" + page);

    isSort && (url += "&sort=true");

    const response = await axios.get(url);
    const data = response.data;
    setCoffees(data.results);
    setTotalEntries(data.count);
    setLoading(false);
  };

  const changePage = (value: number) => {
    if (value === -1 && page > 1) setPage((prev) => prev - 1);
    else if (value === 1 && pageSize * page < totalEntries)
      setPage((prev) => prev + 1);
  };

  // function to sort the coffees by price
  useEffect(() => {
    if (page === 1) getCoffees();
    else setPage(1);
  }, [isSort]);

  // navigate to coffee details
  const getCoffeeDetails = (id: number) => {
    navigate(`/coffees/${id}`);
  };

  useEffect(() => {
    getCoffees();
  }, [minPrice, page, pageSize]);

  return (
    <>
      <MainNavbar />
      <Container maxWidth="xl" sx={{ display: "flex" }}>
        <Container maxWidth="sm" sx={{ minHeight: "100vh" }}>
          <Typography variant="h1" sx={{ mt: 10, mb: 5 }}>
            Our coffees!
          </Typography>
          <List>
            <ListItem sx={{ width: "100%", display: "flex" }}>
              <Box sx={{ width: "100%" }}>
                <TextField
                  label="Minimum price"
                  variant="standard"
                  value={minPrice ? minPrice : ""}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </Box>
              <Box
                onClick={() => {
                  setIsSort(!isSort);
                }}
                sx={{
                  display: "flex",
                  width: "300px",
                  alignItems: "center",
                  justifyContent: "right",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mr: 1,
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  ascending by price{" "}
                </Typography>
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    fontSize: "28px",
                    transition: "all 0.5s ease-in-out",
                    borderRadius: "50%",
                    bgcolor: isSort ? "#be9063" : "#fff",
                    color: isSort ? "#be9063" : "#333",
                    border: "3px solid #333",
                    boxSizing: "border-box",
                    "&:hover": {
                      cursor: "pointer",
                      transform: "translateX(+5px)",
                    },
                  }}
                ></Box>
              </Box>
            </ListItem>

            {coffees.map((coffee) => (
              <ListItem
                key={coffee.id}
                sx={{ width: "100%" }}
                onClick={() => getCoffeeDetails(coffee.id)}
              >
                <CoffeeItem coffee={coffee} />
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              margin: "4px 16px",
              justifyContent: "right",
            }}
          >
            <ArrowCircleLeftIcon
              sx={{ fontSize: "32px", color: "#be9063", marginRight: "8px" }}
              onClick={() => changePage(-1)}
            ></ArrowCircleLeftIcon>
            <ArrowCircleRightIcon
              sx={{ fontSize: "32px", color: "#be9063" }}
              onClick={() => changePage(+1)}
            ></ArrowCircleRightIcon>
          </Box>
          <Button
            onClick={() => navigate("/coffees/add")}
            variant="contained"
            sx={{
              mt: 5,
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "4px",
              letterSpacing: "1px",
              border: "2px solid #333",
              bgcolor: "#333",
              boxShadow: 4,
              transition: "all 0.5s ease-in-out",
              "&:hover": {
                boxShadow: 2,
                border: "2px solid #333",
                bgcolor: "#be9063",
                color: "#ffffff",
              },
            }}
          >
            <ArrowForwardIcon sx={{ marginRight: "8px" }} /> Add coffee
          </Button>
        </Container>
        <Container
          sx={{ display: { md: "none", sm: "none", xs: "none", lg: "block" } }}
        >
          <Box mt={20} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="macaroons" height="600px" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default Menu;
