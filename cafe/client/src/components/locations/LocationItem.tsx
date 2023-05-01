// material ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// css
import "../../assets/css/locations/locationItem.css";

// utils
import { useState } from "react";

// interface for local custom location object
interface LocalLocation {
  id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  profit: number;
  description: string;
  total_revenue: number;
}

const LocationItem = ({ location }: { location: LocalLocation }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Box className="location-item-container">
      <Box className="location-item">
        <Typography className="location-header" variant="h4">
          {location.name} <span className="location-sub-header">({location.address})</span>
        </Typography>
      </Box>
      {!loading ? (
        <Typography className="location-sub-header" variant="body1">
          Generated a revenue of {location.total_revenue}$
        </Typography>
      ) : (
        <Typography className="location-sub-header" variant="body1">
          Generated a revenue of ...$
        </Typography>
      )}
    </Box>
  );
};

export default LocationItem;
