// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  adapter: vercel(),
  // Oculta la barra flotante de Astro en desarrollo (nunca sale en producción).
  devToolbar: { enabled: false },
});
/*{
    includeFiles: ["./my-data.json"],
    imageService: true,
    webAnalytics: {
      enabled: true,
    },
  }* */
