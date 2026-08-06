'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageHero, { type PageHeroProps } from '@/components/PageHero'
import Footer from '@/components/home/Footer'
import NoiseLayer from '@/components/NoiseLayer'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export type InternalPageProps = PageHeroProps & {
  children: ReactNode
}

/**
 * Shared shell for internal routes: compact PageHero, cream content band, footer.
 * Switches header theme when the cream body crosses under the fixed header.
 * Cream-tone pages keep the light header for the whole page — the forest footer
 * never reaches the header, and ScrollToTop handles its own ring over the footer.
 * Root cream fill keeps the footer's rounded top readable against the page.
 */
export default function InternalPage({
  title,
  eyebrow,
  description,
  tone = 'forest',
  align = 'center',
  children,
}: InternalPageProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLElement>(null)
  const isCream = tone === 'cream'

  useGSAP(
    () => {
      const body = bodyRef.current
      if (!body) return

      const setHeaderTheme = (light: boolean) => {
        if (light) {
          document.documentElement.setAttribute('data-header-theme', 'light')
        } else {
          document.documentElement.removeAttribute('data-header-theme')
        }
      }

      // Cream pages stay light: footer never covers the header, and flipping
      // the theme paints body forest — which erases the footer's rounded top.
      if (isCream) {
        setHeaderTheme(true)
        return () => {
          document.documentElement.removeAttribute('data-header-theme')
        }
      }

      const trigger = ScrollTrigger.create({
        trigger: body,
        start: 'top 72px',
        end: 'bottom 72px',
        onToggle: (self) => setHeaderTheme(self.isActive),
      })

      setHeaderTheme(trigger.isActive)

      return () => {
        trigger.kill()
        document.documentElement.removeAttribute('data-header-theme')
      }
    },
    { scope: rootRef, dependencies: [isCream] },
  )

  return (
    <div
      ref={rootRef}
      data-tone={tone}
      className="internal-page flex flex-1 flex-col bg-[#FDFDEA]"
    >
      <PageHero
        title={title}
        eyebrow={eyebrow}
        description={description}
        tone={tone}
        align={align}
      />

      <section
        ref={bodyRef}
        className={[
          'internal-page__body relative z-20 flex-1 overflow-x-clip bg-[#FDFDEA] text-[#2B4625]',
          isCream ? 'internal-page__body--flush' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <NoiseLayer className="z-0" />
        <div
          className={[
            'site-container relative z-10',
            isCream ? 'pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-24 lg:pt-14' : 'py-16 md:py-20 lg:py-24',
          ].join(' ')}
        >
          {children}
        </div>
      </section>

      <Footer />
    </div>
  )
}
