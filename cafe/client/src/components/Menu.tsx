// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";

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
  const navigate = useNavigate();

  // function to get all coffees
  const getCoffees = async () => {
    setLoading(true);
    const response = await axios.get(`${BASE_URL_API}/coffees`);
    setCoffees(response.data);
    setLoading(false);
  };

  // navigate to coffee details
  const getCoffeeDetails = (id: number) => {
    navigate(`/coffees/${id}`);
  }

  useEffect(() => {
    getCoffees();
  }, []);

  return (
    <>
      <MainNavbar />
      <Container maxWidth="xl" sx={{ display: "flex" }}>
        <Container maxWidth="sm" sx={{ minHeight: "100vh" }}>
          <Typography variant="h1" sx={{ mt: 10, mb: 5 }}>
            Our coffees!
          </Typography>
          <List>
            {coffees.map((coffee) => (
              <ListItem key={coffee.id} sx={{ width: "100%" }} onClick={() => getCoffeeDetails(coffee.id)}>
                <CoffeeItem coffee={coffee} />
              </ListItem>
            ))}
          </List>
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
