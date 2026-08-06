export const PAGE_HERO_ENTER_EVENT = 'page-hero:enter-complete'

let pageHeroHasEntered = false

export function signalPageHeroEnterComplete() {
  pageHeroHasEntered = true
  window.dispatchEvent(new Event(PAGE_HERO_ENTER_EVENT))
}

export function hasPageHeroEntered() {
  return pageHeroHasEntered
}

/** Reset between client navigations so each page can replay its entrance. */
export function resetPageHeroEnter() {
  pageHeroHasEntered = false
}

export function onPageHeroEnterComplete(callback: () => void) {
  if (pageHeroHasEntered) {
    callback()
    return () => {}
  }

  const handler = () => callback()
  window.addEventListener(PAGE_HERO_ENTER_EVENT, handler)
  return () => window.removeEventListener(PAGE_HERO_ENTER_EVENT, handler)
}
