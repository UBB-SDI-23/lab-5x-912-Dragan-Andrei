// material ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// css
import "../../assets/css/sales/saleItem.css";

// create a local custom interface for the sale object
interface LocalSale {
  id: number;
  location_id: number;
  sold_coffees: number;
  revenue: number;
  coffee_id: number;
  coffee_name: string;
  coffees_sold_worldwide: number;
}

const SaleItem = ({ sale }: { sale: LocalSale }) => {
  return (
    <Box className="sale-item-container">
      <Box className="sale-item">
        <Typography className="sale-item-text" variant="h4">
          {sale.coffee_name || "..."}{" "}
          <span>
            ({sale.sold_coffees} coffees) <Box className="sale-item-line" mx={2}></Box>
          </span>
        </Typography>
        <Box className="sale-item-line" mx={2}></Box>
        <Typography className="sale-item-text sale-item-text-left" variant="h4">
          {sale.revenue}$
        </Typography>
      </Box>
      <Typography className="sale-sub-header" variant="body1">
        Sold worldwide: {sale.coffees_sold_worldwide} coffee(s)!
      </Typography>
    </Box>
  );
};

export default SaleItem;
