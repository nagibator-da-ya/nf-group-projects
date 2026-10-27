import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// Tauri CLI выставляет TAURI_ENV_PLATFORM при beforeDevCommand / beforeBuildCommand
const IS_TAURI = !!process.env.TAURI_ENV_PLATFORM
// GitHub Pages: https://<логин>.github.io/nf-group-projects/
const REPO_BASE = process.env.PAGES_BASE || '/nf-group-projects/'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const BACKEND_IP = env.VITE_BACKEND_IP || '192.168.1.50'
  const base = IS_TAURI ? '/' : REPO_BASE

  return {
    base,
    plugins: [
      ...(!IS_TAURI && process.env.NODE_ENV !== 'production' ? [mkcert()] : []),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        manifest: {
          name: 'NF Hub - рынок ЦОД',
          short_name: 'NF Hub',
          start_url: base,
          scope: base,
          display: 'standalone',
          background_color: '#F5F6F8',
          theme_color: '#0F2A44',
          orientation: 'portrait-primary',
          lang: 'ru',
          icons: [
            { src: 'small_logo192x192.png', type: 'image/png', sizes: '192x192' },
            { src: 'small_logo512x512.png', type: 'image/png', sizes: '512x512' },
          ],
        },
      }),
    ],
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      watch: { usePolling: true },
      proxy: {
        '/api': { target: `http://${BACKEND_IP}:8080`, changeOrigin: true, secure: false },
      },
    },
  }
})
