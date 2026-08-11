'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ImageTrail } from '@/lib/imageTrail'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const CREAM = '#FDFDEA'
const FOREST = '#2B4625'

/** Codrops demo 2 trail assets — replace freely under /public/images/statement/ */
const TRAIL_IMAGES = [
  '/images/statement/trail-01.jpg',
  '/images/statement/trail-02.jpg',
  '/images/statement/trail-03.jpg',
  '/images/statement/trail-04.jpg',
  '/images/statement/trail-05.jpg',
  '/images/statement/trail-06.jpg',
  '/images/statement/trail-07.jpg',
  '/images/statement/trail-08.jpg',
  '/images/statement/trail-09.jpg',
  '/images/statement/trail-10.jpg',
]

/** Closing philosophy block inside Featured Works — text reveal + motion trail. */
export default function Statement() {
  const blockRef = useRef<HTMLElement>(null)
  const phraseRef = useRef<HTMLParagraphElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useGSAP(
    (_, contextSafe) => {
      const block = blockRef.current
      const phrase = phraseRef.current
      const hint = hintRef.current
      const trailRoot = trailRef.current
      if (!block || !phrase) return

      const mm = gsap.matchMedia()
      let raf1 = 0
      let raf2 = 0

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(phrase, { autoAlpha: 1, color: CREAM })
        if (hint) gsap.set(hint, { autoAlpha: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(phrase, { autoAlpha: 0, color: FOREST })
        if (hint) gsap.set(hint, { autoAlpha: 0 })

        let split: SplitText | undefined
        let revealTl: gsap.core.Timeline | undefined
        let revealSt: ScrollTrigger | undefined

        raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => {
            gsap.set(phrase, { autoAlpha: 1 })
            split = SplitText.create(phrase, {
              type: 'words',
              mask: 'words',
            })
            gsap.set(split.words, { yPercent: 110 })

            revealTl = gsap.timeline({ paused: true })
            revealTl.to(
              split.words,
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.07,
                ease: 'power3.out',
              },
              0.5,
            )
            if (hint) {
              revealTl.to(
                hint,
                {
                  autoAlpha: 0.55,
                  duration: 0.6,
                  ease: 'power2.out',
                },
                '-=0.2',
              )
            }

            revealSt = ScrollTrigger.create({
              trigger: block,
              start: 'top 45%',
              once: true,
              onEnter: () => revealTl?.play(0),
            })

            ScrollTrigger.refresh()
          })
        })

        return () => {
          cancelAnimationFrame(raf1)
          cancelAnimationFrame(raf2)
          revealSt?.kill()
          revealTl?.kill()
          split?.revert()
        }
      })

      // Motion trail (Codrops demo 2) — desktop pointer only (not mobile).
      mm.add(
        '(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 768px)',
        () => {
          if (!trailRoot || !contextSafe) return

          const trail = new ImageTrail(trailRoot)
          const HINT_DISMISS_DISTANCE = 100
          let hintDismissed = false
          let hintOrigin: { x: number; y: number } | null = null

          const onPointerMove = contextSafe((event: PointerEvent) => {
            const rect = block.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            trail.setPointer(x, y)

            if (!hint || hintDismissed) return

            if (!hintOrigin) {
              hintOrigin = { x, y }
              return
            }

            const traveled = Math.hypot(x - hintOrigin.x, y - hintOrigin.y)
            if (traveled < HINT_DISMISS_DISTANCE) return

            hintDismissed = true
            gsap.to(hint, {
              autoAlpha: 0,
              y: 6,
              duration: 0.45,
              ease: 'power2.out',
            })
          })

          const onPointerLeave = contextSafe(() => {
            trail.stop()
          })

          block.addEventListener('pointermove', onPointerMove)
          block.addEventListener('pointerleave', onPointerLeave)

          return () => {
            block.removeEventListener('pointermove', onPointerMove)
            block.removeEventListener('pointerleave', onPointerLeave)
            trail.destroy()
          }
        },
      )

      return () => {
        cancelAnimationFrame(raf1)
        cancelAnimationFrame(raf2)
        mm.revert()
      }
    },
    { scope: blockRef },
  )

  return (
    <aside
      ref={blockRef}
      data-statement
      aria-label="Project philosophy"
      className="relative z-0 flex min-h-[70dvh] items-center justify-center overflow-clip px-6 md:min-h-[100dvh] md:px-10"
    >
      <div
        ref={trailRef}
        className="statement-trail pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        {TRAIL_IMAGES.map((src) => (
          <div key={src} data-trail-img className="statement-trail__img">
            <div
              data-trail-img-inner
              className="statement-trail__img-inner"
              style={{ backgroundImage: `url(${src})` }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <p
          ref={phraseRef}
          data-statement-phrase
          className="max-w-[18ch] text-center font-serif text-[3.75rem] leading-[1.2] tracking-[-0.03em] text-[#2B4625]"
        >
          Each project is a chance to{' '}
          <em className="font-normal italic text-olive">learn</em>,{' '}
          <em className="font-normal italic text-olive">experiment</em> and push
          my limits.
        </p>

        <p
          ref={hintRef}
          data-statement-cta
          className="pointer-events-none mt-10 hidden items-center gap-2.5 font-sans text-[0.7rem] font-medium tracking-[0.22em] text-[#2B4625] uppercase opacity-0 [@media(pointer:fine)]:flex"
          aria-hidden
        >
          <svg
            width="14"
            height="20"
            viewBox="0 0 14 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="statement-hint__mouse shrink-0"
          >
            <rect
              x="1"
              y="1"
              width="12"
              height="18"
              rx="6"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <line
              x1="7"
              y1="4.5"
              x2="7"
              y2="8"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              className="statement-hint__wheel"
            />
          </svg>
          Move your cursor
        </p>
      </div>
    </aside>
  )
}
