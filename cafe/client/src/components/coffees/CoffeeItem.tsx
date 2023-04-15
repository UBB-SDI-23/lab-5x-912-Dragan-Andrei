// material ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// objects
import { Coffee } from "../../models/Coffee";

const CoffeeItem = ({ coffee }: { coffee: Coffee }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        boxShadow: "none",
        transition: "all .5s ease-in-out",
        "&:hover": {
          padding: "16px",
          borderRadius: "8px",
          boxShadow: 2,
          cursor: "pointer",
        },
      }}
    >
      <Typography variant="h4">{coffee.name}</Typography>
      <Box
        mx={2}
        sx={{
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 0,
          minWidth: 0,
          borderBottom: "2px dashed #333",
          transform: "translateY(-8px)",
        }}
      ></Box>
      <Typography variant="h4">{coffee.price}$</Typography>
    </Box>
  );
};

export default CoffeeItem;
