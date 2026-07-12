export {};

declare global {
  interface Window {
    turnstile: {
      render: (el: HTMLElement, options: object) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      execute: (el: HTMLElement | null, options?: object) => void;
    };
    onloadTurnstileCallback: () => void;
    turnstileReady: boolean;
  }
}
