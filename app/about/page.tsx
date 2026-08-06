import InternalPage from '@/components/InternalPage'
import AboutContent from '@/components/about/AboutContent'

export default function About() {
  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
      <InternalPage title="About" tone="cream" align="left">
        <AboutContent />
      </InternalPage>
    </main>
  )
}
