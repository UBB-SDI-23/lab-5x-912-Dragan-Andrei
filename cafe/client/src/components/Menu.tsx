// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
  const navigate = useNavigate();

  // function to get all coffees
  const getCoffees = async () => {
    setLoading(true);

    let url = `${BASE_URL_API}/coffees/`;
    Number(minPrice) ? (url += "?min_price=" + minPrice) : url;

    const response = await axios.get(url);
    setCoffees(response.data);
    console.log(response.data);
    setLoading(false);
  };

  // navigate to coffee details
  const getCoffeeDetails = (id: number) => {
    navigate(`/coffees/${id}`);
  };

  useEffect(() => {
    getCoffees();
  }, [minPrice]);

  return (
    <>
      <MainNavbar />
      <Container maxWidth="xl" sx={{ display: "flex" }}>
        <Container maxWidth="sm" sx={{ minHeight: "100vh" }}>
          <Typography variant="h1" sx={{ mt: 10, mb: 5 }}>
            Our coffees!
          </Typography>
          <List>
            <ListItem sx={{ width: "100%" }}>
              <TextField
                label="Minimum price"
                variant="standard"
                value={minPrice ? minPrice : ""}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </ListItem>
            {coffees.length === 0 && (
              <Typography variant="h2">Loading...</Typography>
            )}
            {coffees.length > 0 &&
              coffees.map((coffee) => (
                <ListItem
                  key={coffee.id}
                  sx={{ width: "100%" }}
                  onClick={() => getCoffeeDetails(coffee.id)}
                >
                  <CoffeeItem coffee={coffee} />
                </ListItem>
              ))}
          </List>
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
