// material ui
import Typography from "@mui/material/Typography";

// css
import "../../assets/css/users/userItem.css";

// utils
import { useNavigate } from "react-router-dom";

const UserItem = ({ username }: { username: string }) => {
  const navigate = useNavigate();

  return (
    <Typography onClick={() => navigate(`../profile/${username}`)} className="user-item" variant="body1">
      Added by <span>{username}</span>
    </Typography>
  );
};

export default UserItem;
