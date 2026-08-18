/**
 * Canonical site identity — used by metadata, JSON-LD, sitemap, and OG images.
 * Override the public URL with NEXT_PUBLIC_SITE_URL when deploying previews.
 * Default language is English; a Spanish locale can be added later.
 */
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thelucho.dev').replace(
    /\/$/,
    '',
  ),
  name: 'Thelucho',
  shortName: 'Thelucho',
  title: 'Thelucho | Freelance Creative Developer in Argentina',
  tagline: 'Creative Developer',
  locale: 'en_US',
  language: 'en',
  email: 'hello@thelucho.dev',
  person: {
    name: 'Luciano Dichiara',
    alternateNames: ['Thelucho', 'Lucho'],
    jobTitle: 'Creative Developer',
    jobTitles: [
      'Creative Developer',
      'Frontend Developer',
      'GSAP Developer',
      'WordPress Developer',
    ],
    description:
      'Freelance creative developer in Buenos Aires, Argentina. Frontend, GSAP, Next.js, and WordPress — tailor-made web experiences with thoughtful motion. Open to contractor roles.',
    image: '/images/about/about-picture.jpg',
    city: 'Buenos Aires',
    country: 'AR',
    countryName: 'Argentina',
  },
  social: {
    github: 'https://github.com/thelucho',
    linkedin: 'https://www.linkedin.com/in/luciano-dichiara/',
  },
  analytics: {
    gaId: 'G-G53JGJSMQP',
  },
} as const

export const SITE_KEYWORDS = [
  'Creative Developer Argentina',
  'Wordpress Developer Argentina',
  'Frontend Developer',
  'GSAP Developer',
  'freelance Next.js Argentina',
  'Freelance Wordpress Argentina',
] as const

export const SITE_DESCRIPTION =
  'Freelance creative developer in Buenos Aires, Argentina. Frontend, GSAP, Next.js and WordPress — motion-led sites built with craft. Open to contractor part-time or full-time roles.'

export const PAGE_COPY = {
  home: {
    title: SITE.title,
    description: SITE_DESCRIPTION,
  },
  about: {
    title: 'About',
    description:
      'Luciano Dichiara is a freelance creative developer in Buenos Aires. Frontend, GSAP, Next.js and WordPress since 2010 — open to part-time or full-time contractor roles.',
  },
  works: {
    title: 'Works',
    description:
      'Selected Next.js, WordPress, and GSAP projects by Thelucho — a freelance creative developer in Argentina. Case studies spanning platforms and craft-led marketing sites.',
  },
  contact: {
    title: 'Contact',
    description:
      'Hire Luciano Dichiara (Thelucho) — freelance creative and frontend developer in Argentina. Open to contractor, part-time, or full-time remote roles.',
  },
} as const

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE.url
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
}
