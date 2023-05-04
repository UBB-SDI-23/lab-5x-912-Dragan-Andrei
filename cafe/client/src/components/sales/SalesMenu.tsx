// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// css
import "../../assets/css/sales/salesMenu.css";

// react components
import Pagination from "../Pagination";
import SaleItem from "./SaleItem";

// utils
import { useState, useEffect, useContext } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

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

const SalesMenu = ({ locationId }: { locationId: number }) => {
  const [sales, setSales] = useState<LocalSale[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastFetchCall, setLastFetchCall] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);

  const navigate = useNavigate();
  const contextData = useContext<any>(AuthContext);

  // function to get the paginated sales
  const getSales = async () => {
    setLoading(true);
    const currentFetchCall = lastFetchCall;

    let url = `${BASE_URL_API}/sales/all?location_id=${locationId}&page_size=${pageSize}`;
    url += "&p=" + page;

    setLastFetchCall((prev) => prev + 1);
    try {
      const response = await axios.get(url);
      const data = await response.data;
      if (currentFetchCall === lastFetchCall) {
        setSales(data.results);
        setTotalEntries(data.count);
      }
      setLoading(false);
    } catch (error) {
      setError("There was an internal error! Try again later!");
      setLoading(false);
    }
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
                {loading ? (
                  <Typography variant="h2" ml="0px">
                    Loading...
                  </Typography>
                ) : error ? (
                  <Typography variant="h2" ml="0px">
                    {error}
                  </Typography>
                ) : sales.length === 0 ? (
                  <Typography variant="h2" ml="0px">
                    There are no coffees to show!
                  </Typography>
                ) : (
                  sales.map((sale) => (
                    <ListItem key={sale.id} sx={{ width: "100%", padding: "8px 0" }}>
                      <SaleItem sale={sale} />
                    </ListItem>
                  ))
                )}
              </List>
              <Pagination page={page} pageSize={pageSize} totalEntries={totalEntries} setPage={setPage} setPageSize={setPageSize} entityName="sales" />
            </>
          )}
          {contextData.user && contextData.user.is_active && (contextData.user.is_staff || contextData.user.is_superuser) && (
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
          )}
        </Container>
      </Container>
    </>
  );
};

export default SalesMenu;
