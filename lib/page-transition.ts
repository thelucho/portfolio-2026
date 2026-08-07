import { onIntroComplete } from '@/lib/intro'

export const PAGE_TRANSITION_COVERED_EVENT = 'page-transition:covered'
export const PAGE_TRANSITION_REVEAL_EVENT = 'page-transition:reveal'
export const PAGE_TRANSITION_COMPLETE_EVENT = 'page-transition:complete'

export type PageEntranceSource = 'intro' | 'transition'

let isTransitioning = false
/** While true, page entrance animations must wait for the curtain reveal. */
let blockEntrances = false
let pendingHref: string | null = null

export function isPageTransitioning() {
  return isTransitioning
}

export function getPendingTransitionHref() {
  return pendingHref
}

export function beginPageTransition(href: string) {
  isTransitioning = true
  blockEntrances = true
  pendingHref = href
}

export function signalPageTransitionCovered() {
  window.dispatchEvent(new Event(PAGE_TRANSITION_COVERED_EVENT))
}

export function signalPageTransitionReveal() {
  blockEntrances = false
  window.dispatchEvent(new Event(PAGE_TRANSITION_REVEAL_EVENT))
}

export function signalPageTransitionComplete() {
  isTransitioning = false
  pendingHref = null
  blockEntrances = false
  window.dispatchEvent(new Event(PAGE_TRANSITION_COMPLETE_EVENT))
}

export function onPageTransitionReveal(callback: () => void) {
  if (!blockEntrances) {
    callback()
    return () => {}
  }

  const handler = () => callback()
  window.addEventListener(PAGE_TRANSITION_REVEAL_EVENT, handler)
  return () => window.removeEventListener(PAGE_TRANSITION_REVEAL_EVENT, handler)
}

/**
 * Runs page entrance animations at the right moment:
 * - First load / reload → after Intro
 * - Client navigation → after the transition curtain starts revealing
 */
export function onPageEntranceReady(callback: (source: PageEntranceSource) => void) {
  let revealUnsub: (() => void) | undefined

  const introUnsub = onIntroComplete(() => {
    if (blockEntrances) {
      revealUnsub = onPageTransitionReveal(() => callback('transition'))
      return
    }
    callback('intro')
  })

  return () => {
    introUnsub()
    revealUnsub?.()
  }
}

/** Normalize a path for same-route comparisons (no trailing slash except root). */
export function normalizePathname(path: string) {
  const bare = path.split('?')[0]?.split('#')[0] ?? path
  if (bare.length > 1 && bare.endsWith('/')) return bare.slice(0, -1)
  return bare || '/'
}
