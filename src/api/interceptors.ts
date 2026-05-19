import type { AxiosInstance, AxiosError } from "axios";
import router from "@/router";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { logError, notifyServerError } from "./logger";

const SERVER_ERRORS = new Set([500, 502, 503, 504]);

export function applyRequestInterceptor(api: AxiosInstance): void {
  api.interceptors.request.use(
    (config) => {
      const { token } = useAuthStore();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error: AxiosError) => {
      logError("Request setup failed", error);
      return Promise.reject(error);
    },
  );
}

export function applyResponseInterceptor(api: AxiosInstance): void {
  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const req = error.config;

      logError(`[${status}] ${req?.method?.toUpperCase()} ${req?.url}`, error);

      if (status === 401) return handle401(error);
      if (status === 403) router.replace({ name: "unauthorized" });
      if (status && SERVER_ERRORS.has(status)) notifyServerError(status);

      return Promise.reject(error);
    },
  );
}

function handle401(error: AxiosError): Promise<never> {
  if (error.config?.url?.includes("/auth/login")) return Promise.reject(error);
  logoutAndRedirect();
  return Promise.reject(error);
}

function logoutAndRedirect(): void {
  useAuthStore().clearAuth();
  setTimeout(() => router.replace({ name: "login" }), 0);
}
