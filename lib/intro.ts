export const INTRO_COMPLETE_EVENT = 'intro:complete'

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
