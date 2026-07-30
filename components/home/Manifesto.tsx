'use client'

import Image from 'next/image'

const PHRASE =
  "I craft tailor-made web experiences where every detail earns its place — thoughtful motion, lasting craft, and interfaces that feel alive."

const WORDS = PHRASE.split(' ')

export default function Manifesto() {
  return (
    <div className="relative max-w-[min(1100px,calc(100vw-3rem))] px-6 md:px-10">
      <Image
        src="/images/manifesto/leaf-02.webp"
        alt=""
        width={160}
        height={160}
        data-leaf="start"
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-10 w-[clamp(3.5rem,9vw,7rem)] select-none will-change-[opacity] md:-left-6 md:-top-14"
      />

      <p
        className="text-center font-serif text-[clamp(1.75rem,4.2vw,4.5rem)] font-normal leading-[1.28] tracking-[-0.03em] text-[#2B4625]"
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

      <Image
        src="/images/manifesto/leaf-01.webp"
        alt=""
        width={160}
        height={160}
        data-leaf="end"
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-2 w-[clamp(3.5rem,9vw,7rem)] select-none will-change-[opacity] md:-bottom-14 md:-right-6"
      />
    </div>
  )
}
