import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Thelucho | Creative Developer',
    short_name: 'Thelucho',
    description:
      'Thelucho is a creative developer with a passion for building web applications that are both functional and aesthetically pleasing.',
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
