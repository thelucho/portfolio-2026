import type { Metadata } from 'next'
import Link from 'next/link'
import InternalPage from '@/components/InternalPage'
import ViewCaseArrow from '@/components/ViewCaseArrow'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 flex-col overflow-x-clip">
      <InternalPage
        title="404"
        eyebrow="Lost in the woods"
        description="This page does not exist — or it has not grown yet."
      >
        <Link
          href="/"
          className="view-case-link inline-flex w-fit items-center gap-2.5 font-sans"
        >
          Back home
          <ViewCaseArrow />
          <span aria-hidden className="view-case-underline" />
        </Link>
      </InternalPage>
    </main>
  )
}
