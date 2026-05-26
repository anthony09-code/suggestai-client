import type { AxiosError } from "axios";

export function logError(message: string, error: AxiosError): void {
  if (!import.meta.env.DEV) return;
  console.error(`[API] ${message}`, {
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
  });
}
