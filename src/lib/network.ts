import { getToast } from "./toast";

let networkErrorShown = false;

export function notifyNetworkError(): void {
  if (networkErrorShown) return;
  networkErrorShown = true;
  getToast().add({
    severity: "error",
    summary: "Server unavailable",
    detail: "Cannot reach the server. Please check your connection.",
    group: "network-error",
    closable: false,
  });
}

export function notifyServerError(status: number): void {
  getToast().add({
    severity: "error",
    summary: "Something went wrong",
    detail: `An unexpected error occurred (${status}). Please try again.`,
    life: 6000,
  });
}

function clearNetworkError(): void {
  networkErrorShown = false;
  getToast().removeGroup("network-error");
}

export function initNetworkListeners(): void {
  window.addEventListener("offline", notifyNetworkError);
  window.addEventListener("online", clearNetworkError);
}
