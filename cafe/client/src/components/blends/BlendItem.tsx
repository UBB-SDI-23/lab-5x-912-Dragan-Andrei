// material ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// css
import "../../assets/css/blends/blendItem.css";

// utils
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";

// objects
import { Blend } from "../../models/Blend";

const BlendItem = ({ blend }: { blend: Blend }) => {
  const [numberOfCoffees, setNumberOfCoffees] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getNumberOfCoffees = async () => {
    setLoading(true);
    const response = await axios.get(`${BASE_URL_API}/blends/${blend.id}`);
    const data = await response.data;
    setNumberOfCoffees(data.coffees.length);
    setLoading(false);
  };

  useEffect(() => {
    getNumberOfCoffees();
  }, []);

  return (
    <Box className="blend-item-container">
      <Box className="blend-item">
        <Typography className="blend-header" variant="h4">
          {blend.name} <span className="blend-sub-header">(strength level of {blend.level})</span>
        </Typography>
      </Box>
      {!loading ? (
        <Typography className="location-sub-header" variant="body1">
          Blend used by {numberOfCoffees} coffee(s)
        </Typography>
      ) : (
        <Typography className="location-sub-header" variant="body1">
          Blend used by ... coffee(s)
        </Typography>
      )}
    </Box>
  );
};

export default BlendItem;
