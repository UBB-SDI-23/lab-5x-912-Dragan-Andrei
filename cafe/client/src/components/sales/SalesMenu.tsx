// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Switch from "@mui/material/Switch";

// css
import "../../assets/css/sales/salesMenu.css";

// react components
import Pagination from "../Pagination";
import SaleItem from "./SaleItem";

// utils
import { useState, useEffect } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// models
import { Sale } from "../../models/Sale";

const SalesMenu = ({ locationId }: { locationId: number }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [relatedCoffeeNames, setRelatedCoffeeNames] = useState<{ [key: number]: string }>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [lastFetchCall, setLastFetchCall] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [totalEntries, setTotalEntries] = useState<number>(0);

  const navigate = useNavigate();

  // function to get the paginated sales
  const getSales = async () => {
    setLoading(true);
    const currentFetchCall = lastFetchCall;

    let url = `${BASE_URL_API}/locations/${locationId}?page_size=${pageSize}`;
    url += "&p=" + page;

    setLastFetchCall((prev) => prev + 1);
    const response = await axios.get(url);
    const data = await response.data;
    if (currentFetchCall === lastFetchCall) {
      setSales(data.sales.results);
      setTotalEntries(data.sales.count);
    }

    setLoading(false);
  };

  // everytime the page size changes, reset the sale pagination
  useEffect(() => {
    if (page === 1) getSales();
    else setPage(1);
  }, [pageSize]);

  // everytime the selected page / the page size changes, fetch the sales
  useEffect(() => {
    getSales();
  }, [page, pageSize]);

  // function to get the name of a related coffee for a certain sale
  const getRelatedCoffeeName = async (coffeeId: number) => {
    const response = await axios.get(`${BASE_URL_API}/coffees/${coffeeId}`);
    const data = await response.data;
    setRelatedCoffeeNames((prev) => ({ ...prev, [coffeeId]: data.name }));
  };
  useEffect(() => {
    if (sales) {
      sales.forEach((sale: Sale) => {
        !relatedCoffeeNames[sale.coffee_id] && getRelatedCoffeeName(sale.coffee_id);
      });
    }
  }, [sales]);

  return (
    <>
      <Container className="sales-content-container">
        <Container className="sales-content" sx={{ minHeight: "calc(100vh)" }}>
          <Typography className="sales-big-header" variant="h2" sx={{ mt: 12, mb: 4, color: "#be9063" }}>
            Sales This Month!
          </Typography>
          {totalEntries > 0 && (
            <>
              <List className="sales-list">
                {loading && <Typography variant="h2">Loading...</Typography>}
                {!loading &&
                  sales.map((sale) => (
                    <ListItem key={sale.id} sx={{ width: "100%", padding: "8px 0" }}>
                      <SaleItem sale={sale} />
                    </ListItem>
                  ))}
              </List>
              <Pagination page={page} pageSize={pageSize} totalEntries={totalEntries} setPage={setPage} setPageSize={setPageSize} entityName="sales" />
            </>
          )}
          <Button
            className="add-sale-button"
            onClick={() => navigate(`/locations/${locationId}/add`)}
            variant="contained"
            sx={{
              mt: 5,
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <ArrowForwardIcon sx={{ marginRight: "8px" }} /> Add a new sale
          </Button>
        </Container>
      </Container>
    </>
  );
};

export default SalesMenu;
