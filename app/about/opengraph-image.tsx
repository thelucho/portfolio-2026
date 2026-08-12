import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { SITE } from '@/lib/site'

export const alt = `About ${SITE.person.name} — ${SITE.tagline}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return generateOgImage({
    eyebrow: SITE.tagline,
    title: `Hey, I'm ${SITE.person.alternateNames[1]}.`,
    description: SITE.person.description,
    imageSrc: SITE.person.image,
  })
}
