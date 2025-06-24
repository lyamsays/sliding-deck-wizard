
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
<<<<<<< HEAD
import tsconfigPaths from "vite-tsconfig-paths";

// No callback version to avoid plugin type issues
=======
import path from "path";

// https://vitejs.dev/config/
>>>>>>> 0586fc0ddfcb662ea18ceb0a567de8e4d6b73122
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
<<<<<<< HEAD
    tsconfigPaths()
=======
>>>>>>> 0586fc0ddfcb662ea18ceb0a567de8e4d6b73122
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
<<<<<<< HEAD

=======
>>>>>>> 0586fc0ddfcb662ea18ceb0a567de8e4d6b73122
