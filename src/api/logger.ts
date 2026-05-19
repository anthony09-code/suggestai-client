import type { AxiosError } from "axios";

export function logError(message: string, error: AxiosError): void {
  if (!import.meta.env.DEV) return;

  console.error(`[API] ${message}`, {
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
  });
  // Production: Sentry.captureException(error);
}

export function notifyServerError(status: number): void {
  console.warn(`[API] Server error ${status} — please try again.`);
  // Production: toast.error(`Something went wrong (${status}).`);
}
