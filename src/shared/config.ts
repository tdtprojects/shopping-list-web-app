export const API_URL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL_LOCAL : import.meta.env.VITE_API_URL_PROD;
