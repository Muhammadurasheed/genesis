import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Force HTTP in development to avoid mixed content issues
    https: false,
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
  // Ensure proper protocol handling
  define: {
    __DEV_PROTOCOL__: JSON.stringify('http'),
  }
})