'use client'

import { forwardRef, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useLenis } from 'lenis/react'
import { FEATURED_WORKS, workPath, type FeaturedWork } from '@/lib/works'
import NoiseLayer from '@/components/NoiseLayer'
import Footer from '@/components/home/Footer'
import Statement from '@/components/home/Statement'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const MARQUEE_PHRASE = 'Featured Works — '
const MARQUEE_COPIES = 8
const CREAM = '#FDFDEA'
const INK = '#0D1104'
const FOREST = '#2B4625'
/** Soft corner radius for work thumbnails (also applied to GSAP clip-paths). */
const WORK_MEDIA_RADIUS = '12px'

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
      <Link
        href={workPath(work)}
        data-work-media
        data-cursor="view"
        className="relative aspect-square w-full overflow-hidden rounded-[12px] [transform-style:preserve-3d] lg:w-[min(48%,560px)] lg:shrink-0"
        aria-label={`View case: ${work.title}`}
      >
        <div
          data-work-image
          className="absolute inset-0 h-full w-full will-change-transform [transform-style:preserve-3d]"
        >
          <Image
            src={work.image}
            alt={work.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      </Link>

      <div data-work-copy className="flex min-w-0 flex-1 flex-col justify-center">
        <p
          data-work-brand
          className="mb-3 font-sans text-[0.7rem] font-semibold tracking-[0.14em] text-[#2B4625] uppercase sm:text-xs"
        >
          {work.brand}
        </p>

        <h3
          data-work-title
          className="w-full max-w-none font-serif text-[clamp(1.85rem,3.4vw,3.15rem)] leading-[1.12] tracking-[-0.03em] text-[#2B4625] md:max-w-[16ch]"
        >
          <Link href={workPath(work)} className="transition-opacity hover:opacity-70">
            {work.title}
          </Link>
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
                    className="work-site-link break-all transition-opacity hover:opacity-70"
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
          href={workPath(work)}
          className="view-case-link mt-8 inline-flex w-fit items-center gap-2.5 font-sans sm:mt-10"
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

function bindWorkHover(row: HTMLElement) {
  const media = row.querySelector<HTMLElement>('[data-work-media]')
  const image = row.querySelector<HTMLElement>('[data-work-image]')
  if (!media || !image) return () => {}

  gsap.set(media, { transformPerspective: 1200 })
  gsap.set(image, { transformOrigin: '50% 50%', force3D: true })

  const rotXTo = gsap.quickTo(image, 'rotationX', { duration: 0.7, ease: 'power3' })
  const rotYTo = gsap.quickTo(image, 'rotationY', { duration: 0.7, ease: 'power3' })
  const xTo = gsap.quickTo(image, 'xPercent', { duration: 0.8, ease: 'power3' })
  const yTo = gsap.quickTo(image, 'yPercent', { duration: 0.8, ease: 'power3' })

  const clipProxy = { t: 0, r: 0, b: 0, l: 0 }
  let clipTween: gsap.core.Tween | undefined
  let hovering = false

  const renderClip = () => {
    gsap.set(media, {
      clipPath: `inset(${clipProxy.t}% ${clipProxy.r}% ${clipProxy.b}% ${clipProxy.l}% round ${WORK_MEDIA_RADIUS})`,
    })
  }

  const animateClip = (t: number, r: number, b: number, l: number, duration: number) => {
    clipTween?.kill()
    clipTween = gsap.to(clipProxy, {
      t,
      r,
      b,
      l,
      duration,
      ease: 'power3.out',
      overwrite: 'auto',
      onUpdate: renderClip,
    })
  }

  const onPointerEnter = () => {
    if (!row.hasAttribute('data-work-ready')) return
    hovering = true
    gsap.to(image, {
      scale: 1.14,
      duration: 0.95,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!row.hasAttribute('data-work-ready')) return

    if (!hovering) {
      hovering = true
      gsap.to(image, {
        scale: 1.14,
        duration: 0.95,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const rect = row.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const nx = gsap.utils.clamp(-1, 1, ((event.clientX - rect.left) / rect.width) * 2 - 1)
    const ny = gsap.utils.clamp(-1, 1, ((event.clientY - rect.top) / rect.height) * 2 - 1)

    // Tilt toward the cursor; image drifts opposite for depth.
    rotXTo(ny * -10)
    rotYTo(nx * 12)
    xTo(nx * -4.5)
    yTo(ny * -4.5)

    // Asymmetric aperture that leans into the pointer.
    const depth = 2.8
    animateClip(
      Math.max(0, depth - ny * 2.2),
      Math.max(0, depth + nx * 2.2),
      Math.max(0, depth + ny * 2.2),
      Math.max(0, depth - nx * 2.2),
      0.55,
    )
  }

  const onPointerLeave = () => {
    hovering = false
    gsap.to(image, {
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      xPercent: 0,
      yPercent: 0,
      duration: 1,
      ease: 'power3.out',
      overwrite: 'auto',
    })
    animateClip(0, 0, 0, 0, 0.85)
    clipTween?.eventCallback('onComplete', () => {
      if (!hovering) gsap.set(media, { clearProps: 'clipPath' })
    })
  }

  row.addEventListener('pointerenter', onPointerEnter)
  row.addEventListener('pointermove', onPointerMove)
  row.addEventListener('pointerleave', onPointerLeave)

  return () => {
    row.removeEventListener('pointerenter', onPointerEnter)
    row.removeEventListener('pointermove', onPointerMove)
    row.removeEventListener('pointerleave', onPointerLeave)
    clipTween?.kill()
    gsap.killTweensOf([image, media, clipProxy])
    gsap.set(image, { clearProps: 'transform' })
    gsap.set(media, { clearProps: 'clipPath,transform' })
  }
}

function revealWorkRow(row: HTMLElement) {
  const media = row.querySelector<HTMLElement>('[data-work-media]')
  const image = row.querySelector<HTMLElement>('[data-work-image]')
  const brand = row.querySelector<HTMLElement>('[data-work-brand]')
  const title = row.querySelector<HTMLElement>('[data-work-title]')
  const metaRows = gsap.utils.toArray<HTMLElement>(row.querySelectorAll('[data-work-meta-row]'))
  const cta = row.querySelector<HTMLElement>('[data-work-cta]')

  // Awwwards-style image: wipe up + scale settle inside overflow.
  if (media) {
    gsap.set(media, {
      autoAlpha: 1,
      clipPath: `inset(100% 0 0 0 round ${WORK_MEDIA_RADIUS})`,
    })
  }
  if (image) {
    gsap.set(image, { scale: 1.2 })
  }

  gsap.set([brand, ...metaRows, cta].filter(Boolean), {
    autoAlpha: 0,
    y: 32,
  })

  let titleWords: Element[] = []
  let split: SplitText | undefined
  if (title) {
    // Parent was hidden to prevent FOUC; show it so masked words can reveal.
    gsap.set(title, { autoAlpha: 1 })
    split = SplitText.create(title, {
      type: 'words',
      mask: 'words',
    })
    titleWords = split.words
    gsap.set(titleWords, { yPercent: 110 })
  }

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      if (media) gsap.set(media, { clearProps: 'clipPath' })
      if (image) gsap.set(image, { clearProps: 'transform' })
      row.setAttribute('data-work-ready', '')
    },
  })

  if (media) {
    tl.to(
      media,
      {
        clipPath: `inset(0% 0% 0% 0% round ${WORK_MEDIA_RADIUS})`,
        duration: 1.25,
        ease: 'power3.inOut',
      },
      0,
    )
  }
  if (image) {
    tl.to(
      image,
      {
        scale: 1,
        duration: 1.45,
        ease: 'power2.out',
      },
      0,
    )
  }
  if (brand) {
    tl.to(brand, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.35)
  }
  if (titleWords.length) {
    // Word-by-Word Build (masked yPercent reveal)
    tl.to(
      titleWords,
      {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power3.out',
      },
      0.42,
    )
  }
  if (metaRows.length) {
    tl.to(
      metaRows,
      { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' },
      0.62,
    )
  }
  if (cta) {
    tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
  }

  const st = ScrollTrigger.create({
    trigger: row,
    start: 'top 80%',
    once: true,
    onEnter: () => tl.play(0),
  })

  return () => {
    st.kill()
    tl.kill()
    split?.revert()
  }
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
      const cleanups: Array<() => void> = []
      let raf1 = 0
      let raf2 = 0
      let resizeTimer = 0

      mm.add('(prefers-reduced-motion: reduce)', () => {
        reducedMotion.current = true
        gsap.set(marquee, { autoAlpha: 1, y: 0 })
        gsap.set(section, { backgroundColor: CREAM })
        gsap.set(section.querySelectorAll('[data-work-row]'), { autoAlpha: 1 })
        gsap.set(
          section.querySelectorAll(
            '[data-work-media], [data-work-image], [data-work-brand], [data-work-title], [data-work-meta-row], [data-work-cta]',
          ),
          { autoAlpha: 1, y: 0, scale: 1, clearProps: 'transform,clipPath' },
        )

        const statement = section.querySelector<HTMLElement>('[data-statement]')
        const footer = section.querySelector<HTMLElement>('[data-site-footer]')
        if (statement) {
          ScrollTrigger.create({
            trigger: statement,
            start: 'top 70%',
            end: 'bottom top',
            onEnter: () => {
              gsap.set(section, { backgroundColor: INK })
              document.documentElement.setAttribute('data-header-theme', 'ink')
            },
            onEnterBack: () => {
              gsap.set(section, { backgroundColor: INK })
              document.documentElement.setAttribute('data-header-theme', 'ink')
            },
            onLeaveBack: () => {
              gsap.set(section, { backgroundColor: CREAM })
              document.documentElement.setAttribute('data-header-theme', 'light')
            },
          })
        }
        if (footer) {
          ScrollTrigger.create({
            trigger: footer,
            start: 'top 55%',
            onEnter: () => {
              document.documentElement.removeAttribute('data-header-theme')
            },
            onLeaveBack: () => {
              document.documentElement.setAttribute('data-header-theme', 'ink')
            },
          })
        }
      })

      mm.add(
        '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
        () => {
          const hoverCleanups: Array<() => void> = []
          const rows = gsap.utils.toArray<HTMLElement>(
            section.querySelectorAll('[data-work-row]'),
          )
          rows.forEach((row) => {
            hoverCleanups.push(bindWorkHover(row))
          })
          return () => {
            hoverCleanups.splice(0).forEach((fn) => fn())
          }
        },
      )

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        reducedMotion.current = false
        gsap.set(marquee, { autoAlpha: 0, y: 28 })
        gsap.set(section, { backgroundColor: CREAM })

        const rows = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll('[data-work-row]'),
        )

        // Hide immediately to avoid a flash before triggers are wired.
        rows.forEach((row) => {
          const media = row.querySelector<HTMLElement>('[data-work-media]')
          const image = row.querySelector<HTMLElement>('[data-work-image]')
          const brand = row.querySelector<HTMLElement>('[data-work-brand]')
          const title = row.querySelector<HTMLElement>('[data-work-title]')
          const metaRows = gsap.utils.toArray<HTMLElement>(
            row.querySelectorAll('[data-work-meta-row]'),
          )
          const cta = row.querySelector<HTMLElement>('[data-work-cta]')

          if (media) gsap.set(media, { clipPath: `inset(100% 0 0 0 round ${WORK_MEDIA_RADIUS})` })
          if (image) gsap.set(image, { scale: 1.2 })
          if (title) gsap.set(title, { autoAlpha: 0 })
          gsap.set([brand, ...metaRows, cta].filter(Boolean), { autoAlpha: 0, y: 32 })
        })

        const setInkTheme = (ink: boolean) => {
          document.documentElement.setAttribute(
            'data-header-theme',
            ink ? 'ink' : 'light',
          )
        }

        // Defer until after parent pin ScrollTriggers mount, then refresh
        // so start positions aren't calculated before pin-spacing exists.
        raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => {
            ScrollTrigger.refresh()
            rows.forEach((row) => {
              cleanups.push(revealWorkRow(row))
            })

            const statement = section.querySelector<HTMLElement>('[data-statement]')
            const phrase = section.querySelector<HTMLElement>('[data-statement-phrase]')
            const statementCta = section.querySelector<HTMLElement>('[data-statement-cta]')
            const footer = section.querySelector<HTMLElement>('[data-site-footer]')

            if (statement) {
              // Shared surface wash — GSAP owns backgroundColor (no React style prop).
              const colorTween = gsap.fromTo(
                section,
                { backgroundColor: CREAM },
                {
                  backgroundColor: INK,
                  ease: 'none',
                  immediateRender: false,
                  scrollTrigger: {
                    trigger: statement,
                    start: 'top 55%',
                    end: 'top 15%',
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => setInkTheme(self.progress >= 0.45),
                    onLeave: () => setInkTheme(true),
                    onEnterBack: (self) => setInkTheme(self.progress >= 0.45),
                    onLeaveBack: () => setInkTheme(false),
                  },
                },
              )
              cleanups.push(() => {
                colorTween.scrollTrigger?.kill()
                colorTween.kill()
              })

              const statementCopy = [phrase, statementCta].filter(Boolean)
              if (statementCopy.length) {
                const phraseTween = gsap.fromTo(
                  statementCopy,
                  { color: FOREST },
                  {
                    color: CREAM,
                    ease: 'none',
                    immediateRender: false,
                    scrollTrigger: {
                      trigger: statement,
                      start: 'top 55%',
                      end: 'top 15%',
                      scrub: 0.6,
                      invalidateOnRefresh: true,
                    },
                  },
                )
                cleanups.push(() => {
                  phraseTween.scrollTrigger?.kill()
                  phraseTween.kill()
                })
              }

              // Pin Statement so the footer slides over it (parallax reveal).
              if (footer) {
                const pinSt = ScrollTrigger.create({
                  trigger: statement,
                  start: 'top top',
                  endTrigger: footer,
                  end: 'bottom bottom',
                  pin: true,
                  pinSpacing: false,
                  anticipatePin: ScrollTrigger.isTouch > 0 ? 0 : 1,
                  invalidateOnRefresh: true,
                })
                cleanups.push(() => pinSt.kill())

                // Forest footer → restore default (white) header chrome.
                const footerThemeSt = ScrollTrigger.create({
                  trigger: footer,
                  start: 'top 50%',
                  onEnter: () => {
                    document.documentElement.removeAttribute('data-header-theme')
                  },
                  onLeaveBack: () => setInkTheme(true),
                })
                cleanups.push(() => footerThemeSt.kill())
              }
            }

            ScrollTrigger.refresh()
          })
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

        return () => {
          cancelAnimationFrame(raf1)
          cancelAnimationFrame(raf2)
          cleanups.splice(0).forEach((fn) => fn())
          gsap.set(section, { backgroundColor: CREAM })
          if (document.documentElement.getAttribute('data-header-theme') === 'ink') {
            document.documentElement.setAttribute('data-header-theme', 'light')
          }
        }
      })

      let lastWidth = window.innerWidth
      const onResize = () => {
        const width = window.innerWidth
        const widthChanged = width !== lastWidth
        lastWidth = width
        // iOS URL-bar show/hide is a height-only resize. Refreshing pins
        // here is what makes Hero / Manifesto / Statement copy bounce.
        if (!widthChanged && ScrollTrigger.isTouch) return
        measureChunk()
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(() => {
          ScrollTrigger.refresh()
        }, 180)
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
        cancelAnimationFrame(raf1)
        cancelAnimationFrame(raf2)
        window.clearTimeout(resizeTimer)
        window.removeEventListener('resize', onResize)
        cleanups.splice(0).forEach((fn) => fn())
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
      className="relative z-20 -mt-[20svh] overflow-x-clip bg-[#FDFDEA] pt-10 text-[#2B4625] md:pt-14"
    >
      <NoiseLayer className="z-0" />
      <div
        ref={marqueeRef}
        className="relative z-10 mb-16 overflow-hidden md:mb-40 lg:mb-52"
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

      <div className="site-container relative z-10 mt-24 flex justify-center md:mt-32 lg:mt-40">
        <Link
          href="/works"
          className="view-case-link all-works-link inline-flex w-fit items-center gap-2.5 font-sans"
        >
          Explore All Works
          <span aria-hidden className="view-case-arrow text-lg leading-none">
            <span className="view-case-arrow-icon">↗</span>
            <span className="view-case-arrow-icon">↗</span>
          </span>
          <span aria-hidden className="view-case-underline" />
        </Link>
      </div>

      <div className="relative isolate mt-[100px]">
        <Statement />
        {/* Extra scroll room while Statement stays pinned before the footer reveal. */}
        <div aria-hidden className="h-[40svh] w-full md:h-[70svh]" />
        <Footer />
      </div>
    </section>
  )
})

export default FeaturedWorks
