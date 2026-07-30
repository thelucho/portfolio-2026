'use client'

import { forwardRef, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { FEATURED_WORKS, type FeaturedWork } from '@/lib/works'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const MARQUEE_PHRASE = 'Featured Works — '
const MARQUEE_COPIES = 8
const CREAM = '#FDFDEA'

type WorkRowProps = {
  work: FeaturedWork
  reverse: boolean
}

function WorkRow({ work, reverse }: WorkRowProps) {
  return (
    <article
      data-work-row
      className={`flex flex-col gap-10 lg:items-center lg:gap-16 xl:gap-24 ${
        reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
      }`}
    >
      <div
        data-work-media
        className="relative aspect-square w-full overflow-hidden rounded-[2rem] lg:w-[min(48%,560px)] lg:shrink-0"
      >
        <Image
          src={work.image}
          alt={work.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-cover"
        />
      </div>

      <div data-work-copy className="flex min-w-0 flex-1 flex-col justify-center">
        <p
          data-work-brand
          className="mb-3 font-sans text-[0.7rem] font-semibold tracking-[0.14em] text-[#2B4625] uppercase sm:text-xs"
        >
          {work.brand}
        </p>

        <h3
          data-work-title
          className="max-w-[16ch] font-serif text-[clamp(1.85rem,3.4vw,3.15rem)] leading-[1.12] tracking-[-0.03em] text-[#2B4625]"
        >
          {work.title}
        </h3>

        <dl data-work-meta className="mt-8 flex flex-col gap-2.5 sm:mt-10 sm:gap-3">
          {(
            [
              ['Date', work.date],
              ['Stack', work.stack],
              ['Agency', work.agency],
              ['Link', work.linkLabel],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              data-work-meta-row
              className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 sm:grid-cols-[6.5rem_1fr] sm:gap-8"
            >
              <dt className="font-sans text-sm text-[#2B4625]/55">{label}</dt>
              <dd className="min-w-0 font-sans text-sm text-[#2B4625] sm:text-[0.95rem]">
                {label === 'Link' ? (
                  <a
                    href={work.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all transition-opacity hover:opacity-70"
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <Link
          data-work-cta
          href={`/works#${work.id}`}
          className="view-case-link mt-8 inline-flex w-fit items-center gap-2.5 font-sans text-[0.95rem] font-bold text-sage sm:mt-10 sm:text-base"
        >
          View Case
          <span aria-hidden className="view-case-arrow text-lg leading-none">
            <span className="view-case-arrow-icon">↗</span>
            <span className="view-case-arrow-icon">↗</span>
          </span>
          <span aria-hidden className="view-case-underline" />
        </Link>
      </div>
    </article>
  )
}

const FeaturedWorks = forwardRef<HTMLElement>(function FeaturedWorks(_, ref) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xPos = useRef(0)
  const chunkWidth = useRef(0)
  const prevScroll = useRef<number | null>(null)
  const reducedMotion = useRef(false)

  const setSectionRef = (node: HTMLElement | null) => {
    sectionRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const measureChunk = () => {
    const track = trackRef.current
    const first = track?.children[0] as HTMLElement | undefined
    chunkWidth.current = first?.offsetWidth ?? 0
  }

  useLenis((lenis) => {
    if (reducedMotion.current) return

    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const rect = section.getBoundingClientRect()
    const inView = rect.bottom > 0 && rect.top < window.innerHeight
    if (!inView) {
      prevScroll.current = lenis.scroll
      return
    }

    if (chunkWidth.current <= 0) measureChunk()
    const width = chunkWidth.current
    if (width <= 0) return

    // Drive from scroll delta so motion stops exactly when Lenis settles.
    if (prevScroll.current === null) {
      prevScroll.current = lenis.scroll
      return
    }

    const delta = lenis.scroll - prevScroll.current
    prevScroll.current = lenis.scroll
    if (Math.abs(delta) < 0.001) return

    xPos.current -= delta * 0.55

    const wrap = gsap.utils.wrap(-width, 0)
    xPos.current = wrap(xPos.current)
    gsap.set(track, { x: xPos.current, force3D: true })
  })

  useGSAP(
    () => {
      const section = sectionRef.current
      const marquee = marqueeRef.current
      const track = trackRef.current
      if (!section || !marquee || !track) return

      measureChunk()

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        reducedMotion.current = true
        gsap.set(marquee, { autoAlpha: 1, y: 0 })
        gsap.set(section.querySelectorAll('[data-work-row]'), { autoAlpha: 1 })
        gsap.set(
          section.querySelectorAll(
            '[data-work-media], [data-work-brand], [data-work-title], [data-work-meta-row], [data-work-cta]',
          ),
          { autoAlpha: 1, y: 0, clearProps: 'transform' },
        )
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        reducedMotion.current = false
        gsap.set(marquee, { autoAlpha: 0, y: 28 })

        const rows = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-work-row]'))
        rows.forEach((row) => {
          const media = row.querySelector<HTMLElement>('[data-work-media]')
          const brand = row.querySelector<HTMLElement>('[data-work-brand]')
          const title = row.querySelector<HTMLElement>('[data-work-title]')
          const metaRows = gsap.utils.toArray<HTMLElement>(
            row.querySelectorAll('[data-work-meta-row]'),
          )
          const cta = row.querySelector<HTMLElement>('[data-work-cta]')

          gsap.set([media, brand, title, ...metaRows, cta].filter(Boolean), {
            autoAlpha: 0,
            y: 36,
          })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: 'top 78%',
              toggleActions: 'play none none none',
              once: true,
            },
          })

          if (media) {
            tl.to(media, { autoAlpha: 1, y: 0, duration: 1.05, ease: 'power3.out' }, 0)
          }
          if (brand) {
            tl.to(brand, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.12)
          }
          if (title) {
            tl.to(title, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.2)
          }
          if (metaRows.length) {
            tl.to(
              metaRows,
              { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' },
              0.38,
            )
          }
          if (cta) {
            tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.55)
          }
        })

        gsap.to(marquee, {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            // Appear as soon as Works peeks in — overlaps manifesto dissolve.
            start: 'top 86%',
            end: 'top 58%',
            scrub: 0.4,
          },
        })
      })

      const onResize = () => {
        measureChunk()
        ScrollTrigger.refresh()
      }

      // Re-measure after webfonts settle so the loop width is accurate.
      const fontsReady = document.fonts?.ready
      if (fontsReady) {
        void fontsReady.then(() => {
          measureChunk()
          ScrollTrigger.refresh()
        })
      }

      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('resize', onResize)
        mm.revert()
      }
    },
    { scope: sectionRef },
  )

  const marqueeChunk = Array.from({ length: MARQUEE_COPIES }, (_, i) => (
    <span key={i} className="shrink-0 whitespace-nowrap mr-4">
      {MARQUEE_PHRASE}
    </span>
  ))

  return (
    <section
      ref={setSectionRef}
      id="featured-works"
      aria-label="Featured Works"
      className="relative z-20 -mt-[20dvh] overflow-x-clip pb-28 pt-10 text-[#2B4625] md:pb-40 md:pt-14"
      style={{ backgroundColor: CREAM }}
    >
      <div
        ref={marqueeRef}
        className="relative z-10 mb-28 overflow-hidden md:mb-40 lg:mb-52"
        aria-hidden
      >
        <div
          ref={trackRef}
          className="flex w-max will-change-transform font-serif text-[clamp(3.25rem,9vw,7.5rem)] leading-none tracking-[-0.035em] text-sage"
        >
          <div className="flex shrink-0">{marqueeChunk}</div>
          <div className="flex shrink-0" aria-hidden>
            {marqueeChunk}
          </div>
        </div>
        <h2 className="sr-only">Featured Works</h2>
      </div>

      <div className="site-container relative z-10 flex flex-col gap-24 md:gap-32 lg:gap-40">
        {FEATURED_WORKS.map((work, index) => (
          <WorkRow key={work.id} work={work} reverse={index % 2 === 1} />
        ))}
      </div>
    </section>
  )
})

export default FeaturedWorks
