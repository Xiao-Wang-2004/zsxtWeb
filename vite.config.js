import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    port: 18080,
    allowedHosts: [
      '113350ebnt158.vicp.fun'
    ],
    proxy: {
      '/api': {
        // target: 'http://8.129.129.34:8099',
        target: 'http://127.0.0.1:8099',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist/html',
    emptyOutDir: true
  }
})
