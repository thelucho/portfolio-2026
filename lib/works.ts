export type FeaturedWork = {
  id: string
  brand: string
  title: string
  date: string
  stack: string
  agency: string
  linkLabel: string
  href: string
  image: string
  imageAlt: string
}

export const FEATURED_WORKS: FeaturedWork[] = [
  {
    id: 'oneaxiom',
    brand: 'OneAxiom',
    title: 'Cybersecurity solutions company website',
    date: 'January 2025',
    stack: 'Next.js / Tailwind / Strapi / Framer Motion',
    agency: 'Studio Hakuna',
    linkLabel: 'oneaxiom.com',
    href: 'https://oneaxiom.com',
    image: '/images/works/oneaxiom.jpg',
    imageAlt: 'OneAxiom cybersecurity dashboard on a tablet',
  },
  {
    id: 'aims',
    brand: 'AIMS International',
    title: 'Global consulting company',
    date: 'December 2024',
    stack: 'Next.js / Tailwind / Strapi / Rive',
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
    date: 'April 2025',
    stack: 'Webflow / GSAP',
    agency: 'Studio Hakuna',
    linkLabel: 'homee.com',
    href: 'https://homee.com',
    image: '/images/works/homee.jpg',
    imageAlt: 'Key in a wooden door lock with house-shaped keychain',
  },
]
