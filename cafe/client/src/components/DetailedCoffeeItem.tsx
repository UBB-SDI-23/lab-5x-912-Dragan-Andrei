// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// utils
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL_API } from "../utils/constants";
import axios from "axios";
import { useParams } from "react-router-dom";

// models
import { Coffee } from "../models/Coffee";

// react components
import MainNavbar from "./MainNavbar";

// images
import supportImage from "../assets/images/coffee3.png";

const DetailedCoffeeItem = () => {
  const [coffee, setCoffee] = useState<Coffee>({} as Coffee);
  const id = Number(useParams<{ id: string }>().id);

  // function to get a coffee based on id
  const getCoffee = async (id: number) => {
    const response = await axios.get(`${BASE_URL_API}/coffees/${id}`);
    setCoffee(response.data);
  };

  useEffect(() => {
    getCoffee(id);
  }, [id]);

  return (
    <>
      <MainNavbar />
      <Container maxWidth="xl" sx={{ display: "flex" }}>
        <Container maxWidth="sm" sx={{ minHeight: "100vh" }}>
          <Typography variant="h1" sx={{ mt: 10, mb: 2 }}>
            {coffee.name ? coffee.name : "Loading..."}
          </Typography>

          {coffee.name && (
            <>
              <Box
                mt={2}
                mb={8}
                sx={{
                  display: "flex",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
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
                      backgroundColor: "#be9063",
                    },
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    ml: 3,
                    color: "#333333",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    letterSpacing: "1px",
                    border: "2px solid #333",
                    boxSizing: "border-box",
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
                  DELETE
                </Button>
              </Box>

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Price:</Typography>
                <Typography ml={2} variant="h3">
                  {coffee.price}$
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Calories:</Typography>
                <Typography ml={2} variant="h3">
                  {coffee.calories}kcal
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Quantity:</Typography>
                <Typography ml={2} variant="h3">
                  {coffee.quantity}ml
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Vegan:</Typography>
                <Typography ml={2} variant="h3">
                  {coffee.vegan ? "Yes" : "No"}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Blend:</Typography>
                <Typography ml={2} variant="h3">
                  {coffee.blend.name}
                  <Typography mt={1} variant="body1">
                    {coffee.blend.description} Originally from{" "}
                    {coffee.blend.country_of_origin}, having a strngth level of{" "}
                    {coffee.blend.level}.
                  </Typography>

                  <Box mt={1} sx={{ display: "flex" }}>
                    <Typography variant="body2">In stock:</Typography>
                    <Typography ml={1} variant="body2">
                      {coffee.blend.in_stock ? "Yes" : "No"}
                    </Typography>
                  </Box>
                </Typography>
              </Box>
            </>
          )}
        </Container>
        <Container
          sx={{ display: { md: "none", sm: "none", xs: "none", lg: "block" } }}
        >
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="coffee" height="600px" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default DetailedCoffeeItem;
