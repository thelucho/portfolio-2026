import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { SITE } from '@/lib/site'

export const alt = `Contact ${SITE.person.name}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  return generateOgImage({
    eyebrow: "Let's talk",
    title: "Let's connect and create something great together.",
    description: SITE.email,
  })
}
