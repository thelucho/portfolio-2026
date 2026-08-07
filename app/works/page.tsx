import InternalPage from '@/components/InternalPage'
import WorksMarqueeMenu from '@/components/works/WorksMarqueeMenu'

export default function Works() {
  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
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
