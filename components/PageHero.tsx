'use client'

import { useRef, type ReactNode } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import NoiseLayer from '@/components/NoiseLayer'
import { onIntroComplete } from '@/lib/intro'
import {
  resetPageHeroEnter,
  signalPageHeroEnterComplete,
} from '@/lib/page-hero'

gsap.registerPlugin(useGSAP, SplitText)

export type PageHeroTone = 'forest' | 'cream'
export type PageHeroAlign = 'center' | 'left'

export type PageHeroProps = {
  title: string
  /** Small uppercase label above the title (e.g. "Creative Developer"). */
  eyebrow?: string
  /** Optional short supporting line under the title. */
  description?: ReactNode
  /** Surface tone. Default: forest. */
  tone?: PageHeroTone
  /** Title alignment. Default: center. */
  align?: PageHeroAlign
}

/**
 * Compact page hero for internal routes (About, Works, Contact).
 * Title entrance mirrors the homepage Hero word reveal (blur / scale / opacity).
 */
export default function PageHero({
  title,
  eyebrow,
  description,
  tone = 'forest',
  align = 'center',
}: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isCream = tone === 'cream'
  const isLeft = align === 'left'
  const useUppercase = !isCream

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      resetPageHeroEnter()

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      const eyebrowEl = section.querySelector<HTMLElement>('[data-page-hero-eyebrow]')
      const titleEl = section.querySelector<HTMLElement>('[data-page-hero-title]')
      const descriptionEl = section.querySelector<HTMLElement>('[data-page-hero-description]')

      const finish = () => signalPageHeroEnterComplete()

      if (!titleEl) {
        finish()
        return
      }

      if (reducedMotion.matches) {
        gsap.set([eyebrowEl, titleEl, descriptionEl].filter(Boolean), { clearProps: 'all' })
        finish()
        return
      }

      const split = SplitText.create(titleEl, { type: 'chars', mask: 'chars' })

      // Serif glyphs can overhang their boxes — same padding trick as the Intro.
      gsap.set(split.masks, {
        paddingInline: '0.08em',
        marginInline: '-0.08em',
      })

      gsap.set(split.chars, {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(4px)',
      })
      gsap.set(titleEl, { opacity: 1 })

      if (eyebrowEl) gsap.set(eyebrowEl, { clipPath: 'inset(0 100% 0 0)' })
      if (descriptionEl) gsap.set(descriptionEl, { opacity: 0, y: 14 })

      const play = () => {
        // Shorter than the home Hero delay — internal pages should feel snappier.
        const tl = gsap.timeline({ delay: 0.2 })

        if (eyebrowEl) {
          tl.to(eyebrowEl, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.75,
            ease: 'power4.inOut',
          })
        }

        tl.to(
          split.chars,
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.95,
            ease: 'power2.out',
            stagger: {
              each: 0.04,
              from: 'center',
            },
            clearProps: 'filter',
          },
          eyebrowEl ? '-=0.35' : 0,
        )

        // Kick content while the title is still settling — no long dead beat.
        tl.call(finish, undefined, '-=0.55')

        if (descriptionEl) {
          tl.to(
            descriptionEl,
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: 'power3.out',
            },
            '-=0.5',
          )
        }
      }

      const unsubscribe = onIntroComplete(play)

      return () => {
        unsubscribe()
        split.revert()
      }
    },
    { scope: sectionRef, dependencies: [title, eyebrow, description, tone, align] },
  )

  return (
    <section
      ref={sectionRef}
      data-tone={tone}
      className={[
        'page-hero relative z-0 flex w-full overflow-hidden',
        isCream ? 'items-end bg-[#FDFDEA]' : 'items-center justify-center',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        isCream
          ? undefined
          : { backgroundImage: 'radial-gradient(circle, #516B4C 0%, #2B4625 100%)' }
      }
    >
      {!isCream ? (
        <Image
          src="/images/hero/hero-background-shape.png"
          alt=""
          width={2200}
          height={1560}
          priority
          aria-hidden
          className="pointer-events-none absolute top-[var(--page-hero-bg-top)] left-0 z-0 h-auto w-auto max-w-none origin-top-left scale-[var(--page-hero-bg-scale)] select-none opacity-70"
        />
      ) : null}
      <NoiseLayer className="z-[1]" />

      <div
        className={[
          'site-container relative z-10 flex w-full flex-col pb-[var(--page-hero-pb)] pt-[var(--page-hero-pt)]',
          isLeft ? 'items-start text-left' : 'items-center text-center',
        ].join(' ')}
      >
        {eyebrow ? (
          <p
            data-page-hero-eyebrow
            className={[
              'mb-3 font-serif text-[length:var(--page-hero-eyebrow-size)] font-light uppercase leading-none tracking-[0.04em] will-change-[clip-path] md:mb-4',
              isCream ? 'text-[#929c3b]' : 'text-[#ABC337]',
            ].join(' ')}
          >
            {eyebrow}
          </p>
        ) : null}

        <h1
          data-page-hero-title
          className={[
            'font-serif text-[length:var(--page-hero-title-size)] font-normal leading-[0.92] tracking-[var(--page-hero-title-tracking)]',
            useUppercase ? 'uppercase' : '',
            isCream ? 'text-[#2B4625]' : 'text-white',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {title}
        </h1>

        {description ? (
          <p
            data-page-hero-description
            className={[
              'mt-5 max-w-[34ch] font-sans text-[length:var(--page-hero-desc-size)] font-light leading-relaxed tracking-wide will-change-[opacity,transform] md:mt-6',
              isCream ? 'text-[#2B4625]/75' : 'text-[#FDFDEA]/85',
            ].join(' ')}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  )
}
