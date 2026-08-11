export type NavItem = {
  label: string
  href: string
  /** When true, rendered as a non-navigable label with the "soon" cursor. */
  soon?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Works', href: '/works' },
  { label: 'About', href: '/about' },
  { label: 'Labs', href: '/labs', soon: true },
  { label: 'Contact', href: '/contact' },
]

export type SocialLink = {
  label: string
  href: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/thelucho' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/luciano-dichiara/' },
]
