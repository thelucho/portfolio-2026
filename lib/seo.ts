import type { Metadata } from 'next'
import { ABOUT_TECH } from '@/lib/about'
import { SITE, SITE_DESCRIPTION, SITE_KEYWORDS, absoluteUrl } from '@/lib/site'
import { WORKS, workPath, type Work } from '@/lib/works'

const MONTHS: Record<string, string> = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
}

export type JsonLd = Record<string, unknown>

export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Prefer a photographic asset for social cards and image sitemaps. */
export function workSeoImage(work: Work): string {
  if (/\.(jpe?g|png|webp)$/i.test(work.image)) return work.image
  return work.detailImages[0] ?? work.image
}

export function workDateIso(date: string): string | undefined {
  const match = date.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (!match) return undefined
  const month = MONTHS[match[1] ?? '']
  if (!month) return undefined
  return `${match[2]}-${month}`
}

const OG_IMAGE = {
  url: SITE.ogImage,
  width: 1200,
  height: 630,
  alt: SITE.title,
} as const

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = path === '/' ? '/' : path
  const openGraphTitle = path === '/' ? title : `${title} | ${SITE.shortName}`

  return {
    title: path === '/' ? { absolute: title } : title,
    description,
    keywords: [...SITE_KEYWORDS],
    alternates: {
      canonical: url,
      languages: {
        en: url,
        'x-default': url,
      },
    },
    openGraph: {
      title: openGraphTitle,
      description,
      url,
      type: 'website',
      locale: SITE.locale,
      siteName: SITE.name,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraphTitle,
      description,
      images: [SITE.ogImage],
    },
  }
}

export function workPageMetadata(work: Work): Metadata {
  const path = workPath(work)
  const description = work.about
  const title = `${work.brand} case study`
  const openGraphTitle = `${work.brand} | ${SITE.shortName}`

  return {
    title,
    description,
    keywords: [...SITE_KEYWORDS],
    alternates: { canonical: path },
    openGraph: {
      title: openGraphTitle,
      description,
      url: path,
      type: 'article',
      locale: SITE.locale,
      siteName: SITE.name,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraphTitle,
      description,
      images: [SITE.ogImage],
    },
  }
}

function personId(): string {
  return `${SITE.url}/#person`
}

function websiteId(): string {
  return `${SITE.url}/#website`
}

export function personJsonLd(): JsonLd {
  return {
    '@type': 'Person',
    '@id': personId(),
    name: SITE.person.name,
    alternateName: [...SITE.person.alternateNames],
    url: SITE.url,
    image: absoluteUrl(SITE.person.image),
    jobTitle: [...SITE.person.jobTitles],
    description: SITE.person.description,
    email: SITE.email,
    nationality: SITE.person.countryName,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.person.city,
      addressCountry: SITE.person.country,
    },
    homeLocation: {
      '@type': 'City',
      name: SITE.person.city,
      containedInPlace: {
        '@type': 'Country',
        name: SITE.person.countryName,
      },
    },
    sameAs: [SITE.social.github, SITE.social.linkedin],
    knowsAbout: [
      ...ABOUT_TECH.map((item) => item.label),
      ...SITE_KEYWORDS,
    ],
    hasOccupation: SITE.person.jobTitles.map((name) => ({
      '@type': 'Occupation',
      name,
      occupationLocation: {
        '@type': 'City',
        name: SITE.person.city,
        containedInPlace: {
          '@type': 'Country',
          name: SITE.person.countryName,
        },
      },
    })),
    worksFor: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  }
}

export function websiteJsonLd(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    url: SITE.url,
    name: SITE.name,
    alternateName: SITE.person.name,
    description: SITE_DESCRIPTION,
    inLanguage: SITE.language,
    publisher: { '@id': personId() },
    author: { '@id': personId() },
  }
}

export function siteGraphJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteJsonLd(), personJsonLd()],
  }
}

function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function homeJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE.url}/#webpage`,
    url: SITE.url,
    name: SITE.title,
    description: SITE_DESCRIPTION,
    inLanguage: SITE.language,
    isPartOf: { '@id': websiteId() },
    about: { '@id': personId() },
    primaryImageOfPage: absoluteUrl(SITE.person.image),
  }
}

export function aboutJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${absoluteUrl('/about')}/#webpage`,
        url: absoluteUrl('/about'),
        name: `About | ${SITE.shortName}`,
        description: SITE.person.description,
        inLanguage: SITE.language,
        isPartOf: { '@id': websiteId() },
        mainEntity: { '@id': personId() },
        breadcrumb: { '@id': `${absoluteUrl('/about')}/#breadcrumb` },
      },
      {
        ...breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]),
        '@id': `${absoluteUrl('/about')}/#breadcrumb`,
      },
    ],
  }
}

export function worksIndexJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${absoluteUrl('/works')}/#webpage`,
        url: absoluteUrl('/works'),
        name: `Works | ${SITE.shortName}`,
        description:
          'Selected web projects and case studies by Luciano Dichiara.',
        inLanguage: SITE.language,
        isPartOf: { '@id': websiteId() },
        mainEntity: { '@id': `${absoluteUrl('/works')}/#itemlist` },
        breadcrumb: { '@id': `${absoluteUrl('/works')}/#breadcrumb` },
      },
      {
        '@type': 'ItemList',
        '@id': `${absoluteUrl('/works')}/#itemlist`,
        numberOfItems: WORKS.length,
        itemListElement: WORKS.map((work, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(workPath(work)),
          name: work.brand,
        })),
      },
      {
        ...breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Works', path: '/works' },
        ]),
        '@id': `${absoluteUrl('/works')}/#breadcrumb`,
      },
    ],
  }
}

export function workJsonLd(work: Work): JsonLd {
  const path = workPath(work)
  const url = absoluteUrl(path)
  const date = workDateIso(work.date)
  const image = absoluteUrl(workSeoImage(work))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}/#webpage`,
        url,
        name: `${work.brand} | ${SITE.shortName}`,
        description: work.about,
        inLanguage: SITE.language,
        isPartOf: { '@id': websiteId() },
        primaryImageOfPage: image,
        breadcrumb: { '@id': `${url}/#breadcrumb` },
        mainEntity: { '@id': `${url}/#work` },
      },
      {
        '@type': 'CreativeWork',
        '@id': `${url}/#work`,
        name: work.brand,
        headline: work.title,
        description: work.about,
        url,
        image,
        ...(date ? { dateCreated: date } : {}),
        creator: { '@id': personId() },
        author: { '@id': personId() },
        sourceOrganization: {
          '@type': 'Organization',
          name: work.agency,
        },
        keywords: work.stack,
        ...(work.href !== '#'
          ? {
              workExample: {
                '@type': 'WebSite',
                name: work.brand,
                url: work.href,
              },
            }
          : {}),
      },
      {
        ...breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Works', path: '/works' },
          { name: work.brand, path },
        ]),
        '@id': `${url}/#breadcrumb`,
      },
    ],
  }
}

export function contactJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${absoluteUrl('/contact')}/#webpage`,
        url: absoluteUrl('/contact'),
        name: `Contact | ${SITE.shortName}`,
        description:
          'Hire Luciano Dichiara — freelance creative developer in Argentina. Open to contractor, part-time, or full-time remote roles.',
        inLanguage: SITE.language,
        isPartOf: { '@id': websiteId() },
        breadcrumb: { '@id': `${absoluteUrl('/contact')}/#breadcrumb` },
        mainEntity: { '@id': personId() },
      },
      {
        ...breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]),
        '@id': `${absoluteUrl('/contact')}/#breadcrumb`,
      },
    ],
  }
}

export function sitemapEntries() {
  const staticRoutes: Array<{
    path: string
    changeFrequency: 'monthly' | 'weekly'
    priority: number
    images?: string[]
    lastModified?: string
  }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    {
      path: '/about',
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [absoluteUrl(SITE.person.image)],
    },
    { path: '/works', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  ]

  const workRoutes = WORKS.map((work) => ({
    path: workPath(work),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    images: [absoluteUrl(workSeoImage(work))],
    lastModified: workDateIso(work.date),
  }))

  return [...staticRoutes, ...workRoutes]
}
