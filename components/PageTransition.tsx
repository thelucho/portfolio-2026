'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'
import AsteriskMark from '@/components/AsteriskMark'
import { hasIntroCompleted } from '@/lib/intro'
import {
  beginPageTransition,
  getPendingTransitionHref,
  isPageTransitioning,
  normalizePathname,
  signalPageTransitionComplete,
  signalPageTransitionCovered,
  signalPageTransitionReveal,
} from '@/lib/page-transition'

gsap.registerPlugin(useGSAP)

const COVER_DURATION = 0.65
const REVEAL_DURATION = 0.7
const MARK_IN_DURATION = 0.4
const MARK_OUT_DURATION = 0.25
const MIN_HOLD_MS = 300
const SPIN_DURATION = 6.5

function resolveInternalHref(anchor: HTMLAnchorElement): string | null {
  if (anchor.target && anchor.target !== '_self') return null
  if (anchor.hasAttribute('download')) return null
  if (anchor.dataset.noTransition !== undefined) return null

  const raw = anchor.getAttribute('href')
  if (!raw || raw.startsWith('#')) return null
  if (
    raw.startsWith('mailto:') ||
    raw.startsWith('tel:') ||
    raw.startsWith('javascript:')
  ) {
    return null
  }

  let url: URL
  try {
    url = new URL(raw, window.location.href)
  } catch {
    return null
  }

  if (url.origin !== window.location.origin) return null

  const next = normalizePathname(url.pathname)
  const current = normalizePathname(window.location.pathname)
  if (next === current) return null

  return `${next}${url.search}${url.hash}`
}

/**
 * Full-bleed forest curtain for client-side navigations.
 * First load / reload keeps using Intro; this overlay stays idle until then.
 */
export default function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const lenis = useLenis()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<SVGSVGElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const spinRef = useRef<gsap.core.Tween | null>(null)
  const phaseRef = useRef<'idle' | 'covering' | 'covered' | 'revealing'>('idle')
  const coveredAtRef = useRef(0)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  const { contextSafe } = useGSAP(() => {
    const panel = panelRef.current
    const mark = markRef.current
    const label = labelRef.current
    if (!panel || !mark || !label) return

    gsap.set(panel, { yPercent: -100 })
    gsap.set(mark, {
      opacity: 0,
      scale: 0.85,
      transformOrigin: '50% 50%',
    })
    gsap.set(label, { opacity: 0, y: 10 })
  }, [])

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const killSpin = () => {
    spinRef.current?.kill()
    spinRef.current = null
    if (markRef.current) {
      gsap.set(markRef.current, { rotation: 0 })
    }
  }

  const lockScroll = () => {
    document.documentElement.setAttribute('data-page-transitioning', '')
    lenisRef.current?.stop()
  }

  const unlockScroll = () => {
    document.documentElement.removeAttribute('data-page-transitioning')
    lenisRef.current?.start()
  }

  const scrollToTop = () => {
    window.scrollTo(0, 0)
    lenisRef.current?.scrollTo(0, { immediate: true })
  }

  const runReveal = contextSafe(() => {
    if (phaseRef.current !== 'covered') return

    const panel = panelRef.current
    const mark = markRef.current
    const label = labelRef.current
    const root = rootRef.current
    if (!panel || !mark || !label || !root) return

    phaseRef.current = 'revealing'
    clearHoldTimer()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      signalPageTransitionReveal()
      killSpin()
      gsap.set(mark, { opacity: 0, scale: 0.85 })
      gsap.set(label, { opacity: 0, y: 10 })
      gsap.set(panel, { yPercent: -100 })
      root.style.pointerEvents = 'none'
      unlockScroll()
      phaseRef.current = 'idle'
      signalPageTransitionComplete()
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        killSpin()
        gsap.set(mark, { opacity: 0, scale: 0.85 })
        gsap.set(label, { opacity: 0, y: 10 })
        root.style.pointerEvents = 'none'
        unlockScroll()
        phaseRef.current = 'idle'
        signalPageTransitionComplete()
      },
    })

    tl.to(
      mark,
      {
        opacity: 0,
        scale: 0.9,
        duration: MARK_OUT_DURATION,
        ease: 'power2.in',
      },
      0,
    )

    tl.to(
      label,
      {
        opacity: 0,
        y: -6,
        duration: MARK_OUT_DURATION,
        ease: 'power2.in',
      },
      0,
    )

    tl.to(
      panel,
      {
        yPercent: -100,
        duration: REVEAL_DURATION,
        ease: 'power3.inOut',
        onStart: () => {
          signalPageTransitionReveal()
        },
      },
      0.05,
    )
  })

  const scheduleReveal = contextSafe(() => {
    if (phaseRef.current !== 'covered') return

    const elapsed = performance.now() - coveredAtRef.current
    const wait = Math.max(0, MIN_HOLD_MS - elapsed)

    clearHoldTimer()
    holdTimerRef.current = setTimeout(() => {
      holdTimerRef.current = null
      runReveal()
    }, wait)
  })

  const runCover = contextSafe((href: string) => {
    if (phaseRef.current !== 'idle' || isPageTransitioning()) return

    const panel = panelRef.current
    const mark = markRef.current
    const label = labelRef.current
    const root = rootRef.current
    if (!panel || !mark || !label || !root) return

    phaseRef.current = 'covering'
    beginPageTransition(href)
    lockScroll()
    root.style.pointerEvents = 'auto'

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const afterCover = () => {
      phaseRef.current = 'covered'
      coveredAtRef.current = performance.now()
      signalPageTransitionCovered()
      scrollToTop()
      router.push(href)
    }

    if (reducedMotion) {
      gsap.set(panel, { yPercent: 0 })
      gsap.set(mark, { opacity: 1, scale: 1 })
      gsap.set(label, { opacity: 1, y: 0 })
      afterCover()
      return
    }

    killSpin()
    gsap.set(mark, { opacity: 0, scale: 0.85, rotation: 0 })
    gsap.set(label, { opacity: 0, y: 10 })

    const tl = gsap.timeline({ onComplete: afterCover })

    tl.to(panel, {
      yPercent: 0,
      duration: COVER_DURATION,
      ease: 'power3.inOut',
    })

    tl.to(
      mark,
      {
        opacity: 1,
        scale: 1,
        duration: MARK_IN_DURATION,
        ease: 'power2.out',
      },
      '<0.15',
    )

    tl.to(
      label,
      {
        opacity: 1,
        y: 0,
        duration: MARK_IN_DURATION,
        ease: 'power2.out',
      },
      '<0.08',
    )

    tl.add(() => {
      spinRef.current = gsap.to(mark, {
        rotation: '+=360',
        duration: SPIN_DURATION,
        ease: 'none',
        repeat: -1,
      })
    }, '<')
  })

  const scheduleRevealRef = useRef(scheduleReveal)
  const runCoverRef = useRef(runCover)
  scheduleRevealRef.current = scheduleReveal
  runCoverRef.current = runCover

  // After cover + router.push, reveal once the new route is active.
  useEffect(() => {
    const pending = getPendingTransitionHref()
    if (!pending || phaseRef.current !== 'covered') return

    const pendingPath = normalizePathname(pending)
    const currentPath = normalizePathname(pathname)
    if (pendingPath !== currentPath) return

    scheduleRevealRef.current()
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (!hasIntroCompleted()) return

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const href = resolveInternalHref(anchor)
      if (!href) return

      if (isPageTransitioning() || phaseRef.current !== 'idle') {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      event.preventDefault()
      event.stopPropagation()
      runCoverRef.current(href)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    return () => {
      clearHoldTimer()
      killSpin()
      document.documentElement.removeAttribute('data-page-transitioning')
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[9000]"
      aria-hidden
    >
      <div
        ref={panelRef}
        className="absolute inset-0 flex items-center justify-center bg-[#2B4625] will-change-transform"
      >
        <div className="flex flex-col items-center gap-5 md:gap-6">
          <AsteriskMark
            ref={markRef}
            className="size-16 will-change-transform md:size-20"
            color="#ABC337"
          />
          <p
            ref={labelRef}
            className="font-sans text-[0.7rem] font-light uppercase tracking-[0.28em] text-[#FDFDEA]/85 will-change-[opacity,transform] md:text-xs md:tracking-[0.32em]"
          >
            Tuning the details
          </p>
        </div>
      </div>
    </div>
  )
}
