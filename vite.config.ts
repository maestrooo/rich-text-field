// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    target: "es2024",
  },
  optimizeDeps: {
    exclude: ['@shopify/app-bridge-ui-types'],
  },
  build: {
    rollupOptions: {
      external: ['@shopify/app-bridge-ui-types'],
    },
  },
});