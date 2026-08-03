'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const HOVER_DURATION = 0.35
const HOVER_EASE = 'power2.out'
const INTERACTIVE_SELECTOR = 'a, button, [role="button"]'
const VIEW_SELECTOR = '[data-cursor="view"]'

type CursorMode = 'default' | 'interactive' | 'view'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const viewCircleRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    const viewCircle = viewCircleRef.current
    const dot = dotRef.current
    const arrow = arrowRef.current
    if (!cursor || !ring || !viewCircle || !dot || !arrow) return

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

    let mode: CursorMode = 'default'
    let visible = false

    const setMode = (next: CursorMode) => {
      if (next === mode) return
      mode = next

      const isView = next === 'view'
      const isInteractive = next === 'interactive'

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
        scale: isView ? 0 : 1,
        opacity: isView ? 0 : 1,
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
    }

    const resolveMode = (target: EventTarget | null): CursorMode => {
      if (!(target instanceof Element)) return 'default'
      if (target.closest(VIEW_SELECTOR)) return 'view'
      if (target.closest(INTERACTIVE_SELECTOR)) return 'interactive'
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
        className="absolute size-[50px] rounded-full border border-[rgba(171,195,55,0.69)]"
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
    </div>
  )
}
