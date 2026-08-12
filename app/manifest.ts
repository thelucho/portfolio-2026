import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Thelucho | Freelance Creative Developer in Argentina',
    short_name: 'Thelucho',
    description:
      'Freelance creative developer in Buenos Aires — frontend, GSAP, Next.js, and WordPress. Open to contractor roles.',
    start_url: '/',
    display: 'standalone',
    background_color: '#2B4625',
    theme_color: '#2B4625',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
