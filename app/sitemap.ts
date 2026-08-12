import type { MetadataRoute } from 'next'
import { sitemapEntries } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries().map((entry) => ({
    url: absoluteUrl(entry.path),
    ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    ...(entry.images ? { images: entry.images } : {}),
  }))
}
