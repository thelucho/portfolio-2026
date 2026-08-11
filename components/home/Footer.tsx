'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { NAV_ITEMS, SOCIAL_LINKS } from '@/lib/navigation'
import AsteriskMark from '@/components/AsteriskMark'
import NoiseLayer from '@/components/NoiseLayer'

gsap.registerPlugin(useGSAP)

const YEAR = new Date().getFullYear()

/** Site footer — forest gradient surface that reveals over the pinned Statement. */
export default function Footer() {
  const markRef = useRef<SVGSVGElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const mark = markRef.current
      if (!mark || !contextSafe) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (reducedMotion.matches) return

      gsap.set(mark, { transformOrigin: '50% 50%' })

      const spin = gsap.to(mark, {
        rotation: '+=360',
        duration: 6.5,
        ease: 'none',
        repeat: -1,
      })

      const onEnter = contextSafe(() => {
        gsap.to(spin, {
          timeScale: 0,
          duration: 1,
          ease: 'power2.out',
          overwrite: true,
        })
      })

      const onLeave = contextSafe(() => {
        gsap.to(spin, {
          timeScale: 1,
          duration: 0.7,
          ease: 'power2.out',
          overwrite: true,
        })
      })

      mark.addEventListener('pointerenter', onEnter)
      mark.addEventListener('pointerleave', onLeave)

      return () => {
        mark.removeEventListener('pointerenter', onEnter)
        mark.removeEventListener('pointerleave', onLeave)
      }
    },
    { dependencies: [] },
  )

  return (
    <footer
      data-site-footer
      className="site-footer relative z-30 overflow-hidden rounded-t-[2rem] text-[#FDFDEA] md:rounded-t-[2.75rem]"
      style={{
        backgroundImage: 'radial-gradient(circle, #516B4C 0%, #2B4625 100%)',
      }}
    >
      <NoiseLayer className="z-0" />

      <div className="site-container relative z-10 flex flex-col pt-[var(--footer-pt)] pb-[var(--footer-pb)]">
        <div className="flex flex-col gap-[var(--footer-top-gap)] lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-4 md:gap-6">
            <p
              data-footer-cta
              className="max-w-[16ch] font-sans text-[length:var(--footer-cta-size)] font-semibold leading-[1.15] tracking-[-0.03em] text-[#FDFDEA]"
            >
              Let’s connect and create something great together.
            </p>
            <a
              href="mailto:hello@thelucho.dev"
              className="font-sans text-sm font-light tracking-wide text-[#FDFDEA]/90 underline decoration-[#FDFDEA]/35 underline-offset-4 transition-opacity hover:opacity-70 md:text-base"
            >
              hello@thelucho.dev
            </a>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:justify-end">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  {item.soon ? (
                    <span
                      data-cursor="soon"
                      aria-disabled="true"
                      className="font-sans text-sm font-light tracking-wide text-[#FDFDEA]/90 transition-opacity hover:opacity-70 md:text-base"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="font-sans text-sm font-light tracking-wide text-[#FDFDEA]/90 transition-opacity hover:opacity-70 md:text-base"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-[var(--footer-gap)] flex items-end gap-3 md:gap-5">
          <p
            data-footer-wordmark
            className="min-w-0 flex-1 font-serif text-[length:var(--footer-wordmark-size)] leading-[0.85] tracking-[-0.04em] text-[#FDFDEA]"
          >
            Thelucho
          </p>
          <AsteriskMark
            ref={markRef}
            width={70}
            height={70}
            className="mb-[0.9em] h-[var(--footer-mark-size)] w-[var(--footer-mark-size)] shrink-0 cursor-pointer will-change-transform"
          />
        </div>

        <div className="mt-[var(--footer-after-wordmark)] flex flex-col-reverse gap-4 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:pt-6">
          <p className="font-sans text-xs font-light tracking-wide text-[#FDFDEA]/70 md:text-sm">
            © {YEAR} Thelucho — Creative Developer
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {SOCIAL_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs font-light tracking-wide text-[#FDFDEA] underline decoration-[#FDFDEA]/35 underline-offset-4 transition-opacity hover:opacity-70 md:text-sm"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
