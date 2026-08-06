import type { SimpleIcon } from 'simple-icons'
import {
  siAstro,
  siCss,
  siFigma,
  siFramer,
  siGsap,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNuxt,
  siReact,
  siStrapi,
  siTailwindcss,
  siWebflow,
  siWordpress,
} from 'simple-icons'

const TECH_ICONS: Record<string, SimpleIcon> = {
  html5: siHtml5,
  css3: siCss,
  javascript: siJavascript,
  nuxt: siNuxt,
  react: siReact,
  next: siNextdotjs,
  strapi: siStrapi,
  astro: siAstro,
  tailwind: siTailwindcss,
  gsap: siGsap,
  wordpress: siWordpress,
  framer: siFramer,
  webflow: siWebflow,
  figma: siFigma,
}

type TechIconProps = {
  id: string
  label: string
  className?: string
}

/** Brand mark from simple-icons, tinted with currentColor. */
export default function TechIcon({ id, label, className = '' }: TechIconProps) {
  const icon = TECH_ICONS[id]
  if (!icon) return null

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      aria-hidden
      className={['size-[1.35rem] shrink-0 fill-current md:size-6', className]
        .filter(Boolean)
        .join(' ')}
    >
      <title>{label}</title>
      <path d={icon.path} />
    </svg>
  )
}
