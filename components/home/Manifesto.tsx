'use client'

const PHRASE =
  "I craft tailor-made web experiences where every detail earns its place — thoughtful motion, lasting craft, and interfaces that feel alive."

const WORDS = PHRASE.split(' ')

export default function Manifesto() {
  return (
    <p
      className="max-w-[min(1100px,calc(100vw-3rem))] px-6 text-center font-serif text-[clamp(1.75rem,4.2vw,4.5rem)] font-normal leading-[1.28] tracking-[-0.03em] text-[#2B4625] md:px-10"
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
  )
}
