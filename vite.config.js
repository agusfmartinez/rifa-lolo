import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // URL pública del sitio (ej: https://rifa-lolo.netlify.app) para que la imagen
  // de Open Graph sea absoluta. Si no está, queda relativa.
  const siteUrl = (env.VITE_SITE_URL || env.URL || '').replace(/\/$/, '')

  return {
    plugins: [
      react(),
      {
        name: 'site-url',
        transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
      },
    ],
    test: {
      environment: 'node',
    },
  }
})
