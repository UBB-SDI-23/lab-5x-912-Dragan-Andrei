// material ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// css
import "../../assets/css/locations/locationItem.css";

// utils
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";

// objects
import { Location } from "../../models/Location";
import { Sale } from "../../models/Sale";

const LocationItem = ({ location }: { location: Location }) => {
  const [locationRevenue, setLocationRevenue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getRevenue = async () => {
    setLoading(true);
    let totalRevenue = 0;
    let url = `${BASE_URL_API}/locations/${location.id}`;

    while (url !== null) {
      const response = await axios.get(url);
      const locationData = await response.data;

      if (locationData.sales.results) {
        locationData.sales.results.forEach((sale: Sale) => {
          totalRevenue += sale.revenue;
        });
      }
      totalRevenue = Math.round(totalRevenue * 100) / 100;
      url = locationData.sales.next;
    }
    setLocationRevenue(totalRevenue);
    setLoading(false);
  };
  useEffect(() => {
    getRevenue();
  }, []);

  return (
    <Box className="location-item-container">
      <Box className="location-item">
        <Typography className="location-header" variant="h4">
          {location.name} <span className="location-sub-header">({location.address})</span>
        </Typography>
      </Box>
      {!loading ? (
        <Typography className="location-sub-header" variant="body1">
          Generated a revenue of {locationRevenue}$
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
