export const INTRO_COMPLETE_EVENT = 'intro:complete'

/**
 * Delay (seconds) before the Hero entrance starts after the intro signals ready.
 * Intro signals when the overlay panel begins fading out.
 * - 0   → Hero starts with the panel fade
 * - 0.5 → halfway through the panel fade
 * - 1   → after the panel is fully gone
 */
export const HERO_INTRO_DELAY = 0.3

let introHasCompleted = false

export function signalIntroComplete() {
  introHasCompleted = true
  window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT))
}

export function hasIntroCompleted() {
  return introHasCompleted
}

export function onIntroComplete(callback: () => void) {
  if (introHasCompleted) {
    callback()
    return () => {}
  }

  const handler = () => callback()
  window.addEventListener(INTRO_COMPLETE_EVENT, handler)
  return () => window.removeEventListener(INTRO_COMPLETE_EVENT, handler)
}
