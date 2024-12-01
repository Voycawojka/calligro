import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        website: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'webapp.html')
      }
    }
  },
  plugins: [react()],
})
