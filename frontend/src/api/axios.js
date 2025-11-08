import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3007/api", // backend URL
  withCredentials: true, // so cookies (like JWT) are sent automatically
});

export default api;
