'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const HOVER_DURATION = 0.35
const HOVER_EASE = 'power2.out'
const INTERACTIVE_SELECTOR = 'a, button, [role="button"]'
const VIEW_SELECTOR = '[data-cursor="view"]'
const STATEMENT_SELECTOR = '[data-statement]'

type CursorMode = 'default' | 'interactive' | 'view' | 'statement'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const viewCircleRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<SVGSVGElement>(null)
  const expandRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    const viewCircle = viewCircleRef.current
    const dot = dotRef.current
    const arrow = arrowRef.current
    const expand = expandRef.current
    if (!cursor || !ring || !viewCircle || !dot || !arrow || !expand) return

    const finePointer = window.matchMedia('(pointer: fine)')
    if (!finePointer.matches) return

    document.documentElement.classList.add('has-custom-cursor')

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      opacity: 0,
    })
    gsap.set(ring, { scale: 0, opacity: 0 })
    gsap.set(viewCircle, { scale: 0, opacity: 0 })
    gsap.set(dot, { scale: 1, opacity: 1 })
    gsap.set(arrow, { scale: 0, opacity: 0 })
    gsap.set(expand, { scale: 0, opacity: 0 })

    let mode: CursorMode = 'default'
    let visible = false

    const setMode = (next: CursorMode) => {
      if (next === mode) return
      mode = next

      const isView = next === 'view'
      const isStatement = next === 'statement'
      const isInteractive = next === 'interactive'
      const hideDot = isView || isStatement

      gsap.to(ring, {
        scale: isInteractive ? 1 : 0,
        opacity: isInteractive ? 1 : 0,
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
        overwrite: 'auto',
      })

      gsap.to(viewCircle, {
        scale: isView ? 1 : 0,
        opacity: isView ? 1 : 0,
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
        overwrite: 'auto',
      })

      gsap.to(dot, {
        scale: hideDot ? 0 : 1,
        opacity: hideDot ? 0 : 1,
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
        overwrite: 'auto',
      })

      gsap.to(arrow, {
        scale: isView ? 1 : 0,
        opacity: isView ? 1 : 0,
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
        overwrite: 'auto',
      })

      gsap.to(expand, {
        scale: isStatement ? 1 : 0,
        opacity: isStatement ? 1 : 0,
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
        overwrite: 'auto',
      })
    }

    const resolveMode = (target: EventTarget | null): CursorMode => {
      if (!(target instanceof Element)) return 'default'
      if (target.closest(VIEW_SELECTOR)) return 'view'
      if (target.closest(INTERACTIVE_SELECTOR)) return 'interactive'
      if (target.closest(STATEMENT_SELECTOR)) return 'statement'
      return 'default'
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true
        gsap.to(cursor, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      }

      gsap.set(cursor, { x: event.clientX, y: event.clientY })
      setMode(resolveMode(event.target))
    }

    const onPointerLeave = () => {
      visible = false
      gsap.to(cursor, { opacity: 0, duration: 0.3, ease: 'power2.out' })
      setMode('default')
    }

    window.addEventListener('pointermove', onPointerMove)
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden items-center justify-center [@media(pointer:fine)]:flex"
    >
      <div
        ref={ringRef}
        className="absolute size-[56px] rounded-full border border-[rgba(171,195,55,0.69)]"
      />
      <div ref={viewCircleRef} className="absolute size-[77px] rounded-full bg-[#ABC337]" />
      <div ref={dotRef} className="size-2.5 rounded-full bg-[#ABC337]" />
      <svg
        ref={arrowRef}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
      >
        <path
          d="M0.707153 23L22.7072 1M22.7072 23V1H0.707153"
          stroke="#2B4625"
          strokeWidth="2"
        />
      </svg>
      <svg
        ref={expandRef}
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
      >
        <path
          d="M10.1421 10.1421L1 1M1 7.09476L1 1L7.09476 1M19.3336 19.3334L28.4758 28.4755M28.4758 22.3807L28.4758 28.4755H22.381M10.1421 19.3334L1 28.4755M1 22.3807L1 28.4755H7.09476M19.3336 10.1421L28.4758 1M28.4758 7.09476L28.4758 1L22.381 1"
          stroke="#ABC337"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
