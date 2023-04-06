// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// models
import { Blend } from "../models/Blend";

// utils
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL_API } from "../utils/constants";
import { useNavigate } from "react-router-dom";

// react components
import MainNavbar from "./MainNavbar";
import { Box } from "@mui/material";

// images
import supportImage from "../assets/images/sweets.png";

// create a new LocalCoffee objecet model for the add coffee form
interface LocalCoffee {
  name: string;
  price: string;
  calories: string;
  quantity: string;
  vegan: boolean;
  blend_id: number;
}

const AddCoffee = () => {
  const [localCoffee, setLocalCoffee] = useState<LocalCoffee>({
    name: "",
    price: "",
    calories: "",
    quantity: "",
    vegan: false,
    blend_id: 0,
  });
  const [blends, setBlends] = useState<Blend[]>([]);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // function to get all blends
  const getBlends = async () => {
    const response = await axios.get(`${BASE_URL_API}/blends/`);
    setBlends(response.data);
  };

  useEffect(() => {
    getBlends();
  }, []);

  const addCoffee = async () => {
    if (
      localCoffee.name === "" ||
      localCoffee.price === "" ||
      localCoffee.calories === "" ||
      localCoffee.quantity === "" ||
      localCoffee.blend_id === undefined
    ) {
      setError("Please complete all fields!");
      return;
    }

    // create the coffee object to send to the server
    const addedCoffee = {
      name: localCoffee.name,
      price: Number(localCoffee.price),
      calories: Number(localCoffee.calories),
      quantity: Number(localCoffee.quantity),
      vegan: localCoffee.vegan,
      blend_id: localCoffee.blend_id,
    };

    // send the post request
    try {
      const response = await axios.post(
        `${BASE_URL_API}/coffees/`,
        addedCoffee
      );
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
            Let's create a new coffee!
          </Typography>

          {error && (
            <Typography
              variant="body2"
              sx={{ color: "#e64545", mb: 4, marginLeft: "4px" }}
            >
              {error}
            </Typography>
          )}

          <Box>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              sx={{ margin: "12px 4px", width: "100%" }}
              value={localCoffee.name}
              onChange={(e) =>
                setLocalCoffee({ ...localCoffee, name: e.target.value })
              }
            />

            <TextField
              id="outlined-basic"
              label="Price"
              variant="outlined"
              sx={{ margin: "12px 4px", width: "30%" }}
              value={localCoffee.price}
              onChange={(e) =>
                setLocalCoffee({ ...localCoffee, price: e.target.value })
              }
            />

            <TextField
              id="outlined-basic"
              label="Calories"
              variant="outlined"
              sx={{ margin: "12px 4px", width: "30%" }}
              value={localCoffee.calories}
              onChange={(e) =>
                setLocalCoffee({ ...localCoffee, calories: e.target.value })
              }
            />

            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              sx={{ margin: "12px 4px", width: "30%" }}
              value={localCoffee.quantity}
              onChange={(e) =>
                setLocalCoffee({ ...localCoffee, quantity: e.target.value })
              }
            />

            <TextField
              sx={{ margin: "12px 6px", width: "30%" }}
              select
              label="Vegan"
              defaultValue={localCoffee.vegan ? 1 : 0}
              value={localCoffee.vegan ? 1 : 0}
              onChange={(e) =>
                setLocalCoffee({
                  ...localCoffee,
                  vegan: Number(e.target.value) === 1,
                })
              }
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </TextField>

            <TextField
              sx={{ margin: "12px 4px", width: "30%" }}
              select
              label="Blend"
              defaultValue={localCoffee.blend_id}
              value={localCoffee.blend_id}
              onChange={(e) =>
                setLocalCoffee({
                  ...localCoffee,
                  blend_id: Number(e.target.value),
                })
              }
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
            onClick={() => addCoffee()}
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
            <AddIcon sx={{ marginRight: "8px" }} /> Create
          </Button>
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

export default AddCoffee;
