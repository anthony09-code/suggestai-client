/// <reference types="vite/client" />

interface Window {
  turnstile: {
    render: (el: HTMLElement, options: Record<string, unknown>) => string;
    reset: (widgetId: string) => void;
  };
  onloadTurnstileCallback: () => void;
}
