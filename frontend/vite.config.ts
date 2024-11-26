import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      leaflet: "leaflet/dist/leaflet.js",
    },
  },
  server: {
    port: 80,
    strictPort: true,
    host: '0.0.0.0', 
    origin: 'http://localhost:80',
  },
});
