export {};

declare global {
  interface Window {
    turnstile: {
      render: (el: HTMLElement, options: object) => string;
      reset: (el: HTMLElement | null) => void;
      execute: (el: HTMLElement | null, options?: object) => void;
    };
    onloadTurnstileCallback: () => void;
    turnstileReady: boolean;
  }
}
