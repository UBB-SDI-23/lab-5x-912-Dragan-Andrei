// material ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// css
import "../../assets/css/sales/saleItem.css";

// utils
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";

// objects
import { Sale } from "../../models/Sale";

const SaleItem = ({ sale }: { sale: Sale }) => {
  const [coffeeName, setCoffeeName] = useState<string>("");
  const [totalSales, setTotalSales] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // function to get the name of a related coffee for a certain sale
  const getRelatedCoffeeName = async (coffeeId: number) => {
    const response = await axios.get(`${BASE_URL_API}/coffees/${coffeeId}`);
    const data = await response.data;
    setCoffeeName(data.name);
  };
  useEffect(() => {
    getRelatedCoffeeName(sale.coffee_id);
  }, []);

  // function to get the total number of sales for a certain coffee
  const getTotalSales = async () => {
    setLoading(true);
    let totalSales = 0;
    let url = `${BASE_URL_API}/coffees/${sale.coffee_id}?page_size=1000`;

    while (url !== null) {
      const response = await axios.get(url);
      const coffeeData = await response.data;

      if (coffeeData.sales.results) {
        coffeeData.sales.results.forEach((sale: Sale) => {
          totalSales += sale.sold_coffees;
        });
      }
      url = coffeeData.sales.next;
    }
    setTotalSales(totalSales);
    setLoading(false);
  };
  useEffect(() => {
    getTotalSales();
  }, []);

  return (
    <Box className="sale-item-container">
      <Box className="sale-item">
        <Typography className="sale-item-text" variant="h4">
          {coffeeName || "..."}{" "}
          <span>
            ({sale.sold_coffees} coffees) <Box className="sale-item-line" mx={2}></Box>
          </span>
        </Typography>
        <Box className="sale-item-line" mx={2}></Box>
        <Typography className="sale-item-text sale-item-text-left" variant="h4">
          {sale.revenue}$
        </Typography>
      </Box>
      {!loading ? (
        <Typography className="sale-sub-header" variant="body1">
          Sold worldwide: {totalSales} coffee(s)!
        </Typography>
      ) : (
        <Typography className="sale-sub-header" variant="body1">
          Sold worldwide: ... coffee(s)!
        </Typography>
      )}
    </Box>
  );
};

export default SaleItem;
