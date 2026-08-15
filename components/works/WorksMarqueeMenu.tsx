'use client'

import { Fragment, useRef, type CSSProperties } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { closestEdgeFromEvent } from '@/lib/closestEdge'
import { onPageHeroEnterComplete } from '@/lib/page-hero'
import { WORKS, workListBrand, workPath, type Work } from '@/lib/works'

gsap.registerPlugin(useGSAP)

const ANIMATION_DEFAULTS = { duration: 0.6, ease: 'expo' } as const
const ENTRANCE_Y = 28

function marqueeAssets(work: Work): string[] {
  const extras = work.marqueeImages?.filter(Boolean) ?? []
  if (extras.length >= 2) return extras
  return [work.image, work.image, work.image]
}

function MarqueeStrip({ work }: { work: Work }) {
  const images = marqueeAssets(work)
  const labels = [workListBrand(work), work.date, work.stack]

  const units = labels.map((label, i) => ({
    label,
    image: images[i % images.length],
  }))

  // Duplicate content for seamless CSS loop (translate -50%).
  const loop = [...units, ...units]

  return (
    <>
      {loop.map((unit, i) => (
        <Fragment key={`${work.id}-unit-${i}`}>
          <span className="works-marquee__label">{unit.label}</span>
          <div
            className="works-marquee__img"
            style={{ backgroundImage: `url(${unit.image})` }}
            role="presentation"
          />
        </Fragment>
      ))}
    </>
  )
}

/**
 * Direction-aware marquee menu for the Works archive.
 * Pattern from Codrops / K72 (Locomotive):
 * https://tympanus.net/codrops/2021/06/30/how-to-code-the-k72-marquee-hover-animation/
 */
export default function WorksMarqueeMenu() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current
      if (!root || !contextSafe) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')

      const items = Array.from(
        root.querySelectorAll<HTMLElement>('[data-works-item]'),
      )

      const cleanups: Array<() => void> = []

      // Hide rows until the page hero kicks content (same cue as About).
      if (!reducedMotion.matches) {
        gsap.set(items, { autoAlpha: 0, y: ENTRANCE_Y })
      }

      const playEntrance = contextSafe(() => {
        if (reducedMotion.matches) {
          gsap.set(items, { clearProps: 'opacity,visibility,transform' })
          return
        }

        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
        })
      })

      cleanups.push(onPageHeroEnterComplete(playEntrance))

      items.forEach((item) => {
        const link = item.querySelector<HTMLElement>('[data-works-link]')
        const marquee = item.querySelector<HTMLElement>('[data-works-marquee]')
        const marqueeInner = item.querySelector<HTMLElement>(
          '[data-works-marquee-inner]',
        )
        if (!link || !marquee || !marqueeInner) return

        gsap.set(marquee, { yPercent: 101 })
        gsap.set(marqueeInner, { yPercent: -101 })

        if (reducedMotion.matches || !canHover.matches) {
          if (!canHover.matches) return

          const show = contextSafe(() => {
            gsap.set([marquee, marqueeInner], { yPercent: 0 })
          })
          const hide = contextSafe(() => {
            gsap.set(marquee, { yPercent: 101 })
            gsap.set(marqueeInner, { yPercent: -101 })
          })

          link.addEventListener('mouseenter', show)
          link.addEventListener('mouseleave', hide)
          link.addEventListener('focus', show)
          link.addEventListener('blur', hide)
          cleanups.push(() => {
            link.removeEventListener('mouseenter', show)
            link.removeEventListener('mouseleave', hide)
            link.removeEventListener('focus', show)
            link.removeEventListener('blur', hide)
          })
          return
        }

        const mouseEnter = contextSafe((ev: Event) => {
          const edge = closestEdgeFromEvent(ev as MouseEvent, item)
          gsap
            .timeline({ defaults: ANIMATION_DEFAULTS })
            .set(marquee, { yPercent: edge === 'top' ? -101 : 101 }, 0)
            .set(marqueeInner, { yPercent: edge === 'top' ? 101 : -101 }, 0)
            .to([marquee, marqueeInner], { yPercent: 0 }, 0)
        })

        const mouseLeave = contextSafe((ev: Event) => {
          const edge = closestEdgeFromEvent(ev as MouseEvent, item)
          gsap
            .timeline({ defaults: ANIMATION_DEFAULTS })
            .to(marquee, { yPercent: edge === 'top' ? -101 : 101 }, 0)
            .to(marqueeInner, { yPercent: edge === 'top' ? 101 : -101 }, 0)
        })

        const focusEnter = contextSafe(() => {
          gsap
            .timeline({ defaults: ANIMATION_DEFAULTS })
            .set(marquee, { yPercent: -101 }, 0)
            .set(marqueeInner, { yPercent: 101 }, 0)
            .to([marquee, marqueeInner], { yPercent: 0 }, 0)
        })

        const focusLeave = contextSafe(() => {
          gsap
            .timeline({ defaults: ANIMATION_DEFAULTS })
            .to(marquee, { yPercent: -101 }, 0)
            .to(marqueeInner, { yPercent: 101 }, 0)
        })

        link.addEventListener('mouseenter', mouseEnter)
        link.addEventListener('mouseleave', mouseLeave)
        link.addEventListener('focus', focusEnter)
        link.addEventListener('blur', focusLeave)

        cleanups.push(() => {
          link.removeEventListener('mouseenter', mouseEnter)
          link.removeEventListener('mouseleave', mouseLeave)
          link.removeEventListener('focus', focusEnter)
          link.removeEventListener('blur', focusLeave)
          gsap.killTweensOf([marquee, marqueeInner])
        })
      })

      return () => {
        cleanups.forEach((fn) => fn())
      }
    },
    { scope: rootRef },
  )

  return (
    <nav
      ref={rootRef}
      className="works-marquee"
      aria-label="Selected works"
    >
      <div className="works-marquee__list">
        {WORKS.map((work) => {
          const fg = work.marqueeFg ?? '#FDFDEA'
          const overlayStyle = {
            backgroundColor: work.marqueeBg,
            color: fg,
            '--works-marquee-fg': fg,
          } as CSSProperties

          return (
            <div key={work.id} data-works-item className="works-marquee__item">
              <Link
                href={workPath(work)}
                data-works-link
                data-cursor="view"
                className="works-marquee__link"
                aria-label={`View project: ${workListBrand(work)}`}
              >
                <span className="works-marquee__row site-container">
                  <span className="works-marquee__brand">{workListBrand(work)}</span>
                  <span className="works-marquee__desc">
                    {work.description ?? ''}
                  </span>
                  <span className="works-marquee__cta" aria-hidden="true">
                    View Case
                  </span>
                </span>
              </Link>

              <div
                data-works-marquee
                className="works-marquee__overlay"
                style={overlayStyle}
                aria-hidden="true"
              >
                <div
                  data-works-marquee-inner
                  className="works-marquee__overlay-inner"
                >
                  <div className="works-marquee__track">
                    <MarqueeStrip work={work} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
