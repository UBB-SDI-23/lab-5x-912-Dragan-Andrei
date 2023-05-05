// material ui
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// utils
import { useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";
import axios from "axios";
import { BASE_URL_API } from "../../utils/constants";

// css
import "../../assets/css/users/userItemWithRole.css";

const UserItemWithRole = ({ user, getUsers }: { user: any; getUsers: any }) => {
  const [error, setError] = useState<string>("");
  const [userRole, setUserRole] = useState<string>(user.is_superuser ? "Admin" : user.is_staff ? "Moderator" : "Regular");
  const contextData = useContext<any>(AuthContext);

  const saveUserChanges = async () => {
    try {
      let updatedUser = { ...user };

      if (userRole === "Admin") {
        updatedUser.is_superuser = true;
        updatedUser.is_staff = false;
      } else if (userRole === "Moderator") {
        updatedUser.is_superuser = false;
        updatedUser.is_staff = true;
      } else {
        updatedUser.is_superuser = false;
        updatedUser.is_staff = false;
      }

      await axios.put(`${BASE_URL_API}/users/${user.id}/edit`, updatedUser, {
        headers: {
          Authorization: `Bearer ${contextData.authTokens.access}`,
        },
      });

      getUsers();
      setError("");
    } catch (error: any) {
      setError("The user role could not be updated! Please try again later.");
    }
  };

  return (
    <>
      <ListItem sx={{ width: "100%", padding: "16px 0", display: "block" }}>
        {error && (
          <Typography variant="body2" sx={{ color: "#e64545" }}>
            {error}
          </Typography>
        )}
        <Box className="user-item">
          <Typography className="user-item-text" variant="h4">
            {user.username} <span>({user.is_superuser ? "Admin" : user.is_staff ? "Moderator" : "Regular"})</span>
          </Typography>
          <Box className="user-item-line" mx={2}></Box>
          <TextField
            select
            label="Role"
            sx={{ margin: "12px 8px", width: "150px" }}
            value={userRole}
            onChange={(e) => setUserRole((prev: string) => e.target.value)}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Moderator">Moderator</MenuItem>
            <MenuItem value="Regular">Regular</MenuItem>
          </TextField>

          <Button
            className="save-user-role-button"
            onClick={() => saveUserChanges()}
            variant="contained"
            sx={{
              mt: 5,
              boxShadow: 4,
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            Save
          </Button>
        </Box>
      </ListItem>
    </>
  );
};

export default UserItemWithRole;
