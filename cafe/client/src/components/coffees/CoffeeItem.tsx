// material ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// css
import "../../assets/css/coffees/coffeeItem.css";

// utils
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";

// create local coffee object
interface LocalCoffee {
  id: number;
  name: string;
  price: number;
  calories: number;
  quantity: number;
  vegan: boolean;
  blend_id: number;
}

const CoffeeItem = ({ coffee }: { coffee: LocalCoffee }) => {
  const [blendUsage, setBlendUsage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getBlendUsage = async () => {
    setLoading(true);
    const blend_id = coffee.blend_id;
    const response = await axios.get(`${BASE_URL_API}/blends/${blend_id}`);
    const data = await response.data;
    setBlendUsage(data.coffees.length);
    setLoading(false);
  };
  useEffect(() => {
    getBlendUsage();
  }, []);

  return (
    <Box className="coffee-item-container">
      <Box className="coffee-item">
        <Typography variant="h4">{coffee.name}</Typography>
        <Box className="coffee-item-line" mx={2}></Box>
        <Typography variant="h4">{coffee.price}$</Typography>
      </Box>
      {!loading ? (
        <Typography className="sub-header" variant="body1">
          Blend popularity: used for {blendUsage} coffee(s)!
        </Typography>
      ) : (
        <Typography className="sub-header" variant="body1">
          Blend popularity: used for ... coffee(s)!
        </Typography>
      )}
    </Box>
  );
};

export default CoffeeItem;
