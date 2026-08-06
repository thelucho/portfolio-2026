import InternalPage from '@/components/InternalPage'

export default function Works() {
  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
      <InternalPage
        title="Works"
        eyebrow="Selected projects"
        description="A growing archive of tailor-made digital experiences."
      >
        <p className="max-w-[42ch] font-sans text-base font-light leading-8 tracking-wide text-[#2B4625]/90 md:text-lg">
          Project listings will live here. For now, explore featured work from
          the homepage.
        </p>
      </InternalPage>
    </main>
  )
}
