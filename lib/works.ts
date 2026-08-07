export type FeaturedWork = {
  id: string
  brand: string
  /** Homepage headline (Featured Works). Not shown as the Works-page blurb. */
  title: string
  date: string
  stack: string
  agency: string
  linkLabel: string
  href: string
  image: string
  imageAlt: string
}

/** Extended work entry for the Works archive (marquee menu). */
export type Work = FeaturedWork & {
  /**
   * Short blurb on the Works page row (center column).
   * Independent from `title`, which stays the homepage headline.
   */
  description?: string
  /** Marquee overlay background on hover. */
  marqueeBg: string
  /** Marquee text / accent color. Defaults to cream. */
  marqueeFg?: string
  /** Extra images cycled in the hover marquee (falls back to `image`). */
  marqueeImages?: string[]
}

/** URL slug from a brand name, e.g. "AIMS International" → "aims-international". */
export function slugFromBrand(brand: string): string {
  return brand
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function workPath(work: FeaturedWork): string {
  return `/works/${slugFromBrand(work.brand)}`
}

export const FEATURED_WORKS: FeaturedWork[] = [
  {
    id: 'oneaxiom',
    brand: 'OneAxiom',
    title: 'Cybersecurity solutions company website',
    date: 'January 2025',
    stack: 'Next / Tailwind / Strapi',
    agency: 'Studio Hakuna',
    linkLabel: 'oneaxiom.com',
    href: 'https://oneaxiom.com',
    image: '/images/works/oneaxiom.jpg',
    imageAlt: 'OneAxiom cybersecurity dashboard on a tablet',
  },
  {
    id: 'aims',
    brand: 'AIMS',
    title: 'Global consulting company',
    date: 'December 2024',
    stack: 'Next / Tailwind / Strapi / Rive',
    agency: 'Studio Hakuna',
    linkLabel: 'aimsinternational.com',
    href: 'https://aimsinternational.com',
    image: '/images/works/aims.jpg',
    imageAlt: 'Architectural spiral staircase with circular skylight',
  },
  {
    id: 'homee',
    brand: 'Homee',
    title: 'Home repair services platform',
    date: 'April 2026',
    stack: 'Webflow / GSAP',
    agency: 'Studio Hakuna',
    linkLabel: 'homee.com',
    href: 'https://homee.com',
    image: '/images/works/homee.jpg',
    imageAlt: 'Key in a wooden door lock with house-shaped keychain',
  },
]

const [oneAxiom, aims, homee] = FEATURED_WORKS

/** Full Works archive — homepage featured set plus additional projects. */
export const WORKS: Work[] = [
  {
    ...oneAxiom,
    description: 'Enterprise cybersecurity platform',
    marqueeImages: [
      '/images/works/oneaxiom-01.jpg',
      '/images/works/oneaxiom-02.jpg',
      '/images/works/oneaxiom-03.jpg',
    ],
    marqueeBg: '#2B4625',
    marqueeFg: '#FDFDEA',
  },
  {
    ...aims,
    description: 'Global executive leadership consultancy',
    marqueeImages: [
      '/images/works/aims-01.jpg',
      '/images/works/aims-02.jpg',
      '/images/works/aims-03.jpg',
    ],
    marqueeBg: '#0D1104',
    marqueeFg: '#FDFDEA',
  },
  {
    ...homee,
    description: 'AI-powered home repair platform',
    marqueeImages: [
      '/images/works/homee-01.jpg',
      '/images/works/homee-02.jpg',
      '/images/works/homee-03.jpg',
    ],
    marqueeBg: '#929C3B',
    marqueeFg: '#FDFDEA',
  },
  {
    id: 'rocket-bags',
    brand: 'Rocket Bags',
    title: 'Rocket Bags',
    date: 'February 2025',
    stack: 'Wordpress / SASS',
    agency: 'Studio Hakuna',
    linkLabel: 'rocketbags.co.uk',
    href: '#',
    image: '/images/works/rocket-bags.svg',
    imageAlt: 'Custom-made bags catalog',
    description: 'Custom promotional bag manufacturer',
    marqueeImages: [
      '/images/works/rocket-bags-01.jpg',
      '/images/works/rocket-bags-02.jpg',
      '/images/works/rocket-bags-03.jpg',
    ],
    marqueeBg: '#2B4625',
    marqueeFg: '#FDFDEA',
  },
  {
    id: 'rocket-badge',
    brand: 'Rocket Badge',
    title: 'Rocket Badge',
    date: 'June 2026',
    stack: 'Wordpress / SASS',
    agency: 'Studio Hakuna',
    linkLabel: 'rocketbadge.co.uk',
    href: 'https://rocketbadgestg.wpengine.com/',
    image: '/images/works/rocket-badge.svg',
    imageAlt: 'Custom-made badges catalog',
    description: 'Charity fundraising merchandise supplier',
    marqueeImages: [
      '/images/works/rocket-badge-01.jpg',
      '/images/works/rocket-badge-02.jpg',
      '/images/works/rocket-badge-03.jpg',
    ],
    marqueeBg: '#5C6B3A',
    marqueeFg: '#FDFDEA',
  },
  {
    id: 'legend-of-learning',
    brand: 'LOL',
    title: 'Legends of Learning',
    date: 'November 2024',
    stack: 'Wordpress / BEM',
    agency: 'Studio Hakuna',
    linkLabel: 'legendsoflearning.com',
    href: 'https://www.legendsoflearning.com/',
    image: '/images/works/legend-of-learning.svg',
    imageAlt: 'Legend of Learning platform visual',
    description: 'Game-based learning platform',
    marqueeImages: [
      '/images/works/lol-01.jpg',
      '/images/works/lol-02.jpg',
      '/images/works/lol-03.jpg',
    ],
    marqueeBg: '#0D1104',
    marqueeFg: '#A7B987',
  },
  {
    id: 'portfolio',
    brand: 'Portfolio',
    title: 'Portfolio',
    date: 'August 2026',
    stack: 'Next / Tailwind / GSAP',
    agency: 'Thelucho',
    linkLabel: 'thelucho.dev',
    href: 'https://thelucho.dev/',
    image: '/images/works/portfolio.svg',
    imageAlt: 'Portfolio website',
    description: 'Personal site focused on craft and motion',
    marqueeImages: [
      '/images/works/portfolio-01.jpg',
      '/images/works/portfolio-02.jpg',
      '/images/works/portfolio-03.jpg',
    ],
    marqueeBg: '#929C3B',
    marqueeFg: '#FDFDEA',
  },
]
