import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // Proxy para desarrollo local (evita CORS al probar en navegador)
    proxy: {
      '/api': {
        target: 'https://app.zyntello.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
