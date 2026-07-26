'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const HOVER_DURATION = 0.3
const HOVER_EASE = 'power2.out'
const INTERACTIVE_SELECTOR = 'a, button, [role="button"]'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return

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

    let hovering = false
    let visible = false

    const setHover = (active: boolean) => {
      if (active === hovering) return
      hovering = active

      gsap.to(ring, {
        scale: active ? 1 : 0,
        opacity: active ? 1 : 0,
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
        overwrite: 'auto',
      })
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true
        gsap.to(cursor, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      }

      gsap.set(cursor, { x: event.clientX, y: event.clientY })

      const target = event.target
      if (!(target instanceof Element)) {
        setHover(false)
        return
      }

      setHover(Boolean(target.closest(INTERACTIVE_SELECTOR)))
    }

    const onPointerLeave = () => {
      visible = false
      gsap.to(cursor, { opacity: 0, duration: 0.3, ease: 'power2.out' })
      setHover(false)
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
      <div className="size-2.5 rounded-full bg-[#ABC337]" />
    </div>
  )
}
