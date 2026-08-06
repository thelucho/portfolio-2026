'use client'

import { useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLenis } from 'lenis/react'

gsap.registerPlugin(useGSAP)

const SIZE = 52
const STROKE = 1.5
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const SHOW_THRESHOLD = 80

export default function ScrollToTop() {
  const pathname = usePathname()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const progressRef = useRef<SVGCircleElement>(null)
  const visibleRef = useRef(false)
  const onFooterRef = useRef(false)

  useGSAP(
    () => {
      const button = buttonRef.current
      const progress = progressRef.current
      if (!button || !progress) return

      gsap.set(button, { y: 64, opacity: 0, pointerEvents: 'none' })
      gsap.set(progress, {
        strokeDasharray: CIRCUMFERENCE,
        strokeDashoffset: CIRCUMFERENCE,
      })
      visibleRef.current = false
      onFooterRef.current = false
      button.removeAttribute('data-on-footer')
    },
    { dependencies: [pathname], revertOnUpdate: true },
  )

  const lenis = useLenis(
    ({ scroll, progress }) => {
      const button = buttonRef.current
      const ring = progressRef.current
      if (!button || !ring) return

      const ratio = Math.min(Math.max(progress, 0), 1)
      ring.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - ratio))

      // Ring sits fixed over the footer long before header theme flips —
      // force cream track as soon as the button overlaps the forest surface.
      const footer = document.querySelector<HTMLElement>('[data-site-footer]')
      const overFooter = footer
        ? footer.getBoundingClientRect().top < button.getBoundingClientRect().bottom
        : false

      if (overFooter !== onFooterRef.current) {
        onFooterRef.current = overFooter
        if (overFooter) {
          button.setAttribute('data-on-footer', '')
        } else {
          button.removeAttribute('data-on-footer')
        }
      }

      const shouldShow = scroll > SHOW_THRESHOLD
      if (shouldShow === visibleRef.current) return
      visibleRef.current = shouldShow

      gsap.to(button, {
        y: shouldShow ? 0 : 64,
        opacity: shouldShow ? 1 : 0,
        pointerEvents: shouldShow ? 'auto' : 'none',
        duration: 0.5,
        ease: shouldShow ? 'power3.out' : 'power2.in',
        overwrite: 'auto',
      })
    },
    [pathname],
  )

  const handleClick = useCallback(() => {
    lenis?.scrollTo(0, { duration: 1.2 })
  }, [lenis])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      className="scroll-to-top fixed right-5 bottom-5 z-[60] flex size-[52px] items-center justify-center rounded-full md:right-8 md:bottom-8"
    >
      <svg
        className="pointer-events-none absolute inset-0 size-full -rotate-90"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="scroll-to-top__track"
        />
        <circle
          ref={progressRef}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          className="scroll-to-top__progress"
        />
      </svg>

      <span className="scroll-to-top__face absolute inset-[5px] flex items-center justify-center rounded-full">
        <svg
          width="16"
          height="9"
          viewBox="0 0 16 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M14.3334 7.66675L7.66671 1.00008L1.00005 7.66675"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  )
}
