
import { defineConfig } from "vite"; 
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path"; // You can remove this if unused

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    tsconfigPaths(), // ✅ this was missing
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
