import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true, // 👈 Tự động mở trình duyệt
    port: 5000, // Tuỳ chọn: set cổng
  },
  build: {
    outDir: "dist", // Vercel sẽ lấy thư mục này để deploy
  },
});
