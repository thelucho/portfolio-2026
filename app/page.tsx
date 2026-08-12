import HomeExperience from '@/components/home/HomeExperience'
import JsonLd from '@/components/JsonLd'
import { homeJsonLd, pageMetadata } from '@/lib/seo'
import { PAGE_COPY } from '@/lib/site'

export const metadata = pageMetadata({
  title: PAGE_COPY.home.title,
  description: PAGE_COPY.home.description,
  path: '/',
})

export default function Home() {
  return (
    <main id="main" className="flex flex-1 flex-col overflow-x-clip">
      <JsonLd data={homeJsonLd()} />
      <HomeExperience />
    </main>
  )
}
