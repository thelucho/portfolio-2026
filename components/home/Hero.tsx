'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { HERO_INTRO_DELAY, onIntroComplete } from '@/lib/intro'

type MaskReveal = {
  mask: HTMLElement
  line: HTMLElement
  width: number
  marginLeft: number
  marginRight: number
  paddingLeft: number
  delta: number
}

/** Soft start, even softer finish — asymmetric smootherstep. */
function maskEase(t: number) {
  const smoothed = t * t * t * (t * (t * 6 - 15) + 10)
  return 1 - Math.pow(1 - smoothed, 1.45)
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const creativeLabelRef = useRef<HTMLSpanElement>(null)
  const sinceLabelRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const spotlight = spotlightRef.current
    const title = titleRef.current
    const creativeLabel = creativeLabelRef.current
    const sinceLabel = sinceLabelRef.current
    if (!section || !spotlight || !title || !creativeLabel || !sinceLabel) return

    const words = title.querySelectorAll<HTMLElement>('[data-hero-el]')
    const masks = title.querySelectorAll<HTMLElement>('[data-hero-mask]')
    const labels = [creativeLabel, sinceLabel]

    // Grow each mask from its center while the line's padding absorbs half
    // the expansion, so neighboring words shift left and right equally.
    const reveals: MaskReveal[] = Array.from(masks).map((mask) => {
      const line = mask.closest<HTMLElement>('[data-hero-line]')
      if (!line) {
        throw new Error('Hero mask is missing its data-hero-line parent')
      }

      const styles = getComputedStyle(mask)
      const width = mask.offsetWidth
      const marginLeft = parseFloat(styles.marginLeft)
      const marginRight = parseFloat(styles.marginRight)
      const paddingLeft = parseFloat(getComputedStyle(line).paddingLeft)
      const delta = width + marginLeft + marginRight

      return { mask, line, width, marginLeft, marginRight, paddingLeft, delta }
    })

    gsap.set(words, {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(4px)',
    })

    reveals.forEach(({ mask, line, paddingLeft, delta }) => {
      gsap.set(mask, {
        width: 0,
        marginLeft: 0,
        marginRight: 0,
      })
      gsap.set(line, {
        paddingLeft: paddingLeft + delta / 2,
      })
    })

    gsap.set(spotlight, {
      xPercent: -50,
      yPercent: -50,
      x: section.clientWidth / 2,
      y: section.clientHeight / 2,
      opacity: 0,
    })

    gsap.set(labels, {
      clipPath: 'inset(0 100% 0 0)',
    })

    const xTo = gsap.quickTo(spotlight, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(spotlight, 'y', { duration: 0.35, ease: 'power3' })

    const onPointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      xTo(event.clientX - rect.left)
      yTo(event.clientY - rect.top)
    }

    const onPointerEnter = () => {
      gsap.to(spotlight, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    }

    const onPointerLeave = () => {
      gsap.to(spotlight, { opacity: 0, duration: 0.4, ease: 'power2.out' })
    }

    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerenter', onPointerEnter)
    section.addEventListener('pointerleave', onPointerLeave)

    let tl: gsap.core.Timeline | undefined

    const unsubscribe = onIntroComplete(() => {
      tl = gsap.timeline({ delay: HERO_INTRO_DELAY })

      tl.to(words, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power2.out',
        stagger: {
          each: 0.05,
          from: 'center',
        },
        clearProps: 'filter',
      })

      tl.to(
        sinceLabel,
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          ease: 'power3.inOut',
        },
        '>-0.8',
      )

      tl.to(
        creativeLabel,
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          ease: 'power3.inOut',
        },
        '>-0.6',
      )

      

      ;[...reveals].reverse().forEach(({ mask, line, width, marginLeft, marginRight, paddingLeft }, i) => {
        tl!.to(
          mask,
          {
            width,
            marginLeft,
            marginRight,
            duration: 1.4,
            ease: maskEase,
            clearProps: 'width,marginLeft,marginRight',
          },
          i === 0 ? '>-0.5' : '<0.3',
        )

        tl!.to(
          line,
          {
            paddingLeft,
            duration: 1.4,
            ease: maskEase,
            clearProps: 'paddingLeft',
          },
          '<',
        )
      })
    })

    return () => {
      unsubscribe()
      tl?.kill()
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerenter', onPointerEnter)
      section.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle,_#516B4C_0%,_#2B4625_100%)]"
    >
      <Image
        src="/images/hero/hero-background-shape.png"
        alt=""
        width={2200}
        height={1560}
        priority
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-0 h-auto w-auto max-w-none select-none"
      />
      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-[1] size-[520px] rounded-full bg-[#5b7d54]/40 blur-[100px] will-change-transform"
      />
      <div className="relative z-10 w-[977px]">
        <span
          ref={creativeLabelRef}
          className="pointer-events-none absolute top-[11px] right-[-78px] font-serif text-[21px] font-light uppercase leading-[97%] text-[#ABC337] will-change-[clip-path]"
        >
          Creative Developer
        </span>
        <span
          ref={sinceLabelRef}
          className="pointer-events-none absolute bottom-[14px] left-[-78px] font-serif text-[21px] font-light uppercase leading-[97%] text-[#ABC337] will-change-[clip-path]"
        >
          Since 2010
        </span>
        <h1
          ref={titleRef}
          className="font-serif text-[130px] font-normal uppercase leading-[91%] tracking-[-3px] text-white"
        >
          <span data-hero-line className="block pl-[88px]">
            <span data-hero-el className="inline-block">
              I
            </span>{' '}
            <span className="inline-block align-middle">
              <span
                data-hero-mask
                className="mx-3 flex h-[88px] w-[161px] -translate-x-[12px] -translate-y-[12px] items-center justify-center overflow-hidden rounded-[50px]"
              >
                <Image
                  src="/images/hero/hero-img-heading-01.jpg"
                  alt=""
                  width={161}
                  height={88}
                  aria-hidden
                  className="h-[88px] w-[161px] max-w-none shrink-0 object-cover"
                />
              </span>
            </span>
            <span data-hero-el className="inline-block">
              don&apos;t
            </span>
          </span>

          <span data-hero-line className="block pl-[160px]">
            <span data-hero-el className="inline-block">
              promise
            </span>{' '}
            <span className="inline-block align-middle">
              <span
                data-hero-mask
                className="mx-3 flex h-[88px] w-[161px] -translate-x-[12px] -translate-y-[12px] items-center justify-center overflow-hidden rounded-[50px]"
              >
                <Image
                  src="/images/hero/hero-img-heading-02.jpg"
                  alt=""
                  width={161}
                  height={88}
                  aria-hidden
                  className="h-[88px] w-[161px] max-w-none shrink-0 object-cover"
                />
              </span>
            </span>
          </span>

          <span className="block">
            <span data-hero-el className="inline-block">
              pixel
            </span>{' '}
            <span data-hero-el className="inline-block">
              perfect.
            </span>
          </span>

          <span className="block pl-[130px]">
            <span data-hero-el className="inline-block">
              I
            </span>{' '}
            <span data-hero-el className="inline-block">
              deliver
            </span>{' '}
            <span data-hero-el className="inline-block">
              it.
            </span>
          </span>
        </h1>
      </div>
    </section>
  )
}
