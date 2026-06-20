import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// base — подкаталог репозитория на GitHub Pages (sailorstale.github.io/<repo>/).
// Только для прод-сборки; в dev остаётся "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/inclusive-employment-prototype/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
