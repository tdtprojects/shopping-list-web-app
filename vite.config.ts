import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa'
import path from "path";

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
       registerType: 'autoUpdate',
       
       })
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
