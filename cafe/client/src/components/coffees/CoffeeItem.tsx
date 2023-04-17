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
    const blendId = coffee.blend_id;
    const response = await axios.get(`${BASE_URL_API}/blends/${blendId}`);
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
        <Typography className="coffee-item-text" variant="h4">
          {coffee.name}
          <span>
            <Box className="coffee-item-line" mx={2}></Box>
          </span>
        </Typography>
        <Box className="coffee-item-line" mx={2}></Box>
        <Typography className="coffee-item-text coffee-item-text-left" variant="h4">
          {coffee.price}$
        </Typography>
      </Box>
      {!loading ? (
        <Typography className="coffee-sub-header" variant="body1">
          Blend popularity: used for {blendUsage} coffee(s)!
        </Typography>
      ) : (
        <Typography className="coffee-sub-header" variant="body1">
          Blend popularity: used for ... coffee(s)!
        </Typography>
      )}
    </Box>
  );
};

export default CoffeeItem;
