import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InternalPage from '@/components/InternalPage'
import WorkContent from '@/components/works/WorkContent'
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
  if (!work) return { title: 'Work | Thelucho' }

  return {
    title: `${work.brand} | Thelucho`,
    description: work.description ?? work.title,
  }
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params
  const work = getWorkBySlug(slug)
  if (!work) notFound()

  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
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
