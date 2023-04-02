// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

// models
import { Blend } from "../models/Blend";
import { Coffee } from "../models/Coffee";

// utils
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL_API } from "../utils/constants";
import { useNavigate, useParams } from "react-router-dom";

// react components
import MainNavbar from "./MainNavbar";
import { Box } from "@mui/material";

// images
import supportImage from "../assets/images/sweets.png";

const EditCoffee = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [isVegan, setIsVegan] = useState<boolean>(false);
  const [blendId, setBlendId] = useState<number>(0);

  const [blends, setBlends] = useState<Blend[]>([]);
  const [error, setError] = useState<string>("");
  const [coffee, setCoffee] = useState<Coffee>({} as Coffee);
  const [loading, setLoading] = useState<boolean>(true);

  const id = Number(useParams<{ id: string }>().id);

  const navigate = useNavigate();

  // function to get all blends
  const getBlends = async () => {
    const response = await axios.get(`${BASE_URL_API}/blends/`);
    setBlends(response.data);
  };

  // function to get a coffee based on id
  const getCoffee = async (id: number) => {
    const response = await axios.get(`${BASE_URL_API}/coffees/${id}`);
    setCoffee(response.data);

    setName(response.data.name);
    setPrice(response.data.price.toString());
    setCalories(response.data.calories.toString());
    setQuantity(response.data.quantity.toString());
    setIsVegan(response.data.vegan);
    setBlendId(response.data.blend.id);

    setLoading(false);
  };

  useEffect(() => {
    getBlends();
  }, []);

  useEffect(() => {
    getCoffee(id);
  }, [id]);

  const editCoffee = async () => {
    if (
      name === "" ||
      price === "" ||
      calories === "" ||
      quantity === "" ||
      blendId === undefined
    ) {
      setError("Please complete all fields!");
      return;
    }

    // create the coffee object to be updated
    const coffee = {
      name: name,
      price: Number(price),
      calories: Number(calories),
      quantity: Number(quantity),
      vegan: isVegan,
      blend_id: blendId,
    };

    // send the put request
    try {
      const response = await axios.put(`${BASE_URL_API}/coffees/${id}`, coffee);
      if (response.status === 200) {
        navigate("/coffees");
        return;
      }
      setError(
        "Something went wrong! Make sure you filled all the fields correctly."
      );
    } catch (error) {
      setError(
        "Something went wrong! Make sure you filled all the fields correctly."
      );
    }
  };

  return (
    <>
      <MainNavbar />
      <Container maxWidth="xl" sx={{ display: { lg: "flex" } }}>
        <Container maxWidth="sm" sx={{ minHeight: "100vh", marginLeft: "0" }}>
          <Typography variant="h1" sx={{ mt: 10, mb: 2 }}>
            Let's update your coffee!
          </Typography>

          {error && (
            <Typography
              variant="body2"
              sx={{ color: "#e64545", mb: 4, marginLeft: "4px" }}
            >
              {error}
            </Typography>
          )}

          {!loading ? (
            <>
              <Box>
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  sx={{ margin: "12px 4px", width: "100%" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  id="outlined-basic"
                  label="Price"
                  variant="outlined"
                  sx={{ margin: "12px 4px", width: "30%" }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <TextField
                  id="outlined-basic"
                  label="Calories"
                  variant="outlined"
                  sx={{ margin: "12px 4px", width: "30%" }}
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />

                <TextField
                  id="outlined-basic"
                  label="Quantity"
                  variant="outlined"
                  sx={{ margin: "12px 4px", width: "30%" }}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <TextField
                  sx={{ margin: "12px 6px", width: "30%" }}
                  select
                  label="Vegan"
                  defaultValue={isVegan ? 1 : 0}
                  value={isVegan ? 1 : 0}
                  onChange={(e) => setIsVegan(Number(e.target.value) === 1)}
                >
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </TextField>

                <TextField
                  sx={{ margin: "12px 4px", width: "30%" }}
                  select
                  label="Blend"
                  defaultValue={blendId}
                  value={blendId}
                  onChange={(e) => setBlendId(Number(e.target.value))}
                >
                  <MenuItem value={0}>Select a blend</MenuItem>
                  {blends.map((blend) => (
                    <MenuItem key={blend.id} value={blend.id}>
                      {blend.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Button
                onClick={() => editCoffee()}
                variant="contained"
                sx={{
                  margin: "16px 6px",
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
                <ModeEditIcon sx={{ marginRight: "8px" }} /> Edit
              </Button>
            </>
          ) : (
            <Typography variant="h2">Loading...</Typography>
          )}
        </Container>
        <Container
          sx={{ display: { md: "none", sm: "none", xs: "none", lg: "block" } }}
        >
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="create coffee" height="600px" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default EditCoffee;
