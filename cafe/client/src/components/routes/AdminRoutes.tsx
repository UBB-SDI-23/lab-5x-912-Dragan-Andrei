// utils
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";

const AdminRoutes = () => {
  const contextData = useContext<any>(AuthContext);
  return contextData.user && contextData.user.is_active && contextData.user.is_admin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
