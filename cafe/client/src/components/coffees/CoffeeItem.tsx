// material ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// css
import "../../assets/css/coffees/coffeeItem.css";

// create local coffee object
interface LocalCoffee {
  id: number;
  name: string;
  price: number;
  calories: number;
  quantity: number;
  vegan: boolean;
  blend_id: number;
  blend_count: number;
}

const CoffeeItem = ({ coffee }: { coffee: LocalCoffee }) => {
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
      <Typography className="coffee-sub-header" variant="body1">
        Blend popularity: used for {coffee.blend_count} coffee(s)!
      </Typography>
    </Box>
  );
};

export default CoffeeItem;
