'use client'

import { useEffect, useState, type ComponentType } from 'react'

/**
 * Loads the custom cursor chunk only on fine pointers (mouse / trackpad).
 * Touch devices skip the download entirely.
 */
export default function CustomCursorGate() {
  const [Cursor, setCursor] = useState<ComponentType | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    if (!media.matches) return

    let cancelled = false
    void import('@/components/CustomCursor').then((mod) => {
      if (!cancelled) setCursor(() => mod.default)
    })

    return () => {
      cancelled = true
    }
  }, [])

  if (!Cursor) return null
  return <Cursor />
}
