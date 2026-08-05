'use client'

import Image from 'next/image'
import Link from 'next/link'

const PHRASE =
  "I craft tailor-made web experiences where every detail earns its place — thoughtful motion, lasting craft, and interfaces that feel alive."

const WORDS = PHRASE.split(' ')

export default function Manifesto() {
  return (
    <div className="manifesto relative flex max-w-[min(1100px,calc(100vw-3rem))] flex-col items-center px-6 md:px-10">
      <p
        data-manifesto-bg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none text-center font-serif text-[length:var(--manifesto-bg-size)] font-normal leading-[var(--manifesto-bg-leading)] tracking-[var(--manifesto-bg-tracking)] text-[#516B4C]/9 will-change-[opacity]"
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
        className="pointer-events-none absolute top-[var(--manifesto-leaf-start-top)] left-[var(--manifesto-leaf-start-left)] z-10 w-[var(--manifesto-leaf-w)] select-none will-change-[opacity]"
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
        className="pointer-events-none absolute right-[var(--manifesto-leaf-end-right)] bottom-[var(--manifesto-leaf-end-bottom)] z-10 w-[var(--manifesto-leaf-w)] select-none will-change-[opacity]"
      />
    </div>
  )
}
