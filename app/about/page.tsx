import InternalPage from '@/components/InternalPage'
import AboutContent from '@/components/about/AboutContent'
import JsonLd from '@/components/JsonLd'
import { aboutJsonLd, pageMetadata } from '@/lib/seo'
import { PAGE_COPY } from '@/lib/site'

export const metadata = pageMetadata({
  title: PAGE_COPY.about.title,
  description: PAGE_COPY.about.description,
  path: '/about',
})

export default function About() {
  return (
    <main id="main" className="flex flex-1 flex-col overflow-x-clip">
      <JsonLd data={aboutJsonLd()} />
      <InternalPage
        title="About"
        eyebrow="Creative Developer"
        description="Motion, typography, and interaction — crafted with care since 2010."
      >
        <AboutContent />
      </InternalPage>
    </main>
  )
}
