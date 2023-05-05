// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";

// css
import "../../assets/css/users/userMenu.css";

// react components
import Pagination from "../Pagination";
import UserItemWithRole from "./UserItemWithRole";
import MainNavbar from "../MainNavbar";

// utils
import { useState, useEffect, useContext } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

const SalesMenu = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastFetchCall, setLastFetchCall] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);

  const contextData = useContext<any>(AuthContext);

  // function to get the paginated users
  const getUsers = async () => {
    setLoading(true);
    const currentFetchCall = lastFetchCall;

    let url = `${BASE_URL_API}/users?page_size=${pageSize}`;
    url += "&p=" + page;

    setLastFetchCall((prev) => prev + 1);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${contextData.authTokens.access}`,
        },
      });
      const data = await response.data;
      if (currentFetchCall === lastFetchCall) {
        setUsers(data.results);
        setTotalEntries(data.count);
      }
      setLoading(false);
    } catch (error) {
      setError("There was an internal error! Try again later!");
      setLoading(false);
    }
  };

  // everytime the page size changes, reset the user pagination
  useEffect(() => {
    if (page === 1) getUsers();
    else setPage(1);
  }, [pageSize]);

  // everytime the selected page / the page size changes, fetch the users
  useEffect(() => {
    getUsers();
  }, [page, pageSize]);

  return (
    <>
      <MainNavbar />
      <Container className="users-content-container">
        <Container className="users-content" sx={{ minHeight: "calc(100vh)" }}>
          <Typography variant="h1" sx={{ mt: 10, mb: 0 }}>
            All users!
          </Typography>
          <List className="users-list">
            {loading ? (
              <Typography variant="h2" ml="0px">
                Loading...
              </Typography>
            ) : error ? (
              <Typography variant="h2" ml="0px">
                {error}
              </Typography>
            ) : users.length === 0 ? (
              <Typography variant="h2" ml="0px">
                There are no users to show!
              </Typography>
            ) : (
              users.map((user) => <UserItemWithRole key={user.id} user={user} getUsers={getUsers}></UserItemWithRole>)
            )}
          </List>
          <Pagination page={page} pageSize={pageSize} totalEntries={totalEntries} setPage={setPage} setPageSize={setPageSize} entityName="users" />
        </Container>
      </Container>
    </>
  );
};

export default SalesMenu;
