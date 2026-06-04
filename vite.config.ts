import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    headers: {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com",
        "frame-src 'self' https://challenges.cloudflare.com",
        "frame-ancestors 'self'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' ws: wss: http://127.0.0.1:8000 https://challenges.cloudflare.com",

        "img-src 'self' data: http://127.0.0.1:8000 https://challenges.cloudflare.com https://lh3.googleusercontent.com",

        "worker-src blob: https://challenges.cloudflare.com",
      ].join("; "),
    },
  },
});
