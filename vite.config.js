import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev/preview servers bind to 0.0.0.0 so the sandbox preview proxy can reach them.
// `allowedHosts: true` keeps host-header checks happy behind the preview proxy.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    cors: true,
    allowedHosts: true
  },
  preview: {
    host: true,
    port: 4173,
    cors: true,
    allowedHosts: true
  }
})
