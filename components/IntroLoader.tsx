'use client'

import Intro from '@/components/Intro'

/**
 * Thin client boundary so the Intro overlay can sit in the root layout.
 * Imported eagerly (not dynamic/ssr:false) so the green cover is in the first paint.
 */
export default function IntroLoader() {
  return <Intro />
}
