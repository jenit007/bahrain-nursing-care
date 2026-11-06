import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function expressApiPlugin() {
  let appPromise = null;

  const handleApiRequest = async (req, res, next) => {
    if (!req.url || !req.url.startsWith("/api")) {
      return next();
    }
    try {
      if (!appPromise) {
        process.env.VITE_EMBEDDED_API = "true";
        appPromise = import("./server/index.js").then((mod) => mod.default);
      }
      const app = await appPromise;
      return app(req, res, next);
    } catch (error) {
      return next(error);
    }
  };

  return {
    name: "noor-express-api",
    configureServer(server) {
      if (!process.env.VITE_BACKEND_PROXY_TARGET) {
        server.middlewares.use(handleApiRequest);
      }
    },
    configurePreviewServer(server) {
      if (!process.env.VITE_BACKEND_PROXY_TARGET) {
        server.middlewares.use(handleApiRequest);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), expressApiPlugin()],
  build: {
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 5173,
    ...(process.env.VITE_BACKEND_PROXY_TARGET
      ? {
          proxy: {
            "/api": {
              target: process.env.VITE_BACKEND_PROXY_TARGET,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : {}),
  },
});
