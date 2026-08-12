import InternalPage from '@/components/InternalPage'
import JsonLd from '@/components/JsonLd'
import WorksMarqueeMenu from '@/components/works/WorksMarqueeMenu'
import { pageMetadata, worksIndexJsonLd } from '@/lib/seo'
import { PAGE_COPY } from '@/lib/site'

export const metadata = pageMetadata({
  title: PAGE_COPY.works.title,
  description: PAGE_COPY.works.description,
  path: '/works',
})

export default function Works() {
  return (
    <main id="main" className="flex flex-1 flex-col overflow-x-clip">
      <JsonLd data={worksIndexJsonLd()} />
      <InternalPage
        title="Works"
        eyebrow="Selected projects"
        description="A growing archive of tailor-made digital experiences."
        fullBleed
      >
        <WorksMarqueeMenu />
      </InternalPage>
    </main>
  )
}
