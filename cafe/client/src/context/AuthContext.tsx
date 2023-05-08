// utils
import axios from "axios";
import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { BASE_URL_API } from "../utils/constants";

const AuthContext = createContext({});
export default AuthContext;

export const AuthProvider = ({ children }: { children: any }) => {
  const [authTokens, setAuthTokens] = useState<any | null>(() =>
    localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens") || "{}") : null
  );
  const [user, setUser] = useState<any>(() =>
    localStorage.getItem("authTokens") ? jwt_decode(JSON.parse(localStorage.getItem("authTokens") || "{access:''}").access) : null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshCall, setLastRefreshCall] = useState<number>(0);
  const [defaultPageSize, setDefaultPageSize] = useState<number>(10);

  // get the page size
  const getDefaultPageSize = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL_API}/config/page-size`);
      const data = await response.data;
      localStorage.setItem("defaultPageSize", JSON.stringify(data.page_size));
    } catch (error) {
      localStorage.setItem("defaultPageSize", JSON.stringify(10));
      setLoading(false);
    }
  };

  useEffect(() => {
    getDefaultPageSize();
  }, []);

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  const updateToken = async () => {
    if (loading) {
      setLoading(false);
    }
    try {
      setLastRefreshCall((prev) => prev + 1);
      const localLastRefreshCall = lastRefreshCall;

      const response = await axios.post(`${BASE_URL_API}/token/refresh/`, {
        refresh: authTokens ? authTokens.refresh : "",
      });

      const data = await response.data;
      const user: any = jwt_decode(data.access);

      if (localLastRefreshCall !== lastRefreshCall) return;

      if (user.is_active) {
        setAuthTokens((prev: any) => data);
        setUser((prev: any) => user);
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }
    } catch (error: any) {
      logoutUser();
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, 1000 * 60 * 59);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  let contextData = {
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    user: user,
    setUser: setUser,
    logoutUser: logoutUser,
  };

  return <AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>;
};
