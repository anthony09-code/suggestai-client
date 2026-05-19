export function useTurnstileLoader(): Promise<void> {
  return new Promise((resolve) => {
    if (window.turnstileReady || window.turnstile) {
      return resolve();
    }
    window.addEventListener("turnstile:ready", () => resolve(), { once: true });
  });
}
