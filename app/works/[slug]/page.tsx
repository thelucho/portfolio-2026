import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InternalPage from '@/components/InternalPage'
import JsonLd from '@/components/JsonLd'
import WorkContent from '@/components/works/WorkContent'
import { workJsonLd, workPageMetadata } from '@/lib/seo'
import { WORKS, getWorkBySlug, workSlug } from '@/lib/works'

export function generateStaticParams() {
  return WORKS.map((work) => ({ slug: workSlug(work) }))
}

export const dynamicParams = false

type WorkPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params
  const work = getWorkBySlug(slug)
  if (!work) return { title: 'Work' }

  return workPageMetadata(work)
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params
  const work = getWorkBySlug(slug)
  if (!work) notFound()

  return (
    <main id="main" className="flex flex-1 flex-col overflow-x-clip">
      <JsonLd data={workJsonLd(work)} />
      <InternalPage
        title={work.brand}
        eyebrow={work.date}
        description={work.description ?? work.title}
      >
        <WorkContent work={work} />
      </InternalPage>
    </main>
  )
}
