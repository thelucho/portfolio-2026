import gsap from 'gsap'

type Point = { x: number; y: number }

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

const distance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.hypot(x2 - x1, y2 - y1)

type TrailImage = {
  el: HTMLElement
  inner: HTMLElement | null
  rect: DOMRect
  timeline: gsap.core.Timeline | null
}

/**
 * Codrops Motion Trail demo 2 — scoped to a container with pointer-relative coords.
 * @see https://github.com/codrops/MotionTrailAnimations (index2 / demo2)
 */
export class ImageTrail {
  private container: HTMLElement
  private images: TrailImage[] = []
  private imagesTotal = 0
  private imgPosition = 0
  private zIndexVal = 1
  private activeImagesCount = 0
  private isIdle = true
  private threshold = 80
  private mousePos: Point = { x: 0, y: 0 }
  private lastMousePos: Point = { x: 0, y: 0 }
  private cacheMousePos: Point = { x: 0, y: 0 }
  private rafId = 0
  private running = false
  private onResize: () => void

  constructor(container: HTMLElement) {
    this.container = container
    this.images = [...container.querySelectorAll<HTMLElement>('[data-trail-img]')].map(
      (el) => {
        const inner = el.querySelector<HTMLElement>('[data-trail-img-inner]')
        return {
          el,
          inner,
          rect: el.getBoundingClientRect(),
          timeline: null,
        }
      },
    )
    this.imagesTotal = this.images.length

    this.onResize = () => {
      this.images.forEach((img) => {
        gsap.set(img.el, { scale: 1, x: 0, y: 0, opacity: 0 })
        img.rect = img.el.getBoundingClientRect()
      })
    }
    window.addEventListener('resize', this.onResize)
  }

  /** Pointer position relative to the trail container. */
  setPointer(x: number, y: number) {
    this.mousePos = { x, y }
    if (!this.running) {
      this.cacheMousePos = { ...this.mousePos }
      this.lastMousePos = { ...this.mousePos }
      this.running = true
      this.rafId = requestAnimationFrame(() => this.render())
    }
  }

  stop() {
    this.running = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  destroy() {
    this.stop()
    window.removeEventListener('resize', this.onResize)
    this.images.forEach((img) => {
      img.timeline?.kill()
      gsap.killTweensOf(img.el)
      if (img.inner) gsap.killTweensOf(img.inner)
    })
  }

  private render() {
    if (!this.running) return

    const dist = distance(
      this.mousePos.x,
      this.mousePos.y,
      this.lastMousePos.x,
      this.lastMousePos.y,
    )

    this.cacheMousePos.x = lerp(
      this.cacheMousePos.x || this.mousePos.x,
      this.mousePos.x,
      0.1,
    )
    this.cacheMousePos.y = lerp(
      this.cacheMousePos.y || this.mousePos.y,
      this.mousePos.y,
      0.1,
    )

    if (dist > this.threshold) {
      this.showNextImage()
      this.lastMousePos = { ...this.mousePos }
    }

    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1
    }

    this.rafId = requestAnimationFrame(() => this.render())
  }

  private showNextImage() {
    ++this.zIndexVal
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0

    const img = this.images[this.imgPosition]
    if (!img) return

    gsap.killTweensOf(img.el)

    // Refresh size in case layout settled after mount.
    img.rect = img.el.getBoundingClientRect()

    img.timeline = gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated(),
    })

    img.timeline.fromTo(
      img.el,
      {
        opacity: 1,
        scale: 0,
        zIndex: this.zIndexVal,
        x: this.cacheMousePos.x - img.rect.width / 2,
        y: this.cacheMousePos.y - img.rect.height / 2,
      },
      {
        duration: 0.4,
        ease: 'power1',
        scale: 1,
        x: this.mousePos.x - img.rect.width / 2,
        y: this.mousePos.y - img.rect.height / 2,
      },
      0,
    )

    if (img.inner) {
      img.timeline.fromTo(
        img.inner,
        {
          scale: 2.8,
          filter: 'brightness(250%)',
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          filter: 'brightness(100%)',
        },
        0,
      )
    }

    img.timeline.to(
      img.el,
      {
        duration: 0.4,
        ease: 'power2',
        opacity: 0,
        scale: 0.2,
      },
      0.45,
    )
  }

  private onImageActivated() {
    this.activeImagesCount++
    this.isIdle = false
  }

  private onImageDeactivated() {
    this.activeImagesCount--
    if (this.activeImagesCount === 0) {
      this.isIdle = true
    }
  }
}
