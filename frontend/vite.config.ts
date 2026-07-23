import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { // Your frontend does: fetch('/api/analytics/weekly-volume?start=...&end=...')
      // That goes to the same origin as the page — e.g. http://localhost:5173. Vite doesn’t implement those routes; without a proxy you’d get a 404 from the frontend dev server.
      // The proxy says: “If the path starts with /api (or /health), forward the request to http://localhost:3000 instead.”
      // Browser  →  localhost:5173/api/analytics/weekly-volume
      //          ↓ (Vite proxy)
      //            localhost:3000/api/analytics/weekly-volume  →  Express handles it

      // Backend routes live under /api/import and /api/analytics — do not strip /api.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // Sets the proxied request's Host header to match the target (localhost:3000). . Helps with servers that care about host/origin. For local dev it’s mostly harmless insurance.
        // Full Hevy exports can take several minutes; don't abort before Express finishes.
        timeout: 0,
        proxyTimeout: 0,
      },
      '/health': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
