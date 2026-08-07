'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SOCIAL_LINKS } from '@/lib/navigation'
import { onPageHeroEnterComplete } from '@/lib/page-hero'
import ContactForm from '@/components/contact/ContactForm'

gsap.registerPlugin(useGSAP)

const AVAILABILITY = [
  {
    title: 'Projects & collaborations',
    detail:
      'Landing pages, product UIs, and motion-led experiences built with care.',
  },
  {
    title: 'Agencies welcome',
    detail:
      "If you run an agency and need a reliable creative developer, let's talk.",
  },
  {
    title: 'Remote · Part-time or full-time',
    detail:
      'Open to remote roles — flexible part-time engagements or full-time commitment.',
  },
] as const

/**
 * Contact page body — intro copy, availability notes, and the Resend-backed form.
 */
export default function ContactContent() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      const intro = root.querySelectorAll<HTMLElement>('[data-contact-intro]')
      const notes = root.querySelectorAll<HTMLElement>('[data-contact-note]')
      const formBlock = root.querySelector<HTMLElement>('[data-contact-form]')

      if (!reducedMotion) {
        gsap.set(intro, { opacity: 0, y: 22 })
        gsap.set(notes, { opacity: 0, y: 18 })
        if (formBlock) gsap.set(formBlock, { opacity: 0, y: 28 })
      }

      const playEntrance = () => {
        if (reducedMotion) {
          gsap.set([...intro, ...notes, formBlock].filter(Boolean), {
            clearProps: 'all',
          })
          return
        }

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.to(intro, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
        })

        tl.to(
          notes,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
          },
          '-=0.25',
        )

        if (formBlock) {
          tl.to(
            formBlock,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
            },
            '-=0.3',
          )
        }
      }

      return onPageHeroEnterComplete(playEntrance)
    },
    { scope: rootRef },
  )

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16"
    >
      <div className="flex flex-col gap-10 md:gap-12 lg:col-span-5">
        <div className="flex flex-col gap-5">
          <p
            data-contact-intro
            className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[#2B4625]/55"
          >
            Start a conversation
          </p>
          <h2
            data-contact-intro
            className="max-w-[16ch] font-serif text-[clamp(2rem,4.2vw,3rem)] font-normal leading-[1.15] tracking-[-0.03em] text-[#2B4625]"
          >
            Tell me about what you&apos;re building
          </h2>
          <p
            data-contact-intro
            className="max-w-[42ch] font-sans text-base font-light leading-8 tracking-wide text-[#2B4625]/88 md:text-[1.0625rem]"
          >
            Whether it&apos;s a new product, a redesign with motion at the
            center, or a longer collaboration — share a few details and I&apos;ll
            follow up soon.
          </p>
        </div>

        <ul className="flex flex-col gap-7 border-t border-[#2B4625]/12 pt-8">
          {AVAILABILITY.map((item) => (
            <li key={item.title} data-contact-note className="max-w-[36ch]">
              <p className="font-sans text-base font-medium tracking-wide text-[#2B4625] md:text-lg">
                {item.title}
              </p>
              <p className="mt-1.5 font-sans text-sm font-light leading-6 tracking-wide text-[#2B4625]/60 md:text-[0.9375rem] md:leading-7">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>

        <div
          data-contact-note
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="view-case-link inline-flex w-fit items-center gap-2 font-sans"
            >
              {link.label}
              <span aria-hidden className="view-case-arrow text-lg leading-none">
                <span className="view-case-arrow-icon">↗</span>
                <span className="view-case-arrow-icon">↗</span>
              </span>
              <span aria-hidden className="view-case-underline" />
            </a>
          ))}
        </div>
      </div>

      <div
        data-contact-form
        className="lg:col-span-7 lg:border-l lg:border-[#2B4625]/12 lg:pl-12 xl:pl-16"
      >
        <div className="mb-8 flex flex-col gap-2 md:mb-10">
          <h3 className="font-serif text-[clamp(1.65rem,3vw,2.15rem)] font-normal leading-[1.2] tracking-[-0.03em] text-[#2B4625]">
            Send a message
          </h3>
          <p className="max-w-[40ch] font-sans text-sm font-light leading-6 tracking-wide text-[#2B4625]/65 md:text-[0.9375rem] md:leading-7">
            I usually reply within a couple of days. The more context you share,
            the better I can help.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
