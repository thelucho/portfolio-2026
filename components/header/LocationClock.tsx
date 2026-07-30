'use client'

import { useEffect, useState } from 'react'
import { formatArgentinaTime } from '@/lib/time'

export default function LocationClock() {
  const [time, setTime] = useState(() => formatArgentinaTime())

  useEffect(() => {
    const tick = () => setTime(formatArgentinaTime())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-end text-right font-sans text-sm leading-snug text-[var(--header-fg)] transition-colors duration-500 ease-out">
      <p>
        <span className="font-light">Based in </span>
        <span className="font-medium">Argentina</span>
      </p>
      <p className="font-medium" suppressHydrationWarning>
        {time}
      </p>
    </div>
  )
}
