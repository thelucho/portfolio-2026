import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { SITE } from '@/lib/site'

export const alt = `${SITE.name} — ${SITE.tagline}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return generateOgImage({
    eyebrow: SITE.tagline,
    title: "I don't promise pixel perfect. I deliver it.",
    description: SITE.person.description,
  })
}
