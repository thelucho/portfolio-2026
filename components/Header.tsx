'use client'

import { useRef } from 'react'
import { useLenis } from 'lenis/react'

import Logo from '@/components/header/Logo'
import Navbar from '@/components/header/Navbar'
import LocationClock from '@/components/header/LocationClock'

const sideRuleClassName =
  'pointer-events-none absolute top-1/2 h-px w-[max(0px,calc((100%-min(100%,var(--container-max)))/2-20px))] -translate-y-1/2 bg-[var(--header-rule)] transition-[background-color] duration-500 ease-out'

export default function Header() {
  const outerRef = useRef<HTMLDivElement>(null)

  useLenis(({ scroll }) => {
    const el = outerRef.current
    if (!el) return
    const scrolled = scroll > 8
    el.classList.toggle('scrolled-down', scrolled)
    el.classList.toggle('at-top', !scrolled)
  })

  return (
    <div id="header-outer" ref={outerRef} className="fixed inset-x-0 top-0 z-50 at-top">
      <div className="header-outer__gradient-blur-wrapper" aria-hidden>
        <div className="header-outer__gradient-blur" />
        <div className="header-outer__gradient-blur" />
        <div className="header-outer__gradient-blur" />
        <div className="header-outer__gradient-blur" />
        <div className="header-outer__gradient-blur" />
      </div>

      <header className="pointer-events-none relative z-10 bg-transparent">
        <div aria-hidden className={`${sideRuleClassName} left-0`} />
        <div aria-hidden className={`${sideRuleClassName} right-0`} />

        <div className="site-container pointer-events-auto grid grid-cols-[1fr_auto_1fr] items-center py-6">
          <div className="justify-self-start">
            <Logo />
          </div>

          <div className="justify-self-center">
            <Navbar />
          </div>

          <div className="justify-self-end">
            <LocationClock />
          </div>
        </div>
      </header>
    </div>
  )
}
