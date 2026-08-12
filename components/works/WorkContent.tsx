'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { onPageHeroEnterComplete } from '@/lib/page-hero'
import {
  getNextWorks,
  workGalleryImages,
  workPath,
  workYear,
  type Work,
} from '@/lib/works'

gsap.registerPlugin(useGSAP)

type WorkContentProps = {
  work: Work
}

type GalleryRow =
  | { type: 'full'; src: string }
  | { type: 'pair'; srcs: [string, string] }

function buildGalleryRows(images: string[]): GalleryRow[] {
  const rows: GalleryRow[] = []
  let index = 0
  let preferFull = true

  while (index < images.length) {
    const remaining = images.length - index
    if (preferFull || remaining === 1) {
      rows.push({ type: 'full', src: images[index]! })
      index += 1
      preferFull = false
    } else {
      rows.push({
        type: 'pair',
        srcs: [images[index]!, images[index + 1]!],
      })
      index += 2
      preferFull = true
    }
  }

  return rows
}

function MetaLiveLink({ work }: { work: Work }) {
  if (work.href === '#') {
    return (
      <span className="font-sans text-sm font-light tracking-wide text-[#2B4625]/55 md:text-[0.9375rem]">
        {work.linkLabel}
      </span>
    )
  }

  return (
    <a
      href={work.href}
      target="_blank"
      rel="noopener noreferrer"
      className="work-site-link break-all transition-opacity hover:opacity-70"
    >
      {work.linkLabel}
    </a>
  )
}

/**
 * Work detail body — sidebar meta, media gallery, about / objective, related works.
 */
export default function WorkContent({ work }: WorkContentProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const gallery = workGalleryImages(work)
  const [heroSrc, ...restImages] = gallery
  const galleryRows = buildGalleryRows(restImages)
  const related = getNextWorks(work, 2)

  const galleryAlt = (src: string) => {
    const index = gallery.indexOf(src)
    return index >= 0
      ? `${work.brand} case study, image ${index + 1}`
      : `${work.brand} case study`
  }

  const meta = [
    { label: 'Date', value: work.date },
    { label: 'Stack', value: work.stack },
    { label: 'Agency', value: work.agency },
  ] as const

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      const items = root.querySelectorAll<HTMLElement>('[data-work-reveal]')

      if (!reducedMotion) {
        gsap.set(items, { opacity: 0, y: 22 })
      }

      const playEntrance = () => {
        if (reducedMotion) {
          gsap.set(items, { clearProps: 'all' })
          return
        }

        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
        })
      }

      return onPageHeroEnterComplete(playEntrance)
    },
    { scope: rootRef, dependencies: [work.id] },
  )

  return (
    <div ref={rootRef} className="flex flex-col gap-16 md:gap-20 lg:gap-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        <aside
          data-work-reveal
          className="flex flex-col gap-7 lg:col-span-3 lg:sticky lg:top-28 lg:self-start"
        >
          <dl className="flex flex-row flex-wrap gap-x-10 gap-y-6 lg:flex-col lg:gap-7">
            {meta.map((item) => (
              <div key={item.label} className="min-w-[7rem]">
                <dt className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#2B4625]/72">
                  {item.label}
                </dt>
                <dd className="mt-2 font-sans text-sm font-light tracking-wide text-[#2B4625] md:text-[0.9375rem]">
                  {item.value}
                </dd>
              </div>
            ))}
            <div className="min-w-[7rem]">
              <dt className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#2B4625]/72">
                Live
              </dt>
              <dd className="mt-2">
                <MetaLiveLink work={work} />
              </dd>
            </div>
          </dl>
        </aside>

        <div className="flex flex-col gap-10 md:gap-12 lg:col-span-9 lg:gap-14">
          {heroSrc ? (
            <div
              data-work-reveal
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#2B4625]/8"
            >
              <Image
                src={heroSrc}
                alt={work.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-10 md:gap-12">
            <div
              data-work-reveal
              className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-8"
            >
              <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#2B4625]/72 sm:col-span-3 sm:pt-1">
                About
              </p>
              <p className="max-w-[46ch] font-sans text-base font-light leading-8 tracking-wide text-[#2B4625]/88 sm:col-span-9 md:text-[1.0625rem] md:leading-8">
                {work.about}
              </p>
            </div>

            <div
              data-work-reveal
              className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-8"
            >
              <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#2B4625]/72 sm:col-span-3 sm:pt-1">
                Objective
              </p>
              <p className="max-w-[46ch] font-sans text-base font-light leading-8 tracking-wide text-[#2B4625]/88 sm:col-span-9 md:text-[1.0625rem] md:leading-8">
                {work.objective}
              </p>
            </div>
          </div>

          {galleryRows.length > 0 ? (
            <div className="flex flex-col gap-4 md:gap-5">
              {galleryRows.map((row) =>
                row.type === 'full' ? (
                  <div
                    key={row.src}
                    data-work-reveal
                    className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#2B4625]/8"
                  >
                    <Image
                      src={row.src}
                      alt={galleryAlt(row.src)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    key={row.srcs.join('-')}
                    data-work-reveal
                    className="grid grid-cols-2 gap-4 md:gap-5"
                  >
                    {row.srcs.map((src) => (
                      <div
                        key={src}
                        className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-[#2B4625]/8 md:aspect-auto md:h-[400px] md:max-h-[400px]"
                      >
                        <Image
                          src={src}
                          alt={galleryAlt(src)}
                          fill
                          sizes="(max-width: 1024px) 50vw, 35vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          ) : null}
        </div>
      </div>

      {related.length > 0 ? (
        <section
          data-work-reveal
          className="border-t border-[#2B4625]/12 pt-12 md:pt-16"
          aria-labelledby="work-related-heading"
        >
          <h2
            id="work-related-heading"
            className="font-serif text-[clamp(1.65rem,3vw,2.25rem)] font-normal leading-[1.2] tracking-[-0.03em] text-[#2B4625]"
          >
            Check those also
          </h2>

          <ul className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 md:mt-10 lg:gap-12">
            {related.map((item) => {
              const thumb = workGalleryImages(item)[0] ?? item.image
              const year = workYear(item)

              return (
                <li key={item.id}>
                  <Link
                    href={workPath(item)}
                    data-cursor="view"
                    className="group flex flex-col gap-4"
                    aria-label={`View case: ${item.brand}`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#2B4625]/8">
                      <Image
                        src={thumb}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 45vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-sans text-base font-medium tracking-wide text-[#2B4625] md:text-lg">
                        {item.brand}
                      </p>
                      {year ? (
                        <p className="shrink-0 font-sans text-sm font-light tracking-wide text-[#2B4625]/45">
                          ({year})
                        </p>
                      ) : null}
                    </div>

                    <p className="font-sans text-sm font-light tracking-wide text-[#2B4625]/55 md:text-[0.9375rem]">
                      {item.description ?? item.title}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
