'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { signalIntroComplete } from '@/lib/intro'
import NoiseLayer from '@/components/NoiseLayer'

gsap.registerPlugin(SplitText)

export default function Intro() {
    const containerRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const logoTextRef = useRef<HTMLSpanElement>(null)
    const subLogoTextRef = useRef<HTMLSpanElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const [done, setDone] = useState(false)

    useLayoutEffect(() => {
        // Prefer the SSR `data-intro-pending` flag over inline overflow styles —
        // mutating style on <html>/<body> before hydrate caused a mismatch warning.
        const unlockScroll = () => {
            document.documentElement.removeAttribute('data-intro-pending')
        }

        const logoText = logoTextRef.current
        if (!logoText) return

        const split = SplitText.create(logoText, { type: 'chars', mask: 'chars' })

        // Serif glyphs (esp. trailing "O") overhang their boxes; expand the
        // overflow:clip masks without changing letter spacing.
        gsap.set(split.masks, {
            paddingInline: '0.12em',
            marginInline: '-0.12em',
        })

        gsap.set(split.chars, {
            opacity: 0,
            y: () => gsap.utils.random(-50, 50),
            //rotation: () => gsap.utils.random(-20, 20),
        })
        gsap.set(logoText, { opacity: 1 })

        gsap.set(subLogoTextRef.current, {
            clipPath: 'inset(0 100% 0 0)',
        })

        const tl = gsap.timeline({
            onComplete: () => {
                setDone(true)
            }
        })

        tl.to(split.chars, {
            delay: 0.4,
            opacity: 1,
            y: 0,
            //rotation: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: {
                from: 'random',
                amount: 0.3,
            },
        })
        .to(subLogoTextRef.current, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.inOut',
        }, '-=0.8')
        .to(logoRef.current, {
            duration: 0.6,
        })
        .to(logoRef.current, {
            opacity: 0,
            scale: 1.1,
            duration: 0.5,
            ease: 'power2.in'
        })
        .to(subLogoTextRef.current, {
            clipPath: 'inset(0 0 0 100%)', // It "closes" from the left
            duration: 0.4,
            ease: 'power2.in',
        }, '<')
        .fromTo(panelRef.current,
            { opacity: 1, scale: 1 },
            {
                opacity: 0,
                scale: 1.03,
                duration: 1,
                ease: 'power2.inOut',
                onStart: () => {
                    unlockScroll()
                    signalIntroComplete()
                },
            },
            '-=0.2'
        )

        return () => {
            tl.kill()
            split.revert()
            split.kill()
            unlockScroll()
        }

    }, [])

    if (done) return null

    return (
        <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none">
          <div
            ref={panelRef}
            className="absolute inset-0 bg-[#2B4625] origin-center will-change-[opacity,transform]"
          >
            <NoiseLayer />
          </div>

          <div
            ref={logoRef}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center">
            <span
              ref={logoTextRef}
              className="font-serif text-[50px] font-bold text-white uppercase tracking-tighter mb-2 opacity-0"
            >
              Thelucho
            </span>
            <span
              ref={subLogoTextRef}
              className="text-xs text-white tracking-[8px] uppercase inline-block opacity-100 will-change-[clip-path]"
              style={{ clipPath: 'inset(0 100% 0 0)' }}
            >
              Creative Developer
            </span>
            </div>
            
          </div>
        </div>
    )

}