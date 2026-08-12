import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { SITE } from '@/lib/site'

export const alt = `Selected works by ${SITE.name}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return generateOgImage({
    eyebrow: 'Selected projects',
    title: 'A growing archive of tailor-made digital experiences.',
  })
}
