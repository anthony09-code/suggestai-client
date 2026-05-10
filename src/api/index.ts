import axios from "axios";
import { useAuthStore } from "../stores/auth_store";
import { useToast } from "primevue/usetoast";
import type { ToastMessageOptions } from "primevue/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const toastPresets = {
  network: {
    severity: "error",
    summary: "No internet connection",
    detail: "Please check your network and try again.",
    life: 5000,
  },
  server: {
    severity: "error",
    summary: "Something went wrong",
    detail: "A server error occurred. Please try again later.",
    life: 5000,
  },
  client: {
    severity: "warn",
    summary: "Request failed",
    detail: "An unexpected error occurred.",
    life: 5000,
  },
} satisfies Record<string, ToastMessageOptions>;

const redirect = (path: string) => (window.location.href = path);

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.silentError) return Promise.reject(error);

    const toast = useToast();
    const status: number | undefined = error.response?.status;

    if (!navigator.onLine || error.code === "ERR_NETWORK") {
      toast.add(toastPresets.network);
      return Promise.reject(error);
    }

    switch (true) {
      case status === 401:
        useAuthStore().logout();
        redirect("/login");
        break;

      case status === 403:
        redirect("/forbidden");
        break;

      case status === 422:
        break;

      case status === 429:
        toast.add({
          severity: "warn",
          summary: "Too many attempts",
          detail: error.response?.data?.message,
          life: 8000,
        });
        break;

      case status !== undefined && status >= 500:
        toast.add(toastPresets.server);
        break;

      case status !== undefined && status >= 400: {
        const message = error.response?.data?.message;
        toast.add({
          ...toastPresets.client,
          ...(message && { detail: message }),
        });
        break;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
