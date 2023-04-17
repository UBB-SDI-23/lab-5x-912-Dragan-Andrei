// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";

// css
import "../../assets/css/sales/addSale.css";

// models
import { Coffee } from "../../models/Coffee";

// utils
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL_API } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";

// react components
import MainNavbar from "../MainNavbar";
import { Box } from "@mui/material";

// images
import supportImage from "../../assets/images/create_sale.jpg";

// create a new LocalCoffee objecet model for the add coffee form
interface LocalSale {
  coffeeId: number;
  soldCoffees: string;
}

// create an error object model
interface LocalError {
  generic: string;
  coffee: string;
  soldCoffees: string;
}

// create a model for the touched fields
interface TouchedFields {
  coffee: boolean;
  soldCoffees: boolean;
}

const CreateSale = () => {
  const [localSale, setLocalSale] = useState<LocalSale>({
    coffeeId: 0,
    soldCoffees: "",
  });

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    coffee: false,
    soldCoffees: false,
  });

  const [localError, setLocalError] = useState<LocalError>({
    generic: "",
    coffee: "",
    soldCoffees: "",
  });

  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [locationName, setLocationName] = useState<string>("");
  const [lastGetCoffeesCall, setLastGetCoffeesCall] = useState<number>(0);

  const navigate = useNavigate();

  const locationId = Number(useParams<{ id: string }>().id);

  // function to get the location based on id
  const getLocation = async (id: number) => {
    const response = await axios.get(`${BASE_URL_API}/locations/${id}`);
    const data = await response.data;
    setLocationName(data.name);
  };
  useEffect(() => {
    getLocation(locationId);
  }, [locationId]);

  // function to get all coffees based on the query provided
  const getCoffees = async (coffeeQuery: string) => {
    try {
      const currentLastGetCoffeesCall = lastGetCoffeesCall;
      setLastGetCoffeesCall((prev) => prev + 1);

      const response = await axios.get(`${BASE_URL_API}/coffees/autocomplete?query=${coffeeQuery}`);
      const data = await response.data;

      if (currentLastGetCoffeesCall === lastGetCoffeesCall) setCoffees(data);
    } catch (error) {
      setLocalError((prevError) => ({
        ...prevError,
        coffee: "Error fetching coffees",
      }));
    }
  };

  // debounce the getCoffees function to prevent too many requests
  const debouncedGetCoffees = useCallback(debounce(getCoffees, 500), []);
  useEffect(() => {
    return () => {
      debouncedGetCoffees.cancel();
    };
  }, [debouncedGetCoffees]);

  // get some coffees when the component mounts
  useEffect(() => {
    getCoffees("");
  }, []);

  // every time the localSale state changes, validate the data
  useEffect(() => {
    validateSaleData();
  }, [localSale]);

  // function to validate the sale data
  const validateSaleData = () => {
    // validate the coffee
    if (localSale.coffeeId === 0) {
      setLocalError((prevError) => ({
        ...prevError,
        coffee: "Coffee is required",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        coffee: "",
      }));
    }

    // validate the number of sold coffees
    if (localSale.soldCoffees === "") {
      setLocalError((prevError) => ({
        ...prevError,
        soldCoffees: "Number of sold coffees is required",
      }));
    } else if (!Number(localSale.soldCoffees)) {
      setLocalError((prevError) => ({
        ...prevError,
        soldCoffees: "The number of sold coffees must be an integer number",
      }));
    } else if (!Number.isInteger(Number(localSale.soldCoffees))) {
      setLocalError((prevError) => ({
        ...prevError,
        soldCoffees: "The number of sold coffees must be an integer number",
      }));
    } else if (Number(localSale.soldCoffees) < 0) {
      setLocalError((prevError) => ({
        ...prevError,
        soldCoffees: "The number of sold coffees cannot be negative",
      }));
    } else {
      setLocalError((prevError) => ({
        ...prevError,
        soldCoffees: "",
      }));
    }
  };

  // function that adds a new sale to the database
  const addSale = async () => {
    // touch all the fields so that the errors show up
    setTouchedFields((prevTouched) => ({
      ...prevTouched,
      coffee: true,
      soldCoffees: true,
    }));

    // validate the data
    validateSaleData();

    // if there are any errors, return
    if (localError.coffee !== "" || localError.soldCoffees !== "") return;

    // create the sale object to send to the server
    const addedSale = [
      {
        coffee_id: localSale.coffeeId,
        sold_coffees: localSale.soldCoffees,
        revenue: 0,
      },
    ];

    // send the post request
    try {
      const response = await axios.post(`${BASE_URL_API}/locations/${locationId}/coffees`, addedSale);
      if (response.status >= 200 && response.status < 300) {
        navigate(`/locations/${locationId}`);
        return;
      }

      // if the response is not a success, then something went wrong
      setLocalError((prevError) => ({
        ...prevError,
        generic: "Something went wrong! Make sure the coffee is not already added for this location.",
      }));
    } catch (error: any) {
      if (error.response.data) {
        if (error.response.data.sold_coffees) {
          setLocalError((prevError) => ({
            ...prevError,
            soldCoffees: error.response.sold_coffees.name,
          }));
          setLocalSale((prevSale) => ({ ...prevSale, soldCoffees: "" }));
        } else {
          setLocalError((prevError) => ({
            ...prevError,
            generic: "Something went wrong! Make sure the coffee is not already added for this location.",
          }));
        }
      } else {
        setLocalError((prevError) => ({
          ...prevError,
          generic: "Something went wrong! Make sure the coffee is not already added for this location.",
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
            Create a new sale for {locationName}
          </Typography>

          {localError.generic && (
            <Typography variant="body2" sx={{ color: "#e64545", mb: 4, marginLeft: "4px" }}>
              {localError.generic}
            </Typography>
          )}

          <Box className="create-coffee-fields">
            <Autocomplete
              disableClearable={true}
              options={coffees}
              getOptionLabel={(option) => option.name}
              filterOptions={(x) => x}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={localError.coffee && touchedFields.coffee ? true : false}
                  onBlur={(e) =>
                    setTouchedFields((prevTouched) => ({
                      ...prevTouched,
                      blend: true,
                    }))
                  }
                  helperText={localError.coffee && touchedFields.coffee && localError.coffee}
                  label="Select a coffee"
                />
              )}
              onInputChange={(e, value) => debouncedGetCoffees(value)}
              onChange={(e, value) => {
                if (value) {
                  setLocalSale((prevSale) => ({
                    ...prevSale,
                    coffeeId: Number(value.id),
                  }));
                  5;
                }
              }}
              disablePortal
              className="autocomplete-coffee"
            />

            <TextField
              label="Sold Coffees"
              variant="outlined"
              value={localSale.soldCoffees}
              onChange={(e) => setLocalSale((prevSale) => ({ ...prevSale, soldCoffees: e.target.value }))}
              className="sold-coffees-field"
              error={localError.soldCoffees && touchedFields.soldCoffees ? true : false}
              onBlur={(e) =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  soldCoffees: true,
                }))
              }
              helperText={localError.soldCoffees && touchedFields.soldCoffees && localError.soldCoffees}
            />
          </Box>

          <Button
            onClick={() => addSale()}
            variant="contained"
            className="create-sale-button"
            sx={{
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <AddIcon sx={{ mr: "8px" }} /> Create
          </Button>
        </Container>
        <Container className="create-sale-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="create sale" height="600px" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default CreateSale;
