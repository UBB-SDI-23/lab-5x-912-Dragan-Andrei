// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

// models
import { Blend } from "../models/Blend";

// utils
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL_API } from "../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";

// react components
import MainNavbar from "./MainNavbar";
import { Box } from "@mui/material";

// images
import supportImage from "../assets/images/sweets.png";

// create a new LocalCoffee objecet model for the edit coffee form
interface LocalCoffee {
  name: string;
  price: string;
  calories: string;
  quantity: string;
  vegan: boolean;
  blend_id: number;
}

const EditCoffee = () => {
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
  const [loading, setLoading] = useState<boolean>(true);
  const [lastGetBlendsCall, setLastGetBlendsCall] = useState<number>(0);

  const id = Number(useParams<{ id: string }>().id);

  const navigate = useNavigate();

  // function to get all blends based on the query provided
  const getBlends = async (blendQuery: string) => {
    try {
      const currentLastGetBlendsCall = lastGetBlendsCall;
      setLastGetBlendsCall((prev) => prev + 1);

      const response = await axios.get(
        `${BASE_URL_API}/blends/autocomplete?query=${blendQuery}`
      );
      const data = await response.data;

      if (currentLastGetBlendsCall === lastGetBlendsCall) setBlends(data);
    } catch (error) {
      console.error("Error getting blends: ", error);
    }
  };

  // debounce the getBlends function to prevent too many requests
  const debouncedGetBlends = useCallback(debounce(getBlends, 500), []);
  useEffect(() => {
    return () => {
      debouncedGetBlends.cancel();
    };
  }, [debouncedGetBlends]);

  // function to get a coffee based on id
  const getCoffee = async (id: number) => {
    setLoading(true);
    const response = await axios.get(`${BASE_URL_API}/coffees/${id}`);
    const data = await response.data;
    setLocalCoffee({
      name: data.name,
      price: data.price.toString(),
      calories: data.calories.toString(),
      quantity: data.quantity.toString(),
      vegan: data.vegan,
      blend_id: data.blend.id,
    });

    setLoading(false);
  };

  useEffect(() => {
    getBlends("");
  }, []);

  useEffect(() => {
    getCoffee(id);
  }, [id]);

  const editCoffee = async () => {
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

    // create the coffee object to be updated
    const updatedCoffee = {
      name: localCoffee.name,
      price: Number(localCoffee.price),
      calories: Number(localCoffee.calories),
      quantity: Number(localCoffee.quantity),
      vegan: localCoffee.vegan,
      blend_id: localCoffee.blend_id,
    };

    // send the put request
    try {
      const response = await axios.put(
        `${BASE_URL_API}/coffees/${id}`,
        updatedCoffee
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
                  sx={{ margin: "12px 4px", width: "30%" }}
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

                <Autocomplete
                  sx={{
                    margin: "12px 6px",
                    width: "40%",
                    display: "inline-block",
                  }}
                  options={blends}
                  getOptionLabel={(option) => option.name}
                  filterOptions={(x) => x}
                  renderInput={(params) => (
                    <TextField {...params} label="Select a blend" />
                  )}
                  onInputChange={(e, value) => debouncedGetBlends(value)}
                  onChange={(e, value) => {
                    if (value) {
                      setLocalCoffee({
                        ...localCoffee,
                        blend_id: Number(value.id),
                      });
                    }
                  }}
                />
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
