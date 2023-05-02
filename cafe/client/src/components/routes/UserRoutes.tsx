// utils
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";

const UserRoutes = () => {
  const contextData = useContext<any>(AuthContext);
  return contextData.user && contextData.user.is_active ? <Outlet /> : <Navigate to="/login" />;
};

export default UserRoutes;
