const PROD_BACKEND_API_URL = "https://eveiller.ignorelist.com/api";
const DEV_BACKEND_API_URL = "http://127.0.0.1:8000/api";

export const BASE_URL_API =
  process.env.NODE_ENV === "development"
    ? DEV_BACKEND_API_URL
    : PROD_BACKEND_API_URL;
