import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// base — подкаталог репозитория на GitHub Pages (sailorstale.github.io/<repo>/).
// Только для прод-сборки; в dev остаётся "/". На Railway (корень домена + свой
// сервер) задаём BASE_PATH=/ — тогда ассеты грузятся от корня.
export default defineConfig(({ command }) => ({
  base:
    process.env.BASE_PATH ??
    (command === "build" ? "/inclusive-employment-prototype/" : "/"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // dev: /api проксируется на локальный сервер правок (server/index.js).
  // Если сервер не запущен — фронт сам уходит в localStorage-режим.
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
}));
