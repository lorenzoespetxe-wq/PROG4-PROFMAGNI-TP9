import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const ngrokHost = env.VITE_NGROK_HOST

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      ...(ngrokHost ? { allowedHosts: [ngrokHost] } : {}),
      proxy: {
        "/auth": "http://127.0.0.1:8000",
        "/participantes": "http://127.0.0.1:8000",
        "/pagos": "http://127.0.0.1:8000",
      },
    },
  }
})