import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false, // 目标若是 HTTPS 自签证书，也不校验
        rewrite: (path) => path.replace(/^\/api/, ""), //去掉路径前缀 /proxy 再转发
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
