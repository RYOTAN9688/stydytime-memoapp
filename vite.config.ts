import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import env from "vite-plugin-env-compatible";

export default defineConfig({
  root: ".",
  plugins: [react(), env({ prefix: "VITE", mountedPath: "process.env" })],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
  },
});
