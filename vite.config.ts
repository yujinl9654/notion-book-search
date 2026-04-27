import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const naverClientId = env.NAVER_CLIENT_ID;
  const naverClientSecret = env.NAVER_CLIENT_SECRET;

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/naver/books": {
          changeOrigin: true,
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq) => {
              if (naverClientId) {
                proxyReq.setHeader("X-Naver-Client-Id", naverClientId);
              }

              if (naverClientSecret) {
                proxyReq.setHeader("X-Naver-Client-Secret", naverClientSecret);
              }
            });
          },
          rewrite: (path) =>
            path.replace(/^\/api\/naver\/books/, "/v1/search/book.json"),
          target: "https://openapi.naver.com",
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
  };
});
