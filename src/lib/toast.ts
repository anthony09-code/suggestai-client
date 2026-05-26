import { useToast } from "primevue/usetoast";

let _toast: ReturnType<typeof useToast> | null = null;

export function initToast() {
  _toast = useToast();
}

export function getToast() {
  if (!_toast) throw new Error("Toast not initialized. Call initToast() in App.vue.");
  return _toast;
}
