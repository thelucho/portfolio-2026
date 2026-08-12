import { generateOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { workSeoImage } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { WORKS, getWorkBySlug, workSlug } from '@/lib/works'

export function generateStaticParams() {
  return WORKS.map((work) => ({ slug: workSlug(work) }))
}

export const alt = 'Work case study'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const work = getWorkBySlug(slug)

  if (!work) {
    return generateOgImage({
      eyebrow: 'Works',
      title: SITE.name,
    })
  }

  return generateOgImage({
    eyebrow: work.date,
    title: work.brand,
    description: work.description ?? work.title,
    imageSrc: workSeoImage(work),
  })
}
