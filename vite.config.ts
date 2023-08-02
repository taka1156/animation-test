import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
  base: mode !== 'development' ? '/animation-test/' : './',
  server: {
    port: 8080,
  },
  plugins: [react()],
}))
