// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// css
import "../../assets/css/coffees/detailedCoffee.css";

// utils
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// models
import { Coffee } from "../../models/Coffee";

// react components
import MainNavbar from "../MainNavbar";
import WarningModal from "../WarningModal";

// images
import supportImage1 from "../../assets/images/coffee1.png";
import supportImage2 from "../../assets/images/coffee2.png";
import supportImage3 from "../../assets/images/coffee3.png";
import supportImage4 from "../../assets/images/coffee4.png";

const DetailedCoffeeItem = () => {
  const [coffee, setCoffee] = useState<Coffee>({} as Coffee);
  const [error, setError] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const id = Number(useParams<{ id: string }>().id);

  const navigate = useNavigate();

  // function to get a coffee based on id
  const getCoffee = async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL_API}/coffees/${id}`);
      setCoffee(response.data);
    } catch (error) {
      setError("The coffee could not be loaded! Please try again later.");
    }
  };

  // function to delete a coffee based on id
  const deleteCoffee = async (id: number) => {
    try {
      const respone = await axios.delete(`${BASE_URL_API}/coffees/${id}`);
      if (respone.status >= 200 && respone.status < 300) {
        navigate("/coffees");
        return;
      } else {
        setError("The coffee could not be deleted! Please try again later.");
      }
    } catch (error) {
      setError("The coffee could not be deleted! Please try again later.");
    }
  };

  useEffect(() => {
    getCoffee(id);
  }, [id]);

  return (
    <>
      <MainNavbar />
      {deleteModal && (
        <WarningModal message="Are you sure you want to delete this coffee?" accept={() => deleteCoffee(coffee.id)} reject={() => setDeleteModal(false)} />
      )}
      <Container className="coffee-content-container" sx={{ minHeight: "100vh" }}>
        <Container className="coffee-content">
          <Typography variant="h1" sx={{ mt: 10, mb: 2 }}>
            {coffee.name ? coffee.name : "Loading..."}
          </Typography>

          <Typography variant="body2" sx={{ color: "#e64545", marginLeft: "2px" }}>
            {error}
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
                  className="edit-coffee-button"
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
                  className="delete-coffee-button"
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
                    {coffee.blend.description} Originally from {coffee.blend.country_of_origin}, having a strngth level of {coffee.blend.level}.
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
        <Container className="coffee-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            {(coffee.id % 4) + 1 == 1 && <img src={supportImage1} alt="coffee" height="600px" />}
            {(coffee.id % 4) + 1 == 2 && <img src={supportImage2} alt="coffee" height="600px" />}
            {(coffee.id % 4) + 1 == 3 && <img src={supportImage3} alt="coffee" height="600px" />}
            {(coffee.id % 4) + 1 == 4 && <img src={supportImage4} alt="coffee" height="600px" />}
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default DetailedCoffeeItem;
