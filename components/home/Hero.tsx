'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CustomEase } from 'gsap/CustomEase'
import { HERO_INTRO_DELAY, onIntroComplete } from '@/lib/intro'
import NoiseLayer from '@/components/NoiseLayer'

gsap.registerPlugin(CustomEase, useGSAP)

const maskEase = CustomEase.create('maskReveal', '0.77,0,0.175,1')
const labelEase = CustomEase.create('labelReveal', '0.86,0,0.07,1')
const hoverEase = 'power4.inOut' // inOutQuart

const MASK_OVERLAY_BG = 'lab(28 -15.82 15.92 / 0.56)'

type MaskReveal = {
  mask: HTMLElement
  line: HTMLElement
  width: number
  marginLeft: number
  marginRight: number
  paddingLeft: number
  delta: number
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const creativeLabelRef = useRef<HTMLSpanElement>(null)
  const sinceLabelRef = useRef<HTMLSpanElement>(null)
  const scrollLettersRef = useRef<SVGGElement>(null)
  const scrollArrowRef = useRef<SVGGElement>(null)

  useGSAP(
    (_, contextSafe) => {
      const section = sectionRef.current
      const spotlight = spotlightRef.current
      const title = titleRef.current
      const creativeLabel = creativeLabelRef.current
      const sinceLabel = sinceLabelRef.current
      const scrollLetters = scrollLettersRef.current
      const scrollArrow = scrollArrowRef.current
      if (
        !section ||
        !spotlight ||
        !title ||
        !creativeLabel ||
        !sinceLabel ||
        !scrollLetters ||
        !scrollArrow ||
        !contextSafe
      )
        return

      const words = title.querySelectorAll<HTMLElement>('[data-hero-el]')
      const masks = title.querySelectorAll<HTMLElement>('[data-hero-mask]')
      const labels = [creativeLabel, sinceLabel]
      const letterPaths = scrollLetters.querySelectorAll('path')

      // Undo leftover inline styles from a previous effect pass (Strict Mode /
      // client nav) before measuring — otherwise offsetWidth is 0 and the
      // later clearProps snaps CSS width on with no tween.
      gsap.set(masks, { clearProps: 'width,marginLeft,marginRight' })
      title.querySelectorAll<HTMLElement>('[data-hero-line]').forEach((line) => {
        gsap.set(line, { clearProps: 'paddingLeft' })
      })

      // Grow each mask from its center while the line's padding absorbs half
      // the expansion, so neighboring words shift left and right equally.
      const reveals: MaskReveal[] = Array.from(masks).map((mask) => {
        const line = mask.closest<HTMLElement>('[data-hero-line]')
        if (!line) {
          throw new Error('Hero mask is missing its data-hero-line parent')
        }

        const styles = getComputedStyle(mask)
        const width = mask.offsetWidth || parseFloat(styles.width) || 161
        const marginLeft = parseFloat(styles.marginLeft) || 0
        const marginRight = parseFloat(styles.marginRight) || 0
        const paddingLeft = parseFloat(getComputedStyle(line).paddingLeft) || 0
        const delta = width + marginLeft + marginRight

        return { mask, line, width, marginLeft, marginRight, paddingLeft, delta }
      })

      gsap.set(words, {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(4px)',
      })

      reveals.forEach(({ mask, line, paddingLeft, delta }) => {
        gsap.set(mask, {
          width: 0,
          marginLeft: 0,
          marginRight: 0,
        })
        gsap.set(line, {
          paddingLeft: paddingLeft + delta / 2,
        })
      })

      gsap.set(spotlight, {
        xPercent: -50,
        yPercent: -50,
        x: section.clientWidth / 2,
        y: section.clientHeight / 2,
        opacity: 0,
      })

      gsap.set(labels, {
        clipPath: 'inset(0 100% 0 0)',
      })

      gsap.set(letterPaths, {
        autoAlpha: 0,
        y: 8,
      })

      gsap.set(scrollArrow, {
        autoAlpha: 0,
        y: -12,
        transformOrigin: '50% 0%',
      })

      const xTo = gsap.quickTo(spotlight, 'x', { duration: 0.35, ease: 'power3' })
      const yTo = gsap.quickTo(spotlight, 'y', { duration: 0.35, ease: 'power3' })

      const onPointerMove = (event: PointerEvent) => {
        const rect = section.getBoundingClientRect()
        xTo(event.clientX - rect.left)
        yTo(event.clientY - rect.top)
      }

      const onPointerEnter = contextSafe(() => {
        gsap.to(spotlight, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      })

      const onPointerLeave = contextSafe(() => {
        gsap.to(spotlight, { opacity: 0, duration: 0.4, ease: 'power2.out' })
      })

      section.addEventListener('pointermove', onPointerMove)
      section.addEventListener('pointerenter', onPointerEnter)
      section.addEventListener('pointerleave', onPointerLeave)

      const maskHoverCleanups: Array<() => void> = []

      const bindMaskHovers = contextSafe(() => {
        masks.forEach((mask) => {
          const overlay = mask.querySelector<HTMLElement>('[data-hero-mask-overlay]')
          const label = mask.querySelector<HTMLElement>('[data-hero-mask-label]')
          const border = mask.querySelector<SVGRectElement>('[data-hero-mask-border]')
          if (!overlay || !label || !border) return

          const borderLength = border.getTotalLength()

          gsap.set(overlay, { opacity: 0 })
          gsap.set(label, { opacity: 0 })
          gsap.set(border, {
            strokeDasharray: borderLength,
            strokeDashoffset: borderLength,
          })

          const onEnter = contextSafe(() => {
            gsap.to(overlay, {
              opacity: 1,
              duration: 0.55,
              ease: hoverEase,
              overwrite: 'auto',
            })
            gsap.to(label, {
              opacity: 1,
              duration: 0.55,
              ease: hoverEase,
              overwrite: 'auto',
            })
            gsap.to(border, {
              strokeDashoffset: 0,
              duration: 0.55,
              ease: hoverEase,
              overwrite: 'auto',
            })
          })

          const onLeave = contextSafe(() => {
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.55,
              ease: hoverEase,
              overwrite: 'auto',
            })
            gsap.to(label, {
              opacity: 0,
              duration: 0.55,
              ease: hoverEase,
              overwrite: 'auto',
            })
            gsap.to(border, {
              strokeDashoffset: borderLength,
              duration: 0.55,
              ease: hoverEase,
              overwrite: 'auto',
            })
          })

          mask.addEventListener('pointerenter', onEnter)
          mask.addEventListener('pointerleave', onLeave)
          maskHoverCleanups.push(() => {
            mask.removeEventListener('pointerenter', onEnter)
            mask.removeEventListener('pointerleave', onLeave)
          })
        })
      })

      const playIntro = contextSafe(() => {
        const tl = gsap.timeline({
          delay: HERO_INTRO_DELAY,
          onComplete: bindMaskHovers,
        })

        tl.to(words, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power2.out',
          stagger: {
            each: 0.05,
            from: 'center',
          },
          clearProps: 'filter',
        })

        reveals.forEach(({ mask, line, width, marginLeft, marginRight, paddingLeft, delta }, i) => {
          // fromTo locks start/end so remounts never treat width:0 as the destination.
          tl.fromTo(
            mask,
            {
              width: 0,
              marginLeft: 0,
              marginRight: 0,
            },
            {
              width,
              marginLeft,
              marginRight,
              duration: 1.1,
              ease: maskEase,
              immediateRender: false,
              clearProps: 'width,marginLeft,marginRight',
            },
            i === 0 ? '>-0.8' : '<',
          )

          tl.fromTo(
            line,
            {
              paddingLeft: paddingLeft + delta / 2,
            },
            {
              paddingLeft,
              duration: 1.1,
              ease: maskEase,
              immediateRender: false,
              clearProps: 'paddingLeft',
            },
            '<',
          )
        })

        tl.to(
          creativeLabel,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.9,
            ease: labelEase,
          },
          '>-=0.3',
        )

        tl.to(
          sinceLabel,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.9,
            ease: labelEase,
          },
          '<0.4',
        )

        tl.to(
          letterPaths,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.03,
          },
          '+=0.6',
        )

        tl.to(
          scrollArrow,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '<0.25',
        )
      })

      const unsubscribe = onIntroComplete(playIntro)

      return () => {
        unsubscribe()
        maskHoverCleanups.forEach((cleanup) => cleanup())
        section.removeEventListener('pointermove', onPointerMove)
        section.removeEventListener('pointerenter', onPointerEnter)
        section.removeEventListener('pointerleave', onPointerLeave)
      }
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="hero relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <Image
        src="/images/hero/hero-background-shape.png"
        alt=""
        width={2200}
        height={1560}
        priority
        aria-hidden
        className="pointer-events-none absolute top-[var(--hero-bg-top)] left-0 z-0 h-auto w-auto max-w-none origin-top-left scale-[var(--hero-scale)] select-none"
      />
      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-[1] size-[var(--hero-spotlight-size)] rounded-full bg-[#5b7d54]/40 blur-[100px] will-change-transform"
      />
      <NoiseLayer className="z-[2]" />
      <div className="relative z-10 w-[var(--hero-block-w)]">
        <span
          ref={creativeLabelRef}
          className="pointer-events-none absolute top-[var(--hero-label-top)] right-[var(--hero-label-x)] font-serif text-[length:var(--hero-label-size)] font-light uppercase leading-[97%] text-[#ABC337] will-change-[clip-path]"
        >
          Creative Developer
        </span>
        <span
          ref={sinceLabelRef}
          className="pointer-events-none absolute bottom-[var(--hero-label-bottom)] left-[var(--hero-label-x)] font-serif text-[length:var(--hero-label-size)] font-light uppercase leading-[97%] text-[#ABC337] will-change-[clip-path]"
        >
          Since 2010
        </span>
        <h1
          ref={titleRef}
          className="font-serif text-[length:var(--hero-title-size)] font-normal uppercase leading-[91%] tracking-[var(--hero-title-tracking)] text-white"
        >
          <span data-hero-line className="block pl-[var(--hero-line-1-pl)]">
            <span data-hero-el className="inline-block">
              I
            </span>{' '}
            <span className="inline-block align-middle">
              <Link
                href="/about"
                data-hero-mask
                aria-label="About Me"
                className="relative mx-[var(--hero-mask-mx)] flex h-[var(--hero-mask-h)] w-[var(--hero-mask-w)] translate-x-[var(--hero-mask-shift)] translate-y-[var(--hero-mask-shift)] items-center justify-center overflow-hidden rounded-[50px]"
              >
                <Image
                  src="/images/hero/hero-img-heading-01.jpg"
                  alt=""
                  width={161}
                  height={88}
                  aria-hidden
                  className="h-[var(--hero-mask-h)] w-[var(--hero-mask-w)] max-w-none shrink-0 object-cover"
                />
                <span
                  data-hero-mask-overlay
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0"
                  style={{ backgroundColor: MASK_OVERLAY_BG }}
                />
                <svg
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[1] size-full"
                  viewBox="0 0 161 88"
                  fill="none"
                >
                  <rect
                    data-hero-mask-border
                    x="2"
                    y="2"
                    width="157"
                    height="84"
                    rx="42"
                    ry="42"
                    stroke="#ABC337"
                    strokeWidth="1.5"
                    strokeDasharray="999"
                    strokeDashoffset="999"
                  />
                </svg>
                <span
                  data-hero-mask-label
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-2 text-center font-serif text-[length:var(--hero-mask-label-size)] font-light uppercase leading-tight tracking-wide text-white opacity-0"
                >
                  About Me
                </span>
              </Link>
            </span>
            <span data-hero-el className="inline-block">
              don&apos;t
            </span>
          </span>

          <span data-hero-line className="block pl-[var(--hero-line-2-pl)]">
            <span data-hero-el className="inline-block">
              promise
            </span>{' '}
            <span className="inline-block align-middle">
              <Link
                href="/works"
                data-hero-mask
                aria-label="Works"
                className="relative mx-[var(--hero-mask-mx)] flex h-[var(--hero-mask-h)] w-[var(--hero-mask-w)] translate-x-[var(--hero-mask-shift)] translate-y-[var(--hero-mask-shift)] items-center justify-center overflow-hidden rounded-[50px]"
              >
                <Image
                  src="/images/hero/hero-img-heading-02.jpg"
                  alt=""
                  width={161}
                  height={88}
                  aria-hidden
                  className="h-[var(--hero-mask-h)] w-[var(--hero-mask-w)] max-w-none shrink-0 object-cover"
                />
                <span
                  data-hero-mask-overlay
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0"
                  style={{ backgroundColor: MASK_OVERLAY_BG }}
                />
                <svg
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[1] size-full"
                  viewBox="0 0 161 88"
                  fill="none"
                >
                  <rect
                    data-hero-mask-border
                    x="2"
                    y="2"
                    width="157"
                    height="84"
                    rx="42"
                    ry="42"
                    stroke="#ABC337"
                    strokeWidth="1.5"
                    strokeDasharray="999"
                    strokeDashoffset="999"
                  />
                </svg>
                <span
                  data-hero-mask-label
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-2 text-center font-serif text-[length:var(--hero-mask-label-size)] font-light uppercase leading-tight tracking-wide text-white opacity-0"
                >
                  Works
                </span>
              </Link>
            </span>
          </span>

          <span className="block">
            <span data-hero-el className="inline-block">
              pixel
            </span>{' '}
            <span data-hero-el className="inline-block">
              perfect.
            </span>
          </span>

          <span className="block pl-[var(--hero-line-4-pl)]">
            <span data-hero-el className="inline-block">
              I
            </span>{' '}
            <span data-hero-el className="inline-block">
              deliver
            </span>{' '}
            <span data-hero-el className="inline-block">
              it.
            </span>
          </span>
        </h1>
      </div>

      <div className="pointer-events-none absolute bottom-[var(--hero-scroll-bottom)] left-1/2 z-10 origin-bottom -translate-x-1/2 scale-[var(--hero-scale)]">
        <svg
          width={181}
          height={95}
          viewBox="0 0 182 95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <g ref={scrollLettersRef}>
            <path
              d="M10.4087 84.6844L10.5203 83.7813C10.9253 83.6997 11.2875 83.5469 11.6067 83.3231C12.3468 82.8126 12.7793 82.0526 12.9041 81.043C13.0116 80.1722 12.9088 79.4824 12.5955 78.9735C12.2834 78.4553 11.8494 78.1619 11.2936 78.0932C11.1454 78.0749 11.0088 78.0768 10.8838 78.099C10.76 78.1119 10.6373 78.1532 10.5159 78.2228C10.3944 78.2924 10.2921 78.3597 10.2088 78.4247C10.1174 78.4792 10.0203 78.5801 9.91749 78.7272C9.80541 78.8733 9.72048 78.9897 9.66272 79.0766C9.60611 79.1543 9.52759 79.295 9.42716 79.4989C9.31747 79.7017 9.24301 79.8477 9.20377 79.9369C9.16454 80.026 9.09242 80.1911 8.98742 80.4321C8.87315 80.6719 8.79697 80.8317 8.75888 80.9117C8.61121 81.2696 8.47561 81.5679 8.35208 81.8065C8.22855 82.0452 8.07436 82.3036 7.88953 82.5817C7.69544 82.8586 7.49895 83.0788 7.30007 83.2424C7.10232 83.3966 6.8617 83.5173 6.5782 83.6046C6.2947 83.6918 5.99085 83.7154 5.66664 83.6753C4.94414 83.586 4.36129 83.2037 3.91811 82.5282C3.47493 81.8528 3.31514 81.0149 3.43874 80.0145C3.60127 78.6992 4.15731 77.7381 5.10689 77.1313C5.51518 76.8714 5.96759 76.711 6.46414 76.6501L6.35255 77.5532C6.01576 77.6151 5.70801 77.7463 5.4293 77.947C4.77821 78.4214 4.39258 79.1449 4.2724 80.1175C4.17741 80.8863 4.27958 81.5055 4.57893 81.9751C4.86901 82.4435 5.26878 82.7092 5.77823 82.7722C6.41737 82.8512 6.97542 82.4828 7.45238 81.6671C7.61754 81.396 7.89108 80.8185 8.27301 79.9347C8.44036 79.5698 8.58465 79.2773 8.70589 79.0572C8.81901 78.8266 8.97783 78.5688 9.18233 78.2837C9.37757 77.9975 9.57348 77.7819 9.77008 77.6369C9.96782 77.4827 10.2084 77.362 10.4919 77.2747C10.7766 77.1782 11.081 77.15 11.4052 77.1901C12.174 77.2851 12.7911 77.6952 13.2563 78.4204C13.7135 79.1351 13.8739 80.0437 13.7377 81.146C13.566 82.5354 12.962 83.5423 11.9256 84.1665C11.4595 84.4381 10.9538 84.6107 10.4087 84.6844Z"
              fill="white"
            />
            <path
              d="M14.4989 69.4288C13.2653 70.0312 11.9401 70.0964 10.5233 69.6245C9.10649 69.1526 8.0851 68.3057 7.45913 67.0839C6.83316 65.8622 6.74729 64.5695 7.20152 63.2058C7.69705 61.7181 8.6531 60.6938 10.0697 60.1327C10.6894 59.8964 11.3417 59.7842 12.0264 59.7958L11.7388 60.6592C11.2105 60.6799 10.7059 60.7922 10.2248 60.996C9.13288 61.4684 8.39076 62.2935 7.99847 63.4712C7.61798 64.6135 7.68609 65.679 8.20281 66.6676C8.71952 67.6563 9.58888 68.3541 10.8109 68.7611C12.0329 69.1682 13.147 69.131 14.1534 68.6497C15.1597 68.1684 15.8531 67.3566 16.2336 66.2143C16.6348 65.0101 16.5106 63.8767 15.861 62.8143C15.5805 62.3569 15.21 61.9482 14.7495 61.5882L15.0371 60.7249C15.6275 61.138 16.1146 61.6396 16.4984 62.2298C17.3605 63.5401 17.5379 64.9567 17.0306 66.4798C16.5763 67.8435 15.7324 68.8265 14.4989 69.4288Z"
              fill="white"
            />
            <path
              d="M21.5054 54.8953L13.0328 49.9703L15.0732 46.4602C15.6079 45.5403 16.2697 44.9589 17.0588 44.7158C17.8444 44.46 18.6246 44.5572 19.3992 45.0075C20.0609 45.3921 20.5068 45.9158 20.7369 46.5785C20.9717 47.2332 20.9392 47.9484 20.6394 48.7242L25.2343 48.4803L24.7066 49.3881L20.2074 49.6066L18.6947 52.2089L21.9627 54.1085L21.5054 54.8953ZM17.9685 51.7868L19.5515 49.0634C19.969 48.3453 20.1219 47.7108 20.0102 47.1601C19.8951 46.5966 19.539 46.1413 18.9419 45.7942C18.3448 45.4471 17.7769 45.3654 17.2384 45.5489C16.6965 45.7197 16.2168 46.1642 15.7994 46.8824L14.2164 49.6057L17.9685 51.7868Z"
              fill="white"
            />
            <path
              d="M29.2714 40.8892C27.9 40.9499 26.6586 40.4814 25.5474 39.4838C24.4361 38.4863 23.837 37.3025 23.7499 35.9324C23.6629 34.5624 24.0994 33.3426 25.0596 32.273C26.0198 31.2034 27.1856 30.6383 28.557 30.5776C29.9285 30.5169 31.1698 30.9853 32.2811 31.9829C33.3923 32.9805 33.9915 34.1643 34.0785 35.5343C34.1656 36.9044 33.7291 38.1242 32.7689 39.1937C31.8087 40.2633 30.6429 40.8285 29.2714 40.8892ZM24.5979 35.8471C24.6777 36.9597 25.1968 37.9463 26.1553 38.8067C27.1138 39.6671 28.1504 40.0772 29.2652 40.0369C30.38 39.9966 31.3395 39.5285 32.1438 38.6326C32.9481 37.7367 33.3104 36.7324 33.2306 35.6197C33.1508 34.507 32.6316 33.5205 31.6732 32.6601C30.7147 31.7997 29.6781 31.3896 28.5633 31.4298C27.4485 31.4701 26.489 31.9382 25.6847 32.8342C24.8804 33.7301 24.5181 34.7344 24.5979 35.8471Z"
              fill="white"
            />
            <path
              d="M41.5197 30.3834L35.6119 22.5643L36.3379 22.0158L41.7394 29.1646L45.984 25.9575L46.4904 26.6277L41.5197 30.3834Z"
              fill="white"
            />
            <path
              d="M52.1954 23.0948L47.6657 14.4045L48.4727 13.9838L52.6141 21.9293L57.3317 19.4704L57.72 20.2152L52.1954 23.0948Z"
              fill="white"
            />
            <path
              d="M69.6913 6.504L69.5309 5.67946L77.2952 4.16855L77.4557 4.99308L74.0201 5.66163L75.7316 14.4567L74.8384 14.6305L73.1269 5.83545L69.6913 6.504Z"
              fill="white"
            />
            <path
              d="M87.161 11.8235C86.206 10.8373 85.7333 9.59762 85.7428 8.10432C85.7524 6.61102 86.241 5.37745 87.2086 4.40363C88.1762 3.42981 89.3786 2.9475 90.8159 2.95671C92.2532 2.96592 93.4494 3.46359 94.4044 4.44973C95.3594 5.43587 95.8322 6.67559 95.8226 8.16889C95.813 9.6622 95.3245 10.8958 94.3569 11.8696C93.3893 12.8434 92.1868 13.3257 90.7495 13.3165C89.3122 13.3073 88.1161 12.8096 87.161 11.8235ZM87.8349 4.98166C87.0551 5.77934 86.6611 6.82217 86.6528 8.11015C86.6446 9.39812 87.0252 10.4459 87.7947 11.2535C88.5642 12.0611 89.5509 12.4688 90.7549 12.4765C91.9589 12.4842 92.9508 12.0892 93.7306 11.2916C94.5104 10.4939 94.9044 9.45104 94.9126 8.16306C94.9209 6.87509 94.5403 5.8273 93.7707 5.01969C93.0012 4.21207 92.0145 3.80441 90.8105 3.7967C89.6065 3.78898 88.6147 4.18397 87.8349 4.98166Z"
              fill="white"
            />
            <path
              d="M111.887 15.9659L114.973 6.66444L121.285 8.75834L121.02 9.55562L115.572 7.74824L114.448 11.1367L118.9 12.6134L118.635 13.4107L114.184 11.9339L113.016 15.4552L118.464 17.2626L118.199 18.0599L111.887 15.9659Z"
              fill="white"
            />
            <path
              d="M124.077 20.5422L128.759 17.516L128.896 12.0076L129.756 12.4772L129.637 17.5163L130.743 18.12L134.917 15.2947L135.777 15.7643L131.217 18.8576L131.204 24.4331L130.344 23.9635L130.34 18.8573L129.234 18.2536L124.937 21.0118L124.077 20.5422Z"
              fill="white"
            />
            <path
              d="M136.773 28.2086L142.977 20.6223L146.066 23.1482C146.889 23.8218 147.361 24.587 147.48 25.444C147.599 26.3009 147.366 27.0871 146.781 27.8023C146.196 28.5176 145.472 28.902 144.608 28.9553C143.745 29.0087 142.901 28.6987 142.077 28.0251L139.693 26.0753L137.477 28.7847L136.773 28.2086ZM140.225 25.425L142.609 27.3748C143.252 27.9007 143.877 28.1465 144.484 28.1122C145.097 28.0707 145.627 27.7754 146.076 27.2263C146.526 26.6772 146.707 26.1019 146.62 25.5003C146.539 24.8916 146.177 24.3243 145.534 23.7985L143.15 21.8487L140.225 25.425Z"
              fill="white"
            />
            <path
              d="M147.826 38.2256L155.284 31.868L155.874 32.5605L149.056 38.3732L152.507 42.4218L151.868 42.9667L147.826 38.2256Z"
              fill="white"
            />
            <path
              d="M157.278 48.5804C157.659 47.2615 158.5 46.2352 159.8 45.5013C161.101 44.7674 162.414 44.5783 163.74 44.934C165.066 45.2896 166.082 46.0933 166.788 47.3451C167.495 48.5969 167.657 49.8822 167.276 51.2011C166.895 52.5199 166.054 53.5463 164.754 54.2801C163.453 55.014 162.14 55.2031 160.814 54.8475C159.488 54.4918 158.472 53.6881 157.766 52.4363C157.059 51.1845 156.897 49.8992 157.278 48.5804ZM163.55 45.7647C162.47 45.4845 161.369 45.6609 160.248 46.2938C159.126 46.9268 158.406 47.7778 158.087 48.847C157.769 49.9161 157.906 50.9749 158.497 52.0235C159.089 53.0721 159.925 53.7365 161.004 54.0167C162.084 54.2969 163.185 54.1206 164.307 53.4876C165.428 52.8546 166.149 52.0036 166.467 50.9345C166.785 49.8654 166.649 48.8065 166.057 47.7579C165.465 46.7093 164.629 46.0449 163.55 45.7647Z"
              fill="white"
            />
            <path
              d="M163.353 63.5273L172.69 60.5497L173.923 64.4177C174.246 65.4314 174.234 66.3123 173.884 67.0605C173.547 67.8147 172.951 68.3279 172.098 68.6001C171.369 68.8327 170.681 68.8119 170.035 68.5378C169.392 68.2727 168.884 67.7687 168.51 67.0259L165.607 70.5965L165.288 69.5962L168.145 66.1135L167.231 63.2458L163.629 64.3943L163.353 63.5273ZM168.031 62.9906L168.988 65.9916C169.24 66.783 169.608 67.3221 170.092 67.6088C170.587 67.9016 171.163 67.943 171.821 67.7332C172.479 67.5233 172.921 67.1571 173.146 66.6347C173.383 66.1183 173.375 65.4644 173.123 64.673L172.166 61.6719L168.031 62.9906Z"
              fill="white"
            />
            <path
              d="M167.177 77.9457L176.903 76.744L177.718 83.3438L176.885 83.4468L176.181 77.7501L172.638 78.1879L173.213 82.8425L172.379 82.9455L171.804 78.2909L168.122 78.7458L168.826 84.4425L167.992 84.5455L167.177 77.9457Z"
              fill="white"
            />
          </g>
          <g ref={scrollArrowRef}>
            <rect
              x="91.2639"
              y="43.25"
              width="0.5"
              height="50.0121"
              fill="#ABC337"
              stroke="#ABC337"
              strokeWidth="0.5"
            />
            <rect
              x="110.766"
              y="62.0658"
              width="0.495216"
              height="39.5048"
              transform="rotate(90 110.766 62.0658)"
              fill="#ABC337"
              stroke="#ABC337"
              strokeWidth="0.495216"
            />
            <rect
              y="0.350171"
              width="0.497614"
              height="39.3115"
              transform="matrix(0.710497 0.7037 -0.710497 0.7037 105.405 48.9056)"
              fill="#ABC337"
              stroke="#ABC337"
              strokeWidth="0.497614"
            />
            <rect
              x="-0.353553"
              y="-2.96601e-08"
              width="0.497614"
              height="39.3115"
              transform="matrix(-0.710497 0.7037 -0.710497 -0.7037 105.259 76.364)"
              fill="#ABC337"
              stroke="#ABC337"
              strokeWidth="0.497614"
            />
            <path
              d="M91.5066 94L91.1513 94.3519L91.5066 94.7037L91.8618 94.3519L91.5066 94ZM87.0139 89.5504L86.6587 89.9022L91.1513 94.3519L91.5066 94L91.8618 93.6482L87.3692 89.1985L87.0139 89.5504ZM91.5066 94L91.8618 94.3519L96.3544 89.9022L95.9992 89.5504L95.6439 89.1985L91.1513 93.6482L91.5066 94Z"
              fill="#ABC337"
            />
          </g>
        </svg>
      </div>
    </section>
  )
}
