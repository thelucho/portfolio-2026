'use client'

import Image from 'next/image'
import Link from 'next/link'

const PHRASE =
  "I craft tailor-made web experiences where every detail earns its place — thoughtful motion, lasting craft, and interfaces that feel alive."

const WORDS = PHRASE.split(' ')

export default function Manifesto() {
  return (
    <div className="relative flex max-w-[min(1100px,calc(100vw-3rem))] flex-col items-center px-6 md:px-10">
      <p
        data-manifesto-bg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none text-center font-serif text-[320px] font-normal leading-[300px] tracking-[-20px] text-[#516B4C]/9 will-change-[opacity]"
      >
        CREATIVE
        <br />
        DEVELOPER
      </p>

      <Image
        src="/images/manifesto/leaf-01.webp"
        alt=""
        width={160}
        height={160}
        data-leaf="start"
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-10 z-10 w-[clamp(3.5rem,9vw,7rem)] translate-x-[20px] select-none will-change-[opacity] md:-left-6 md:-top-14"
      />

      <p
        className="relative z-10 text-center font-serif text-[clamp(1.75rem,4.2vw,4.5rem)] font-normal leading-[1.28] tracking-[-0.03em] text-[#2B4625]"
        aria-label="Manifesto"
      >
        {WORDS.map((word, index) => (
          <span
            key={`${word}-${index}`}
            data-word
            className="mr-[0.28em] inline-block last:mr-0"
          >
            {word}
          </span>
        ))}
      </p>

      <Link
        href="/about"
        data-manifesto-cta
        className="view-case-link relative z-10 mt-8 inline-flex w-fit items-center gap-2.5 font-sans sm:mt-10"
      >
        About me
        <span aria-hidden className="view-case-arrow text-lg leading-none">
          <span className="view-case-arrow-icon">↗</span>
          <span className="view-case-arrow-icon">↗</span>
        </span>
        <span aria-hidden className="view-case-underline" />
      </Link>

      <Image
        src="/images/manifesto/leaf-02.webp"
        alt=""
        width={160}
        height={160}
        data-leaf="end"
        aria-hidden
        className="pointer-events-none absolute -bottom-30 -right-2 z-10 w-[clamp(3.5rem,9vw,7rem)] -translate-x-[25px] -translate-y-[24px] select-none will-change-[opacity] md:-bottom-14 md:-right-6"
      />
    </div>
  )
}
