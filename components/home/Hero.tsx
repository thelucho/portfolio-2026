'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { HERO_INTRO_DELAY, onIntroComplete } from '@/lib/intro'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const title = titleRef.current
    if (!title) return

    const elements = title.querySelectorAll<HTMLElement>('[data-hero-el]')

    gsap.set(elements, {
      autoAlpha: 0,
      y: 40,
    })

    let tl: gsap.core.Timeline | undefined

    const unsubscribe = onIntroComplete(() => {
      tl = gsap.timeline({
        delay: HERO_INTRO_DELAY,
        defaults: { ease: 'expo.out' },
      })

      tl.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: {
          each: 0.06,
          from: 'start',
        },
      })
    })

    return () => {
      unsubscribe()
      tl?.kill()
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
      <h1
        ref={titleRef}
        className="relative z-10 w-[977px] font-serif text-[130px] font-normal uppercase leading-[91%] tracking-[-3px] text-white"
      >
        <span className="block pl-[88px]">
          <span data-hero-el className="inline-block">
            I
          </span>{' '}
          <span data-hero-el className="mx-3 inline-block align-middle">
            <span className="block h-[88px] w-[161px] -translate-x-[12px] -translate-y-[12px] overflow-hidden rounded-[50px]">
              <Image
                src="/images/hero/hero-img-heading-01.jpg"
                alt=""
                width={161}
                height={88}
                aria-hidden
                className="h-full w-full object-cover"
              />
            </span>
          </span>
          <span data-hero-el className="inline-block">
            don&apos;t
          </span>
        </span>

        <span className="block pl-[160px]">
          <span data-hero-el className="inline-block">
            promise
          </span>{' '}
          <span data-hero-el className="mx-3 inline-block align-middle">
            <span className="block h-[88px] w-[161px] -translate-x-[12px] -translate-y-[12px] overflow-hidden rounded-[50px]">
              <Image
                src="/images/hero/hero-img-heading-02.jpg"
                alt=""
                width={161}
                height={88}
                aria-hidden
                className="h-full w-full object-cover"
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
    </section>
  )
}
