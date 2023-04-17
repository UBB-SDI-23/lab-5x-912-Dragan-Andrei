// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

// css
import "../../assets/css/coffees/addCoffee.css";

// models
import { Blend } from "../../models/Blend";

// utils
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL_API } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";
import BadWords from "bad-words";

// react components
import MainNavbar from "../MainNavbar";
import { Box } from "@mui/material";

// images
import supportImage from "../../assets/images/edit_coffee.jpg";

// create a new LocalCoffee objecet model for the edit coffee form
interface LocalCoffee {
  name: string;
  price: string;
  calories: string;
  quantity: string;
  vegan: boolean;
  blend_id: number;
}

// create an error object model
interface LocalError {
  generic: string;
  name: string;
  price: string;
  calories: string;
  quantity: string;
  blend: string;
}

// create a model for the touched fields
interface TouchedFields {
  name: boolean;
  price: boolean;
  calories: boolean;
  quantity: boolean;
  vegan: boolean;
  blend: boolean;
}

const EditCoffee = () => {
  // initial variables
  const [localCoffee, setLocalCoffee] = useState<LocalCoffee>({
    name: "",
    price: "",
    calories: "",
    quantity: "",
    vegan: false,
    blend_id: 0,
  });

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    name: false,
    price: false,
    calories: false,
    quantity: false,
    vegan: false,
    blend: false,
  });

  const [localError, setLocalError] = useState<LocalError>({
    generic: "",
    name: "",
    price: "",
    calories: "",
    quantity: "",
    blend: "",
  });

  const [blends, setBlends] = useState<Blend[]>([]);
  const [defaultBlend, setDefaultBlend] = useState<Blend | null>(null);
  const [lastGetBlendsCall, setLastGetBlendsCall] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  const id = Number(useParams<{ id: string }>().id);

  const navigate = useNavigate();

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

    // get the blend associated with the coffee
    if (data.blend.id !== 0) {
      getBlendById(data.blend.id);
    }

    setLoading(false);
  };
  useEffect(() => {
    getCoffee(id);
  }, [id]);

  // function to get a blend by its given id
  const getBlendById = async (id: number) => {
    try {
      const respone = await axios.get(`${BASE_URL_API}/blends/${id}`);
      const data = await respone.data;
      setDefaultBlend(data);
    } catch (error) {
      setLocalError((prevError) => ({
        ...prevError,
        blend: "Error fetching blends",
      }));
    }
  };

  // function to get all blends based on the query provided
  const getBlends = async (blendQuery: string) => {
    try {
      const currentLastGetBlendsCall = lastGetBlendsCall;
      setLastGetBlendsCall((prev) => prev + 1);

      const response = await axios.get(`${BASE_URL_API}/blends/autocomplete?query=${blendQuery}`);
      const data = await response.data;

      if (currentLastGetBlendsCall === lastGetBlendsCall) setBlends(data);
    } catch (error) {
      setLocalError((prevError) => ({
        ...prevError,
        blend: "Error fetching blends",
      }));
    }
  };
  useEffect(() => {
    // we also want to give some random options to the user when they first open the page
    getBlends("");
  }, []);

  // debounce the getBlends function to prevent too many requests
  const debouncedGetBlends = useCallback(debounce(getBlends, 500), []);
  useEffect(() => {
    return () => {
      debouncedGetBlends.cancel();
    };
  }, [debouncedGetBlends]);

  // every time the localCoffee state changes, validate the data
  useEffect(() => {
    validateCoffeeData();
  }, [localCoffee]);

  // function to validate the coffee data
  const validateCoffeeData = () => {
    // validate the name
    if (localCoffee.name === "") {
      setLocalError((prevError) => ({
        ...prevError,
        name: "Name is required",
      }));
    } else if (localCoffee.name.length > 50) {
      setLocalError((prevError) => ({
        ...prevError,
        name: "Name cannot be longer than 50 characters",
      }));
    } else if (new BadWords().isProfane(localCoffee.name)) {
      setLocalError((prevError) => ({
        ...prevError,
        name: "Name cannot contain profanity",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        name: "",
      }));
    }

    // validate the price
    if (localCoffee.price === "") {
      setLocalError((prevError) => ({
        ...prevError,
        price: "Price is required",
      }));
    } else if (!Number(localCoffee.price)) {
      setLocalError((prevError) => ({
        ...prevError,
        price: "Price must be a number",
      }));
    } else if (Number(localCoffee.price) < 0) {
      setLocalError((prevError) => ({
        ...prevError,
        price: "Price cannot be negative",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        price: "",
      }));
    }

    // validate the calories
    if (localCoffee.calories === "") {
      setLocalError((prevError) => ({
        ...prevError,
        calories: "Calories is required",
      }));
    } else if (!Number(localCoffee.calories)) {
      setLocalError((prevError) => ({
        ...prevError,
        calories: "Calories must be a number",
      }));
    } else if (!Number.isInteger(Number(localCoffee.calories))) {
      setLocalError((prevError) => ({
        ...prevError,
        calories: "Calories must be an integer",
      }));
    } else if (Number(localCoffee.calories) < 0) {
      setLocalError((prevError) => ({
        ...prevError,
        calories: "Calories cannot be negative",
      }));
    } else if (Number(localCoffee.calories) > 1000) {
      setLocalError((prevError) => ({
        ...prevError,
        calories: "Calories cannot be greater than 1000",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        calories: "",
      }));
    }

    // validate the quantity
    if (localCoffee.quantity === "") {
      setLocalError((prevError) => ({
        ...prevError,
        quantity: "Quantity is required",
      }));
    } else if (!Number(localCoffee.quantity)) {
      setLocalError((prevError) => ({
        ...prevError,
        quantity: "Quantity must be a number",
      }));
    } else if (Number(localCoffee.quantity) < 0) {
      setLocalError((prevError) => ({
        ...prevError,
        quantity: "Quantity cannot be negative",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        quantity: "",
      }));
    }

    // validate the blend
    if (localCoffee.blend_id === 0) {
      setLocalError((prevError) => ({
        ...prevError,
        blend: "Blend is required",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        blend: "",
      }));
    }
  };

  // function to update a coffee
  const editCoffee = async () => {
    // touch all the fields so that the errors show up
    setTouchedFields((prevTouched) => ({
      ...prevTouched,
      name: true,
      price: true,
      calories: true,
      quantity: true,
      blend: true,
    }));

    // validate the data
    validateCoffeeData();

    // if there are any errors, return
    if (localError.name !== "" || localError.price !== "" || localError.calories !== "" || localError.quantity !== "" || localError.blend !== "") return;

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
      const response = await axios.put(`${BASE_URL_API}/coffees/${id}`, updatedCoffee);
      if (response.status >= 200 && response.status < 300) {
        navigate("/coffees");
        return;
      }

      // if the response is not a successful one, then something went wrong
      setLocalError((prevError) => ({
        ...prevError,
        generic: "Something went wrong! Make sure you filled all the fields correctly.",
      }));
    } catch (error: any) {
      if (error.response.data) {
        if (error.response.data.name) {
          setLocalError((prevError) => ({
            ...prevError,
            name: error.response.data.name,
          }));
          setLocalCoffee((prevCoffee) => ({ ...prevCoffee, name: "" }));
        }
        if (error.response.data.price) {
          setLocalError((prevError) => ({
            ...prevError,
            price: error.response.data.price,
          }));
          setLocalCoffee((prevCoffee) => ({ ...prevCoffee, price: "" }));
        }
        if (error.response.data.calories) {
          setLocalError((prevError) => ({
            ...prevError,
            calories: error.response.data.calories,
          }));
          setLocalCoffee((prevCoffee) => ({ ...prevCoffee, calories: "" }));
        }
        if (error.response.data.quantity) {
          setLocalError((prevError) => ({
            ...prevError,
            quantity: error.response.data.quantity,
          }));
          setLocalCoffee((prevCoffee) => ({ ...prevCoffee, quantity: "" }));
        }
      } else {
        setLocalError((prevError) => ({
          ...prevError,
          generic: "Something went wrong! Make sure you filled all the fields correctly.",
        }));
      }
    }
  };

  return (
    <>
      <MainNavbar />
      <Container className="create-coffee-content-container">
        <Container className="create-coffee-content" sx={{ minHeight: "calc(100vh - 160px)" }}>
          <Typography variant="h1" className="create-coffee-big-header" sx={{ mt: 10, mb: 2 }}>
            Edit coffee!
          </Typography>

          {localError.generic && (
            <Typography variant="body2" sx={{ color: "#e64545", mb: 4, marginLeft: "4px" }}>
              {localError.generic}
            </Typography>
          )}

          {!loading ? (
            <Box className="create-coffee-fields">
              <TextField
                label="Name"
                variant="outlined"
                sx={{ margin: "12px 0px", width: "96%" }}
                value={localCoffee.name}
                onChange={(e) => setLocalCoffee((prevCoffee) => ({ ...prevCoffee, name: e.target.value }))}
                error={localError.name && touchedFields.name ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    name: true,
                  }))
                }
                helperText={localError.name && touchedFields.name && localError.name}
              />
              <TextField
                select
                label="Vegan"
                defaultValue={localCoffee.vegan ? 1 : 0}
                value={localCoffee.vegan ? 1 : 0}
                onChange={(e) =>
                  setLocalCoffee((prevCoffee) => ({
                    ...prevCoffee,
                    vegan: Number(e.target.value) === 1,
                  }))
                }
                className="vegan-field"
              >
                <MenuItem value={1}>Yes</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </TextField>

              {defaultBlend && (
                <Autocomplete
                  disableClearable={true}
                  options={blends}
                  getOptionLabel={(option) => option.name}
                  filterOptions={(x) => x}
                  defaultValue={defaultBlend}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={localError.blend && touchedFields.blend ? true : false}
                      onBlur={(e) =>
                        setTouchedFields((prevTouched) => ({
                          ...prevTouched,
                          blend: true,
                        }))
                      }
                      helperText={localError.blend && touchedFields.blend && localError.blend}
                      label="Select a blend"
                    />
                  )}
                  onInputChange={(e, value) => debouncedGetBlends(value)}
                  onChange={(e, value) => {
                    if (value) {
                      setLocalCoffee((prevCoffee) => ({
                        ...prevCoffee,
                        blend_id: Number(value.id),
                      }));
                    }
                  }}
                  disablePortal
                  className="autocomplete-blend"
                />
              )}

              <TextField
                label="Price"
                variant="outlined"
                value={localCoffee.price}
                onChange={(e) => setLocalCoffee((prevCoffee) => ({ ...prevCoffee, price: e.target.value }))}
                className="price-field"
                error={localError.price && touchedFields.price ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    price: true,
                  }))
                }
                helperText={localError.price && touchedFields.price && localError.price}
              />

              <TextField
                label="Calories"
                variant="outlined"
                value={localCoffee.calories}
                onChange={(e) => setLocalCoffee((prevCoffee) => ({ ...prevCoffee, calories: e.target.value }))}
                className="calories-field"
                error={localError.calories && touchedFields.calories ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    calories: true,
                  }))
                }
                helperText={localError.calories && touchedFields.calories && localError.calories}
              />

              <TextField
                label="Quantity"
                variant="outlined"
                value={localCoffee.quantity}
                onChange={(e) => setLocalCoffee((prevCoffee) => ({ ...prevCoffee, quantity: e.target.value }))}
                className="quantity-field"
                error={localError.quantity && touchedFields.quantity ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    quantity: true,
                  }))
                }
                helperText={localError.quantity && touchedFields.quantity && localError.quantity}
              />
            </Box>
          ) : (
            <Typography variant="h2">Loading...</Typography>
          )}

          <Button
            onClick={() => editCoffee()}
            variant="contained"
            className="create-coffee-button"
            sx={{
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <ModeEditIcon sx={{ mr: "8px" }} /> Edit
          </Button>
        </Container>
        <Container className="create-coffee-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="edit coffee" height="600px" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default EditCoffee;
