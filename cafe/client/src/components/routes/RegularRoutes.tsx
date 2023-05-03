// utils
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";

const RegularRoutes = () => {
  const contextData = useContext<any>(AuthContext);
  return !contextData.user ? <Outlet /> : <Navigate to="/" />;
};

export default RegularRoutes;
