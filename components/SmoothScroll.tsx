'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'

gsap.registerPlugin(ScrollTrigger)

// iOS Chrome/Safari hide the URL bar on swipe, which fires a vertical-only
// resize. Refreshing pins mid-gesture makes pinned copy jump up then snap back.
ScrollTrigger.config({ ignoreMobileResize: true })

type SmoothScrollProps = {
  children: React.ReactNode
}

function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update()
  })

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    refresh()
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return null
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const scrollToTop = () => {
      window.scrollTo(0, 0)
      lenisRef.current?.lenis?.scrollTo(0, { immediate: true })
    }

    scrollToTop()
    // Lenis may finish init one frame later than this effect.
    const rafId = requestAnimationFrame(scrollToTop)

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false,
        lerp: 0.085,
        duration: 1.35,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1,
        overscroll: false,
      }}
    >
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}
