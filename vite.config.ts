import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Vite tetap jalan di port 5173
    proxy: {
      // Semua request /api/... diteruskan ke Express di port 3000
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // Semua request /uploads/... (foto yang diupload) juga diteruskan ke Express
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});