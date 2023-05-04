// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";

// css
import "../../assets/css/stat.css";

// react components
import MainNavbar from "../MainNavbar";
import Pagination from "../Pagination";

// utils
import { useState, useEffect } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";

// images
import supportImage from "../../assets/images/location.jpg";

// objects
interface AvgSale {
  name: string;
  avg_sell: number;
}

const SalesByLocation = () => {
  const [avgSales, setAvgSales] = useState<AvgSale[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastFetchCall, setLastFetchCall] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [totalEntries, setTotalEntries] = useState<number>(0);

  // function to get the average sales
  const getAvgSales = async () => {
    setLoading(true);
    const currentFetchCall = lastFetchCall;

    let url = `${BASE_URL_API}/locations/sales-by-location?page_size=${pageSize}`;
    url += "&p=" + page;

    setLastFetchCall((prev) => prev + 1);
    try {
      const response = await axios.get(url);
      const data = await response.data;
      if (currentFetchCall === lastFetchCall) {
        setAvgSales(data.results);
        setTotalEntries(data.count);
      }
      setLoading(false);
    } catch (error) {
      setError("There was an internal error! Try again later!");
      setLoading(false);
    }
  };

  // everytime the page size changes, reset the page to 1 and fetch the average sales if needed
  useEffect(() => {
    if (page === 1) getAvgSales();
    else setPage(1);
  }, [pageSize]);

  // everytime the content of the selected page / the page size changes, fetch the average sales
  useEffect(() => {
    getAvgSales();
  }, [page, pageSize]);

  return (
    <>
      <MainNavbar />
      <Container className="stat-content-container">
        <Container className="stat-content" sx={{ minHeight: "calc(100vh)" }}>
          <Typography className="stat-big-header" variant="h1" sx={{ mt: 10, mb: 5 }}>
            How did our locations perform?
          </Typography>
          <List className="stat-list">
            {loading ? (
              <Typography variant="h2" ml="0px">
                Loading...
              </Typography>
            ) : error ? (
              <Typography variant="h2" ml="0px">
                {error}
              </Typography>
            ) : avgSales.length === 0 ? (
              <Typography variant="h2" ml="0px">
                There are no locations to show!
              </Typography>
            ) : (
              avgSales.map((avgSale) => (
                <ListItem key={avgSale.name} sx={{ width: "100%", padding: "16px 0" }}>
                  <Box className="stat-item">
                    <Typography className="stat-item-text" variant="h4">
                      {avgSale.name}
                      <span>
                        <Box className="stat-item-line" mx={2}></Box>
                      </span>
                    </Typography>
                    <Box className="stat-item-line" mx={2}></Box>
                    <Typography className="stat-item-text stat-item-text-left" variant="h4">
                      {Math.round(avgSale.avg_sell)} coffees / sale
                    </Typography>
                  </Box>
                </ListItem>
              ))
            )}
          </List>
          <Pagination page={page} pageSize={pageSize} totalEntries={totalEntries} setPage={setPage} setPageSize={setPageSize} entityName="locations" />
        </Container>
        <Container className="stat-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            <img src={supportImage} alt="image with some of our tasty blends" />
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default SalesByLocation;
