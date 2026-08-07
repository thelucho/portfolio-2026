/**
 * Detect closest vertical edge (top / bottom) from a point inside a box.
 * Adapted from John Stewart / Codrops MarqueeMenu.
 * @see https://github.com/codrops/MarqueeMenu
 */

function distMetric(x: number, y: number, x2: number, y2: number): number {
  const xDiff = x - x2
  const yDiff = y - y2
  return xDiff * xDiff + yDiff * yDiff
}

export function closestEdge(
  x: number,
  y: number,
  w: number,
  h: number,
): 'top' | 'bottom' {
  const topEdgeDist = distMetric(x, y, w / 2, 0)
  const bottomEdgeDist = distMetric(x, y, w / 2, h)
  return topEdgeDist <= bottomEdgeDist ? 'top' : 'bottom'
}

type PointerLike = Pick<MouseEvent, 'clientX' | 'clientY'>

/** Closest edge from a pointer event relative to an element's bounding box. */
export function closestEdgeFromEvent(
  ev: PointerLike,
  el: HTMLElement,
): 'top' | 'bottom' {
  const rect = el.getBoundingClientRect()
  const x = ev.clientX - rect.left
  const y = ev.clientY - rect.top
  return closestEdge(x, y, rect.width, rect.height)
}
