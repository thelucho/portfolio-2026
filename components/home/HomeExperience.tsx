'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '@/components/home/Hero'
import Manifesto from '@/components/home/Manifesto'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function HomeExperience() {
  const stageRef = useRef<HTMLDivElement>(null)
  const heroLayerRef = useRef<HTMLDivElement>(null)
  const creamRef = useRef<HTMLDivElement>(null)
  const manifestoRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const stage = stageRef.current
      const heroLayer = heroLayerRef.current
      const cream = creamRef.current
      const manifesto = manifestoRef.current
      if (!stage || !heroLayer || !cream || !manifesto) return

      const words = gsap.utils.toArray<HTMLElement>(manifesto.querySelectorAll('[data-word]'))
      const mm = gsap.matchMedia()

      const setHeaderTheme = (light: boolean) => {
        if (light) {
          document.documentElement.setAttribute('data-header-theme', 'light')
        } else {
          document.documentElement.removeAttribute('data-header-theme')
        }
      }

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(heroLayer, { autoAlpha: 0 })
        gsap.set(cream, { opacity: 1 })
        gsap.set(words, { opacity: 1 })
        gsap.set(manifesto, { autoAlpha: 1 })
        setHeaderTheme(true)
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(cream, { opacity: 0 })
        gsap.set(manifesto, { autoAlpha: 0 })
        gsap.set(words, { opacity: 0.2 })
        gsap.set(heroLayer, { autoAlpha: 1, y: 0, scale: 1 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=320%',
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setHeaderTheme(self.progress >= 0.38)
            },
            onLeave: () => setHeaderTheme(true),
            onEnterBack: () => setHeaderTheme(false),
          },
        })

        // Hold the Hero green briefly, then fade its content out.
        tl.to({}, { duration: 0.35 }, 0)

        tl.to(
          heroLayer,
          {
            autoAlpha: 0,
            y: -56,
            scale: 0.98,
            ease: 'none',
            duration: 1,
          },
          0.35,
        )

        // Only after the Hero is gone, morph into cream.
        tl.to(
          cream,
          {
            opacity: 1,
            ease: 'none',
            duration: 0.85,
          },
          1.4,
        )

        // Phrase stays centered in the pinned stage — reveal with the cream.
        tl.to(
          manifesto,
          {
            autoAlpha: 1,
            ease: 'none',
            duration: 0.5,
          },
          1.55,
        )

        // Paint each word while remaining locked to the viewport center.
        tl.to(
          words,
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            duration: 0.4,
          },
          1.9,
        )
      })

      return () => {
        mm.revert()
        document.documentElement.removeAttribute('data-header-theme')
      }
    },
    { scope: stageRef },
  )

  return (
    <div className="relative w-full overflow-x-clip">
      <div ref={stageRef} className="relative h-dvh w-full overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle,_#516B4C_0%,_#2B4625_100%)]"
        />

        <div ref={heroLayerRef} className="absolute inset-0 z-10 will-change-[opacity,transform]">
          <Hero />
        </div>

        <div
          ref={creamRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 bg-[#FDFDEA] will-change-[opacity]"
        />

        <div
          ref={manifestoRef}
          className="absolute inset-0 z-30 flex items-center justify-center will-change-[opacity]"
        >
          <Manifesto />
        </div>
      </div>
    </div>
  )
}
