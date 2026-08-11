'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'

import { NAV_ITEMS } from '@/lib/navigation'
import { isPageTransitioning } from '@/lib/page-transition'

gsap.registerPlugin(useGSAP)

function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

const itemClassName =
  'relative inline-flex items-center font-sans text-xl font-light tracking-wide text-[#FDFDEA] transition-opacity duration-300 ease-out hover:opacity-70'

/**
 * Mobile-only navigation: two-line hamburger + full-viewport overlay with
 * staggered item intro/outro. Hidden from `md` and up.
 */
export default function MobileMenu() {
  const pathname = usePathname()
  const lenis = useLenis()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const openRef = useRef(false)
  const animatingRef = useRef(false)
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  useEffect(() => {
    setMounted(true)
  }, [])

  const { contextSafe } = useGSAP(
    () => {
      const panel = panelRef.current
      if (!panel) return
      gsap.set(panel, { autoAlpha: 0 })
    },
    { dependencies: [mounted] },
  )

  const unlock = () => {
    openRef.current = false
    setOpen(false)
    animatingRef.current = false
    if (!isPageTransitioning()) {
      lenisRef.current?.start()
    }
    document.documentElement.removeAttribute('data-mobile-menu')
  }

  const playOpen = contextSafe(() => {
    const panel = panelRef.current
    const list = listRef.current
    if (!panel || !list || animatingRef.current || openRef.current) return

    const items = list.querySelectorAll<HTMLElement>('[data-mobile-nav-item]')
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    animatingRef.current = true
    openRef.current = true
    setOpen(true)
    lenisRef.current?.stop()
    document.documentElement.setAttribute('data-mobile-menu', 'open')

    gsap.killTweensOf([panel, items])

    if (reduceMotion) {
      gsap.set(panel, { autoAlpha: 1 })
      gsap.set(items, { autoAlpha: 1, y: 0 })
      animatingRef.current = false
      return
    }

    gsap.set(items, { autoAlpha: 0, y: 28 })

    gsap
      .timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          animatingRef.current = false
        },
      })
      .to(panel, { autoAlpha: 1, duration: 0.4 })
      .to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
        },
        '-=0.18',
      )
  })

  const playClose = contextSafe(() => {
    const panel = panelRef.current
    const list = listRef.current
    if (!panel || !list || !openRef.current) return

    const items = list.querySelectorAll<HTMLElement>('[data-mobile-nav-item]')
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // Flip the toggle icon back immediately; panel outro continues below.
    setOpen(false)
    animatingRef.current = true
    gsap.killTweensOf([panel, items])

    if (reduceMotion) {
      gsap.set(panel, { autoAlpha: 0 })
      gsap.set(items, { autoAlpha: 0, y: 0 })
      unlock()
      return
    }

    gsap
      .timeline({
        defaults: { ease: 'power2.in' },
        onComplete: unlock,
      })
      .to(items, {
        autoAlpha: 0,
        y: -16,
        duration: 0.28,
        stagger: 0.05,
      })
      .to(
        panel,
        {
          autoAlpha: 0,
          duration: 0.35,
          ease: 'power2.out',
        },
        '-=0.08',
      )
  })

  const toggle = contextSafe(() => {
    if (openRef.current) playClose()
    else if (!animatingRef.current) playOpen()
  })

  // Close when the route changes after a client navigation.
  const pathnameRef = useRef(pathname)
  useEffect(() => {
    if (pathnameRef.current === pathname) return
    pathnameRef.current = pathname
    if (openRef.current) playClose()
  }, [pathname, playClose])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') playClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, playClose])

  // Desktop breakpoint: force-close if the viewport grows past mobile.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (!mq.matches || !openRef.current) return
      gsap.killTweensOf(panelRef.current)
      const list = listRef.current
      if (list) {
        gsap.killTweensOf(
          list.querySelectorAll<HTMLElement>('[data-mobile-nav-item]'),
        )
      }
      if (panelRef.current) gsap.set(panelRef.current, { autoAlpha: 0 })
      unlock()
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute('data-mobile-menu')
      lenisRef.current?.start()
    }
  }, [])

  const panel =
    mounted &&
    createPortal(
      <div
        ref={panelRef}
        id="mobile-nav-panel"
        className="fixed inset-0 z-40 flex h-dvh w-full flex-col items-center justify-center bg-[var(--palette-forest)] md:hidden"
        aria-hidden={!open}
        {...(!open ? { inert: true } : {})}
      >
        <nav aria-label="Mobile primary" className="w-full px-8">
          <ul
            ref={listRef}
            className="flex flex-col items-center gap-7 text-center"
          >
            {NAV_ITEMS.map((item) => {
              const active = !item.soon && isNavActive(pathname, item.href)

              return (
                <li key={item.href} data-mobile-nav-item>
                  {item.soon ? (
                    <span
                      data-cursor="soon"
                      aria-disabled="true"
                      aria-label={`${item.label} (soon)`}
                      className={itemClassName}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 -left-2.5 -right-2.5 h-[2px] -translate-y-1/2 bg-[#ABC337]"
                      />
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={itemClassName}
                      onClick={(event) => {
                        if (isNavActive(pathname, item.href)) {
                          event.preventDefault()
                        }
                        playClose()
                      }}
                    >
                      {item.label}
                      {active ? (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute right-0 bottom-0 h-px w-[18px] bg-[#929c3b]"
                        />
                      ) : null}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>,
      document.body,
    )

  return (
    <>
      <button
        type="button"
        className="mobile-nav-toggle md:hidden"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={toggle}
      >
        <span className="mobile-nav-toggle__line mobile-nav-toggle__line--long" />
        <span className="mobile-nav-toggle__line mobile-nav-toggle__line--short" />
      </button>
      {panel}
    </>
  )
}
