import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Local development stays at /; Pages supplies /daria-portfolio/.
  base: process.env.DEPLOY_BASE_PATH || '/',
})
