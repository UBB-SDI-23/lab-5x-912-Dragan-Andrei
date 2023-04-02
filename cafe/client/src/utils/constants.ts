const PROD_BACKEND_API_URL = "/api";
const DEV_BACKEND_API_URL = "http://127.0.0.1:8000";

export const BASE_URL_API =
  process.env.NODE_ENV === "development"
    ? DEV_BACKEND_API_URL
    : PROD_BACKEND_API_URL;
