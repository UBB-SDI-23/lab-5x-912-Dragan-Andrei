// material ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// css
import "../../assets/css/blends/blendItem.css";

// create a local custom interface for the Blend object
interface LocalBlend {
  id: number;
  name: string;
  description: string;
  country_of_origin: string;
  level: number;
  in_stock: boolean;
  used_by: number;
}

const BlendItem = ({ blend }: { blend: LocalBlend }) => {
  return (
    <Box className="blend-item-container">
      <Box className="blend-item">
        <Typography className="blend-header" variant="h4">
          {blend.name} <span className="blend-sub-header">(strength level of {blend.level})</span>
        </Typography>
      </Box>
      <Typography className="location-sub-header" variant="body1">
        Blend used by {blend.used_by} coffee(s)
      </Typography>
    </Box>
  );
};

export default BlendItem;
