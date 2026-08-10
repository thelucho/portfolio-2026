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
  /** One-paragraph overview of what the product / site is. */
  about: string
  /** One-paragraph note on the project goal. */
  objective: string
  /** Marquee overlay background on hover. */
  marqueeBg: string
  /** Marquee text / accent color. Defaults to cream. */
  marqueeFg?: string
  /** Extra images cycled in the hover marquee (falls back to `image`). */
  marqueeImages?: string[]
  /**
   * Case-study gallery on the work detail page (hero + grid).
   * Convention: `/images/works/{id}-detail-01.jpg` … `-04.jpg`.
   */
  detailImages: string[]
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

export function workSlug(work: FeaturedWork): string {
  return slugFromBrand(work.brand)
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

/** Four detail-page assets: `{id}-detail-01.jpg` … `-04.jpg`. */
function detailImagesFor(id: string): string[] {
  return [1, 2, 3, 4].map(
    (n) => `/images/works/${id}-detail-0${n}.jpg`,
  )
}

/** Full Works archive — homepage featured set plus additional projects. */
export const WORKS: Work[] = [
  {
    ...oneAxiom,
    description: 'Enterprise cybersecurity platform',
    about:
      'A marketing site for an enterprise cybersecurity company — clear product storytelling, structured services, and a CMS-driven content model.',
    objective:
      'Present complex security offerings with clarity, and give the team a fast way to publish updates without sacrificing craft.',
    marqueeImages: [
      '/images/works/oneaxiom-01.jpg',
      '/images/works/oneaxiom-02.jpg',
      '/images/works/oneaxiom-03.jpg',
    ],
    detailImages: detailImagesFor('oneaxiom'),
    marqueeBg: '#2B4625',
    marqueeFg: '#FDFDEA',
  },
  {
    ...aims,
    description: 'Global executive leadership consultancy',
    about:
      'A global consulting presence for executive search and leadership advisory — editorial layout, motion accents, and multi-market content.',
    objective:
      'Elevate brand authority online and make expertise feel tangible across regions and practice areas.',
    marqueeImages: [
      '/images/works/aims-01.jpg',
      '/images/works/aims-02.jpg',
      '/images/works/aims-03.jpg',
    ],
    detailImages: detailImagesFor('aims'),
    marqueeBg: '#0D1104',
    marqueeFg: '#FDFDEA',
  },
  {
    ...homee,
    description: 'AI-powered home repair platform',
    about:
      'A consumer-facing platform that connects homeowners with repair services, guided by a calm visual system and fluid Webflow interactions.',
    objective:
      'Make booking feel simple and trustworthy — from first glance to the moment someone requests help.',
    marqueeImages: [
      '/images/works/homee-01.jpg',
      '/images/works/homee-02.jpg',
      '/images/works/homee-03.jpg',
    ],
    detailImages: detailImagesFor('homee'),
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
    about:
      'A catalog-led WordPress site for a custom promotional bag manufacturer — product ranges, capabilities, and enquiry paths.',
    objective:
      'Help buyers browse collections quickly and understand custom options without getting lost in SKUs.',
    marqueeImages: [
      '/images/works/rocket-bags-01.jpg',
      '/images/works/rocket-bags-02.jpg',
      '/images/works/rocket-bags-03.jpg',
    ],
    detailImages: detailImagesFor('rocket-bags'),
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
    about:
      'A merchandise site for charity fundraising badges — product discovery, campaign storytelling, and straightforward ordering cues.',
    objective:
      'Support fundraising partners with a clear shop experience that keeps the cause front and center.',
    marqueeImages: [
      '/images/works/rocket-badge-01.jpg',
      '/images/works/rocket-badge-02.jpg',
      '/images/works/rocket-badge-03.jpg',
    ],
    detailImages: detailImagesFor('rocket-badge'),
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
    about:
      'A game-based learning platform site that introduces educators to curriculum-aligned experiences and product pathways.',
    objective:
      'Communicate learning impact clearly and guide teachers toward the right product entry points.',
    marqueeImages: [
      '/images/works/lol-01.jpg',
      '/images/works/lol-02.jpg',
      '/images/works/lol-03.jpg',
    ],
    detailImages: detailImagesFor('lol'),
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
    about:
      'A personal portfolio focused on craft, motion, and selected work — built as a living showcase of process and taste.',
    objective:
      'Present projects with intention, and leave a clear path for collaborations and conversations.',
    marqueeImages: [
      '/images/works/portfolio-01.jpg',
      '/images/works/portfolio-02.jpg',
      '/images/works/portfolio-03.jpg',
    ],
    detailImages: detailImagesFor('portfolio'),
    marqueeBg: '#929C3B',
    marqueeFg: '#FDFDEA',
  },
]

export function getWorkBySlug(slug: string): Work | undefined {
  return WORKS.find((work) => workSlug(work) === slug)
}

/** Next works in archive order (wraps around). */
export function getNextWorks(current: Work, count = 2): Work[] {
  const index = WORKS.findIndex((work) => work.id === current.id)
  if (index < 0) return []

  return Array.from(
    { length: Math.min(count, WORKS.length - 1) },
    (_, offset) => WORKS[(index + offset + 1) % WORKS.length],
  )
}

export function workYear(work: FeaturedWork): string {
  return work.date.match(/\d{4}/)?.[0] ?? ''
}

/** Case-study gallery images for the work detail page. */
export function workGalleryImages(work: Work): string[] {
  return work.detailImages
}
