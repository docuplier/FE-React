import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), tsconfigPaths()],
  server: {
    proxy: {
      "https://docuplier.com": "https://docuplier.com",
      "https://res.cloudinary.com": "https://res.cloudinary.com",
    },
  },
});
