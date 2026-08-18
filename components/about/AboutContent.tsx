'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ABOUT_EXPERIENCE,
  ABOUT_INTERESTS,
  ABOUT_STATS,
  ABOUT_TECH,
} from '@/lib/about'
import { onPageHeroEnterComplete } from '@/lib/page-hero'
import TechIcon from '@/components/about/TechIcon'
import ViewCaseArrow from '@/components/ViewCaseArrow'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function revealSection(
  root: HTMLElement,
  selector: string,
  reducedMotion: boolean,
) {
  const section = root.querySelector<HTMLElement>(selector)
  if (!section || reducedMotion) return

  const items = section.querySelectorAll<HTMLElement>('[data-about-reveal]')
  gsap.set(items, { opacity: 0, y: 22 })

  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.75,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      once: true,
    },
  })
}

/**
 * About page body — Who I Am, Experience, Personal Interests.
 * Who I Am waits for the page hero title, then plays a staged entrance.
 */
export default function AboutContent() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const who = root.querySelector<HTMLElement>('[data-about-who]')
      const media = who?.querySelector<HTMLElement>('[data-about-media]')
      const whoCopy = who?.querySelectorAll<HTMLElement>('[data-about-reveal]') ?? []

      if (who && !reducedMotion) {
        if (media) gsap.set(media, { opacity: 0, y: 28, scale: 0.96 })
        gsap.set(whoCopy, { opacity: 0, y: 22 })
      }

      const playWhoEntrance = () => {
        if (!who) return

        if (reducedMotion) {
          gsap.set([media, ...whoCopy], { clearProps: 'all' })
          return
        }

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        if (media) {
          tl.to(media, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
          })
        }

        tl.to(
          whoCopy,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
          },
          media ? '-=0.4' : 0,
        )
      }

      const unsubscribe = onPageHeroEnterComplete(playWhoEntrance)

      revealSection(root, '[data-about-experience]', reducedMotion)
      revealSection(root, '[data-about-tech]', reducedMotion)
      revealSection(root, '[data-about-interests]', reducedMotion)

      return unsubscribe
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="flex flex-col gap-20 md:gap-28 lg:gap-32">
      {/* Who I Am */}
      <section data-about-who aria-labelledby="about-who-heading">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-10 lg:gap-14">
          <div
            data-about-media
            className="relative mx-auto w-[min(100%,280px)] md:col-span-5 md:mx-0 lg:col-span-4"
          >
            {/* Dot pattern peeking from the bottom-left corner */}
            <div
              aria-hidden
              className="about-photo-dots pointer-events-none absolute -bottom-7 -left-7 z-0 h-[58%] w-[68%] md:-bottom-9 md:-left-9"
            />
            <div className="relative z-10 overflow-hidden rounded-[1.35rem] shadow-[0_18px_40px_rgb(43_70_37_/_0.12)]">
              <Image
                src="/images/about/about-picture.jpg"
                alt="Luciano Dichiara (Thelucho), freelance creative developer in Buenos Aires"
                width={372}
                height={500}
                sizes="(max-width: 768px) min(100vw, 280px), 372px"
                className="aspect-[372/500] h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-8 md:col-span-7 md:pt-2 lg:col-span-8 lg:pt-4">
            <div className="flex flex-col gap-5">
              <h2
                id="about-who-heading"
                data-about-reveal
                className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em] text-[#2B4625]"
              >
                Hey, I&apos;m Lucho
              </h2>
              <p
                data-about-reveal
                className="max-w-[46ch] font-sans text-base font-light leading-8 tracking-wide text-[#2B4625]/88 md:text-[1.0625rem] md:leading-8"
              >
                A freelance creative developer in Argentina, crafting
                tailor-made web experiences where motion, typography, and
                interaction earn their place. Since 2010 I&apos;ve been shaping
                interfaces that feel considered, alive, and built to last.
              </p>
              <p
                data-about-reveal
                className="max-w-[46ch] font-sans text-base font-light leading-8 tracking-wide text-[#2B4625]/88 md:text-[1.0625rem] md:leading-8"
              >
                I work at the intersection of design and engineering — frontend
                systems, GSAP motion, Next.js, and WordPress, with details that
                make a product memorable. Currently independent, and open to
                contractor roles part-time or full-time.
              </p>
            </div>

            <div
              data-about-reveal
              className="flex flex-wrap gap-x-12 gap-y-6 border-t border-[#2B4625]/12 pt-8"
            >
              {ABOUT_STATS.map((stat) => (
                <div key={stat.label} className="flex min-w-[7rem] flex-col gap-1">
                  <span className="font-serif text-[clamp(2.25rem,4vw,3rem)] leading-none tracking-[-0.03em] text-[#2B4625]">
                    {stat.value}
                  </span>
                  <span className="font-sans text-sm font-light tracking-wide text-[#2B4625]/65">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div data-about-reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-14 md:gap-x-8">
              <Link
                href="/works"
                className="view-case-link inline-flex w-fit items-center gap-2.5 font-sans"
              >
                Explore works
                <ViewCaseArrow />
                <span aria-hidden className="view-case-underline" />
              </Link>
              <span
                aria-hidden
                className="hidden items-center gap-[5px] sm:inline-flex"
              >
                <span className="h-[3.25em] w-px origin-center rotate-[20deg] bg-[#929c3b]" />
                <span className="h-[3.25em] w-px origin-center rotate-[20deg] bg-[#929c3b]" />
              </span>
              <Link
                href="/contact"
                className="view-case-link inline-flex w-fit items-center gap-2.5 font-sans"
              >
                Get in touch
                <ViewCaseArrow />
                <span aria-hidden className="view-case-underline" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section data-about-experience aria-labelledby="about-experience-heading">
        <h2
          id="about-experience-heading"
          data-about-reveal
          className="mb-10 font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em] text-[#2B4625] md:mb-14"
        >
          Experience
        </h2>

        <ul className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 md:gap-y-12">
          {ABOUT_EXPERIENCE.map((item) => (
            <li key={`${item.company}-${item.period}`} data-about-reveal>
              <p className="font-sans text-base font-medium tracking-wide text-[#2B4625] md:text-lg">
                {item.role}
                <span className="font-light text-[#2B4625]/45"> | </span>
                {item.company}
              </p>
              <p className="mt-1.5 font-sans text-sm font-light tracking-wide text-[#2B4625]/60 md:text-[0.9375rem]">
                {item.period}
                <span className="text-[#2B4625]/35"> | </span>
                {item.location}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Technologies */}
      <section data-about-tech aria-labelledby="about-tech-heading">
        <h2
          id="about-tech-heading"
          data-about-reveal
          className="mb-10 font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em] text-[#2B4625] md:mb-14"
        >
          Technologies
        </h2>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 md:grid-cols-4 md:gap-x-8 md:gap-y-6 lg:grid-cols-7">
          {ABOUT_TECH.map((item) => (
            <li
              key={item.id}
              data-about-reveal
              className="flex items-center gap-2.5 text-[#2B4625]/80 transition-colors hover:text-[#2B4625]"
            >
              <TechIcon id={item.id} label={item.label} />
              <span className="font-sans text-sm font-light tracking-wide md:text-[0.9375rem]">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Personal Interests */}
      <section data-about-interests aria-labelledby="about-interests-heading">
        <h2
          id="about-interests-heading"
          data-about-reveal
          className="mb-10 font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.15] tracking-[-0.03em] text-[#2B4625] md:mb-14"
        >
          Personal interests
        </h2>

        <ul className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 md:gap-y-12">
          {ABOUT_INTERESTS.map((item) => (
            <li key={item.title} data-about-reveal className="max-w-[36ch]">
              <p className="font-sans text-base font-medium tracking-wide text-[#2B4625] md:text-lg">
                {item.title}
              </p>
              <p className="mt-1.5 font-sans text-sm font-light leading-6 tracking-wide text-[#2B4625]/60 md:text-[0.9375rem] md:leading-7">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
