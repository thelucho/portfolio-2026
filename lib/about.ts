export type ExperienceItem = {
  role: string
  company: string
  period: string
  location: string
}

export type InterestItem = {
  title: string
  detail: string
}

export type AboutStat = {
  value: string
  label: string
}

export type TechItem = {
  id: string
  label: string
}

export const ABOUT_STATS: AboutStat[] = [
  { value: '15+', label: 'years of experience' },
  { value: '70+', label: 'projects shipped' },
]

export const ABOUT_EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Creative Developer',
    company: 'Studio Hakuna',
    period: '2018 — 2026',
    location: 'Argentina / Remote',
  },
  {
    role: 'Frontend Developer',
    company: 'Códigos Estudio',
    period: '2015 — 2018',
    location: 'Argentina / Remote',
  },
  {
    role: 'Frontend Developer',
    company: 'Ceropixel',
    period: '2012 — 2015',
    location: 'Argentina / In-house',
  },
  {
    role: 'Web Developer',
    company: 'Independent & agency work',
    period: '2010 — 2018',
    location: 'Argentina / In-house',
  },
]

/** Stack shown on About — icons resolved via simple-icons in the UI. */
export const ABOUT_TECH: TechItem[] = [
  { id: 'html5', label: 'HTML5' },
  { id: 'css3', label: 'CSS3' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'nuxt', label: 'Nuxt' },
  { id: 'react', label: 'React' },
  { id: 'next', label: 'Next.js' },
  { id: 'strapi', label: 'Strapi' },
  { id: 'astro', label: 'Astro' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'gsap', label: 'GSAP' },
  { id: 'wordpress', label: 'WordPress' },
  { id: 'framer', label: 'Framer' },
  { id: 'webflow', label: 'Webflow' },
  { id: 'figma', label: 'Figma' },
]

export const ABOUT_INTERESTS: InterestItem[] = [
  {
    title: 'Interfaces in motion',
    detail:
      'Building complex, lightweight experiences that feel alive — motion with purpose, never for its own sake.',
  },
  {
    title: 'Sports',
    detail:
      'Football, padel, long walks, and bike rides — anything that gets me moving and clears the head.',
  },
  {
    title: 'Side hobbies',
    detail:
      'Flying a drone, picking up instruments, sinking into a good series, and always having music on.',
  },
]
