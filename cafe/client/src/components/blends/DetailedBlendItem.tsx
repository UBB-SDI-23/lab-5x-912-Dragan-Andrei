// material ui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CoffeeIcon from "@mui/icons-material/Coffee";

// css
import "../../assets/css/blends/detailedBlend.css";

// utils
import { useEffect, useState, useContext } from "react";
import { BASE_URL_API } from "../../utils/constants";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

// models
import { Blend } from "../../models/Blend";

// react components
import MainNavbar from "../MainNavbar";
import WarningModal from "../WarningModal";

// images
import supportImage1 from "../../assets/images/blend1.jpg";
import supportImage2 from "../../assets/images/blend2.jpg";
import supportImage3 from "../../assets/images/blend3.jpg";
import supportImage4 from "../../assets/images/blend4.jpg";

const DetailedBlendItem = () => {
  const [blend, setBlend] = useState<Blend>({} as Blend);
  const [error, setError] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const id = Number(useParams<{ id: string }>().id);

  const navigate = useNavigate();
  const contextData = useContext<any>(AuthContext);

  // function to get a blend based on id
  const getBlend = async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL_API}/blends/${id}`);
      setBlend(response.data);
    } catch (error) {
      setError("The blend could not be loaded! Please try again later.");
    }
  };

  // function to delete a blend based on id
  const deleteBlend = async (id: number) => {
    try {
      const respone = await axios.delete(`${BASE_URL_API}/blends/${id}`);
      if (respone.status >= 200 && respone.status < 300) {
        navigate("/blends");
        return;
      } else {
        setError("The blend could not be deleted! Please try again later.");
      }
    } catch (error) {
      setError("The blend could not be deleted! Please try again later.");
    }
  };

  useEffect(() => {
    getBlend(id);
  }, [id]);

  return (
    <>
      <MainNavbar />
      {deleteModal && (
        <WarningModal message="Are you sure you want to delete this blend?" accept={() => deleteBlend(blend.id)} reject={() => setDeleteModal(false)} />
      )}
      <Container className="blend-content-container" sx={{ minHeight: "100vh" }}>
        <Container className="blend-content">
          <Typography variant="h1" sx={{ mt: 10, mb: 2 }}>
            {blend.name ? blend.name : "Loading..."}
          </Typography>

          <Typography variant="body2" sx={{ color: "#e64545", marginLeft: "2px" }}>
            {error}
          </Typography>

          {blend.name && (
            <>
              {contextData.user && contextData.user.is_active && (contextData.user.is_staff || contextData.user.is_superuser) && (
                <Box
                  mt={2}
                  mb={8}
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button
                    className="edit-blend-button"
                    variant="contained"
                    sx={{
                      boxShadow: 4,
                      "&:hover": {
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => navigate(`edit`)}
                  >
                    Edit
                  </Button>

                  <Button
                    className="delete-blend-button"
                    onClick={() => setDeleteModal(true)}
                    variant="outlined"
                    sx={{
                      ml: 3,
                      boxShadow: 4,
                      "&:hover": {
                        boxShadow: 2,
                      },
                    }}
                  >
                    DELETE
                  </Button>
                </Box>
              )}

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Origin:</Typography>
                <Typography ml={2} variant="h3">
                  {blend.country_of_origin}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">Strength:</Typography>
                <Typography ml={2} variant="h3">
                  {Array.from(Array(blend.level), (e, i) => {
                    return <CoffeeIcon key={i} sx={{ color: "#be9063" }} />;
                  })}
                  {Array.from(Array(5 - blend.level), (e, i) => {
                    return <CoffeeIcon key={i} sx={{ color: "gray" }} />;
                  })}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Box sx={{ display: "flex" }}>
                <Typography variant="h4">In stock:</Typography>
                <Typography ml={2} variant="h3">
                  {blend.in_stock ? "Yes" : "No"}
                </Typography>
              </Box>

              <Divider sx={{ my: 1, height: "1px", bgcolor: "#a5a5a5" }} />

              <Typography variant="h5" sx={{ fontWeight: "normal" }}>
                {blend.description}
              </Typography>
            </>
          )}
        </Container>
        <Container className="blend-support-image">
          <Box mt={10} sx={{ textAlign: "center" }}>
            {(blend.id % 4) + 1 == 1 && <img src={supportImage1} alt="blend" height="600px" />}
            {(blend.id % 4) + 1 == 2 && <img src={supportImage2} alt="blend" height="600px" />}
            {(blend.id % 4) + 1 == 3 && <img src={supportImage3} alt="blend" height="600px" />}
            {(blend.id % 4) + 1 == 4 && <img src={supportImage4} alt="blend" height="600px" />}
          </Box>
        </Container>
      </Container>
    </>
  );
};

export default DetailedBlendItem;
