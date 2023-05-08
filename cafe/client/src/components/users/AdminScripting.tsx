// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField/TextField";

// utils
import { useState, useContext, useEffect } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

// react component
import MainNavbar from "../MainNavbar";

// css
import "../../assets/css/users/adminScripting.css";
import { isNumber } from "lodash";

interface localError {
  generic: string;
  coffees: string;
  blends: string;
  locations: string;
  sales: string;
}

interface localLoading {
  generic: boolean;
  coffees: boolean;
  blends: boolean;
  locations: boolean;
  sales: boolean;
  all: boolean;
}

interface configSettings {
  pageSize: string;
}

interface configErrors {
  success: string;
  generic: string;
  pageSize: string;
}

interface touchedFields {
  pageSize: boolean;
}

const AdminScripting = () => {
  const [loading, setLoading] = useState<localLoading>({
    generic: false,
    coffees: false,
    blends: false,
    locations: false,
    sales: false,
    all: false,
  });

  const [configSettings, setConfigSettings] = useState<configSettings>({
    pageSize: "",
  });
  const [configErrors, setConfigErrors] = useState<configErrors>({
    success: "",
    generic: "",
    pageSize: "",
  });
  const [touchedFields, setTouchedFields] = useState<touchedFields>({
    pageSize: false,
  });

  const contextData = useContext<any>(AuthContext);

  const [localError, setLocalError] = useState<localError>({
    generic: "",
    coffees: "",
    blends: "",
    locations: "",
    sales: "",
  });

  // get the page size
  const getDefaultPageSize = async () => {
    try {
      const response = await axios.get(`${BASE_URL_API}/config/page-size`);
      const data = await response.data;
      setConfigSettings((prev) => ({ ...prev, pageSize: data.page_size }));
    } catch (error) {
      setConfigErrors((prev) => ({ ...prev, generic: "There was an internal error! Try again later!" }));
    }
  };
  useEffect(() => {
    getDefaultPageSize();
  }, []);

  const validateConfig = () => {
    if (!isNumber(Number(configSettings.pageSize)) || Number(configSettings.pageSize) <= 0) {
      setConfigErrors((prev) => ({ ...prev, pageSize: "Page size must be a positive number!" }));
      return;
    } else {
      setConfigErrors((prev) => ({ ...prev, pageSize: "" }));
    }
  };

  useEffect(() => {
    validateConfig();
  }, [configSettings]);

  const setPageSize = async () => {
    touchedFields.pageSize = true;
    configErrors.generic = "";
    configErrors.pageSize = "";
    configErrors.success = "";

    validateConfig();

    if (configErrors.pageSize) return;

    try {
      await axios.put(
        `${BASE_URL_API}/config/page-size`,
        { page_size: Number(configSettings.pageSize) },
        {
          headers: { Authorization: `Bearer ${contextData.authTokens.access}` },
        }
      );
      setConfigErrors((prev) => ({ ...prev, generic: "", success: "Settings were saved!" }));
      localStorage.setItem("defaultPageSize", JSON.stringify(configSettings.pageSize));
    } catch (error: any) {
      setConfigErrors((prev) => ({ ...prev, generic: "There was an internal error! Try again later!" }));
    }
  };

  const deleteEntity = async (entity: string) => {
    try {
      setLoading((prev) => ({ ...prev, [entity]: true }));
      setLoading((prev) => ({ ...prev, all: true }));
      setLocalError((prev) => ({ ...prev, [entity]: "" }));

      await axios.delete(`${BASE_URL_API}/${entity}/admin/scripts/`, {
        headers: { Authorization: `Bearer ${contextData.authTokens.access}` },
        timeout: 1200000,
      });

      setLoading((prev) => ({ ...prev, [entity]: false }));
      setLoading((prev) => ({ ...prev, all: false }));

      setLocalError((prev) => ({ ...prev, [entity]: "" }));
    } catch (error) {
      setLoading((prev) => ({ ...prev, [entity]: false }));
      setLoading((prev) => ({ ...prev, all: false }));
      setLocalError((prev) => ({ ...prev, [entity]: "There was an internal error! Try again later!" }));
    }
  };

  const populateEntity = async (entity: string) => {
    try {
      setLoading((prev) => ({ ...prev, [entity]: true }));
      setLoading((prev) => ({ ...prev, all: true }));
      setLocalError((prev) => ({ ...prev, [entity]: "" }));

      await axios.get(`${BASE_URL_API}/${entity}/admin/scripts/`, {
        headers: { Authorization: `Bearer ${contextData.authTokens.access}` },
        timeout: 1200000,
      });

      setLoading((prev) => ({ ...prev, [entity]: false }));
      setLoading((prev) => ({ ...prev, all: false }));
      setLocalError((prev) => ({ ...prev, [entity]: "" }));
    } catch (error) {
      setLoading((prev) => ({ ...prev, [entity]: false }));
      setLoading((prev) => ({ ...prev, all: false }));
      setLocalError((prev) => ({ ...prev, [entity]: "There was an internal error! Try again later!" }));
    }
  };

  return (
    <>
      <MainNavbar />
      <Container sx={{ minHeight: "100vh" }}>
        <Container>
          <Typography variant="h1" sx={{ mt: 10, mb: 2 }}>
            Config panel
          </Typography>

          {loading.generic && (
            <Typography variant="h4" sx={{ color: "#333" }}>
              Loading...
            </Typography>
          )}

          <Typography variant="body2" sx={{ color: "#e64545" }}>
            {localError.generic}
          </Typography>
          <Box>
            {loading.coffees && (
              <Typography variant="h4" sx={{ color: "#333" }}>
                Loading...
              </Typography>
            )}

            <Typography variant="body2" sx={{ color: "#e64545" }}>
              {localError.coffees}
            </Typography>
            <Button
              disabled={loading.all}
              onClick={() => deleteEntity("coffees")}
              className="outlined-button"
              sx={{
                mt: 2,
                boxShadow: 4,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              Delete coffees
            </Button>

            <Button
              onClick={() => populateEntity("coffees")}
              disabled={loading.all}
              className="full-button"
              sx={{
                mt: 2,
                boxShadow: 4,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              Populate coffees
            </Button>
          </Box>

          <Divider sx={{ mt: 4, mb: 2 }} />

          <Box>
            {loading.blends && (
              <Typography variant="h4" sx={{ color: "#333" }}>
                Loading...
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "#e64545" }}>
              {localError.blends}
            </Typography>
            <Button
              onClick={() => deleteEntity("blends")}
              disabled={loading.all}
              className="outlined-button"
              sx={{
                mt: 2,
                boxShadow: 4,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              Delete blends
            </Button>

            <Button
              onClick={() => populateEntity("blends")}
              disabled={loading.all}
              className="full-button"
              sx={{
                mt: 2,
                boxShadow: 4,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              Populate blends
            </Button>
          </Box>

          <Divider sx={{ mt: 4, mb: 2 }} />

          <Box>
            {loading.locations && (
              <Typography variant="h4" sx={{ color: "#333" }}>
                Loading...
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "#e64545" }}>
              {localError.locations}
            </Typography>
            <Button
              onClick={() => deleteEntity("locations")}
              disabled={loading.all}
              className="outlined-button"
              sx={{
                mt: 2,
                boxShadow: 4,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              Delete locations
            </Button>

            <Button
              onClick={() => populateEntity("locations")}
              disabled={loading.all}
              className="full-button"
              sx={{
                mt: 2,
                boxShadow: 4,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              Populate locations
            </Button>
          </Box>

          <Divider sx={{ mt: 4, mb: 2 }} />

          <Box>
            {loading.sales && (
              <Typography variant="h4" sx={{ color: "#333" }}>
                Loading...
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "#e64545" }}>
              {localError.sales}
            </Typography>
            <Button
              onClick={() => deleteEntity("sales")}
              disabled={loading.all}
              className="outlined-button"
              sx={{
                mt: 2,
                boxShadow: 4,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              Delete sales
            </Button>

            <Button
              onClick={() => populateEntity("sales")}
              disabled={loading.all}
              className="full-button"
              sx={{
                mt: 2,
                boxShadow: 4,
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              Populate sales
            </Button>

            <Divider sx={{ mt: 4, mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {configErrors.generic && (
                <Typography variant="body2" sx={{ color: "#e64545", mb: 4, marginLeft: "4px" }}>
                  {configErrors.generic}
                </Typography>
              )}

              {configErrors.success && (
                <Typography variant="body2" sx={{ color: "#60f763", mb: 4, marginLeft: "4px" }}>
                  {configErrors.success}
                </Typography>
              )}

              <TextField
                sx={{
                  width: "175px",
                }}
                label="Default page size"
                variant="outlined"
                value={configSettings.pageSize}
                onChange={(e) => setConfigSettings((prev) => ({ ...prev, pageSize: e.target.value }))}
                error={configErrors.pageSize && touchedFields.pageSize ? true : false}
                onBlur={(e) =>
                  setTouchedFields((prevTouched) => ({
                    ...prevTouched,
                    pageSize: true,
                  }))
                }
                helperText={configErrors.pageSize && touchedFields.pageSize && configErrors.pageSize}
              />

              <Button
                onClick={() => setPageSize()}
                disabled={loading.all}
                className="full-button"
                sx={{
                  mt: 2,
                  boxShadow: 4,
                  "&:hover": {
                    boxShadow: 2,
                  },
                }}
              >
                Save settings
              </Button>
            </Box>
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default AdminScripting;
