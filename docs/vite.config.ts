import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// base: "/baize-ui-dsl/" — GitHub Pages 部署在子路径下, 资源 URL 必须带前缀
// 本地 dev 时 base 用 "/" (默认值即可访问根)
const repoName = "baize-ui-dsl";
const base = `/${repoName}/`;

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@timywel/baize-ui-dsl": path.resolve(__dirname, "../src/index.ts"),
    },
  },
  server: {
    port: 5174,
    open: false,
  },
  preview: {
    port: 4174,
  },
});
