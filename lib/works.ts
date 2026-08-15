export type FeaturedWork = {
  id: string
  brand: string
  /**
   * Optional URL slug. Defaults to a slugified `brand`.
   * Use when the public brand name should not drive the path (e.g. short archive label).
   */
  slug?: string
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
  /**
   * Compact brand label for the Works archive row when the full `brand` is too long.
   * Falls back to `brand` when omitted.
   */
  listBrand?: string
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

export function workSlug(work: FeaturedWork): string {
  return work.slug ?? slugFromBrand(work.brand)
}

export function workPath(work: FeaturedWork): string {
  return `/works/${workSlug(work)}`
}

/** Brand shown in the Works archive list (may be shorter than `brand`). */
export function workListBrand(work: Work): string {
  return work.listBrand ?? work.brand
}

export const FEATURED_WORKS: FeaturedWork[] = [
  {
    id: 'legend-of-learning',
    brand: 'Legends of Learning',
    slug: 'lol',
    title: 'Game-based learning platform',
    date: 'November 2024',
    stack: 'Wordpress / BEM',
    agency: 'Studio Hakuna',
    linkLabel: 'legendsoflearning.com',
    href: 'https://www.legendsoflearning.com/',
    image: '/images/works/lol.jpg',
    imageAlt: 'Legend of Learning platform visual',
  },
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
    image: '/images/works/aims-featured.jpg',
    imageAlt: 'AIMS website mockup with leadership hero and floating UI cards',
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

const [lol, oneAxiom, aims, homee] = FEATURED_WORKS

/** Four detail-page assets: `{id}-detail-01.jpg` … `-04.jpg`. */
function detailImagesFor(id: string): string[] {
  return [1, 2, 3, 4].map(
    (n) => `/images/works/${id}-detail-0${n}.jpg`,
  )
}

/** Full Works archive — homepage featured set plus additional projects. */
export const WORKS: Work[] = [
  {
    ...lol,
    listBrand: 'Legends',
    description: 'Game-based learning platform',
    about:
      "Legends of Learning is an online educational platform that uses video games and interactive simulations to teach core school subjects — math, science, and history — to K-8 students. The scope of this project was the platform's marketing website, the main entry point where teachers and schools learn about the product and sign up.",
    objective:
      "A comprehensive redesign of the website was carried out, keeping the original branding intact. The project focused on restructuring the information architecture to improve navigability and overall user experience, along with organic SEO optimization to strengthen the site's visibility and discoverability.",
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
    ...oneAxiom,
    description: 'Enterprise cybersecurity platform',
    about:
      'OneAxiom is a cybersecurity company operating as a Managed Security Service Provider (MSSP). It offers an analytics-driven platform and end-to-end security solutions, including 24/7 threat monitoring, vulnerability management, and dedicated incident response teams.',
    objective:
      'The website was built from the ground up on a modern, lightweight stack, with a custom UI design tailored to the brand. A key focus was making every piece of content easily manageable, giving the client full flexibility to update and maintain the site independently.',
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
      'AIMS International is a global leadership and human resources advisory firm, specializing in executive search, talent management, leadership development, and strategic consulting for companies across more than 90 countries.',
    objective:
      'The website was built on a modern, lightweight stack, with a custom UI design and fully manageable content architecture. A rigorous site-wide performance optimization strategy was also applied, aimed at improving Core Web Vitals metrics.',
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
      "HOMEE is an AI-powered technology platform that connects homeowners, insurers, and repair professionals to coordinate insurance claims and home maintenance across the United States — managing the full journey from initial claim to final repair, backed by a workmanship guarantee. The scope of this project was HOMEE's marketing website, used to present the service and drive sign-ups.",
    objective:
      'A comprehensive redesign of the website was carried out, keeping it aligned with the original branding. A clean, well-structured UI was implemented with the goal of enhancing the user experience and driving higher conversion rates.',
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
    href: 'https://www.rocketbags.co.uk/',
    image: '/images/works/rocket-bags.svg',
    imageAlt: 'Custom-made bags catalog',
    description: 'Custom promotional bag manufacturer',
    about:
      'Rocket Bags is a UK-based company specializing in the manufacturing and supply of custom-branded bags, backpacks, and promotional accessories for corporate clients.',
    objective:
      'A complete UX/UI redesign of the website was carried out, along with the implementation of a robust bulk product import system. Multiple performance and SEO optimizations were applied, complemented by A/B testing to validate design and conversion decisions.',
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
      'Rocket Badge is a British company specializing in the design and manufacturing of custom metal pins, badges, enamel insignias, and promotional keychains. With over 30 years of experience, it operates primarily in the UK market, serving corporate brands, charities, and events.',
    objective:
      'A complete UX/UI redesign of the website was carried out, restructuring the information architecture for better navigability. The site was also optimized to improve Core Web Vitals performance and strengthen search engine positioning.',
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
      "A personal portfolio designed and built from the ground up as a space to showcase selected work. Rather than a simple project list, it's conceived as a living showcase — a reflection of process, taste, and the way I approach development.",
    objective:
      'Present each project with intention, giving context and clarity to the work behind it. The site was also built to leave a clear, direct path for collaborations and conversations, making it easy for visitors and potential clients to get in touch.',
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
