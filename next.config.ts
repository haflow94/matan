import type { NextConfig } from 'next'
import withPWA from '@ducanh2912/next-pwa'

// turbopack: {} pour le dev (Next.js 16 l'active par défaut).
// Le build de prod utilise --webpack (voir package.json) pour que next-pwa
// puisse générer sw.js via ses hooks webpack.
const nextConfig: NextConfig = {
  turbopack: {},
}

export default withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^\/api\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
        },
      },
    ],
  },
})(nextConfig)
