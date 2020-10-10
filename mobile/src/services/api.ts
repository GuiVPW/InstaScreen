import axios from "axios";

export const baseURL = "http:// ";
// export const baseURL = "https://instascreen-api.herokuapp.com"

const api = axios.create({
  baseURL,
});

export default api;
