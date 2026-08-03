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
        document.body.style.overflow = 'hidden'

        const logoText = logoTextRef.current
        if (!logoText) return

        const split = SplitText.create(logoText, { type: 'chars', mask: 'chars' })

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
            clipPath: 'inset(0 0 0 100%)', // se "cierra" desde la izquierda al salir
            duration: 0.4,
            ease: 'power2.in',
        }, '<')
        .fromTo(panelRef.current,
            { opacity: 1, filter: 'blur(0px)', backdropFilter: 'blur(0px)' },
            {
                opacity: 0,
                filter: 'blur(24px)',
                backdropFilter: 'blur(24px)',
                duration: 1,
                ease: 'power2.inOut',
                onStart: () => {
                    document.body.style.overflow = ''
                    signalIntroComplete()
                },
            },
            '-=0.2'
        )

        return () => {
            tl.kill()
            split.revert()
            split.kill()
        }

    }, [])

    if (done) return null

    return (
        <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none">
          <div
            ref={panelRef}
            className="absolute inset-0 bg-[#2B4625] will-change-[opacity,filter]"
          >
            <NoiseLayer />
          </div>

          <div
            ref={logoRef}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="overflow-hidden inline-block">
            <div className="flex flex-col items-center justify-center">
            <span
              ref={logoTextRef}
              className="font-serif text-[50px] font-bold text-white uppercase tracking-tighter mb-2 opacity-0"
            >
              Thelucho
            </span>
            <span ref={subLogoTextRef} className="text-xs text-white tracking-[8px] uppercase inline-block opacity-100 will-change-[clip-path]">Creative Developer</span>
            </div>
            </div>
            
          </div>
        </div>
    )

}