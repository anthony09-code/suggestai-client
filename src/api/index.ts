import axios from "axios";
import { applyRequestInterceptor, applyResponseInterceptor } from "./interceptors";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

applyRequestInterceptor(api);
applyResponseInterceptor(api);

export default api;
