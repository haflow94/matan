import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Matan — Étude de textes arabes',
    short_name: 'Matan',
    description: 'Analyse et vocalisation de textes arabes classiques',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F1E6',
    theme_color: '#186A4C',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}
