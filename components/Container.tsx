import type { ElementType, ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
  /** HTML element to render. Default: div. */
  as?: ElementType
}

/**
 * Optional wrapper around `site-container`. Prefer the CSS class directly
 * when GSAP needs a specific DOM node or when nesting would get in the way.
 */
export default function Container({
  children,
  className = '',
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag className={['site-container', className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
