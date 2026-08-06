import InternalPage from '@/components/InternalPage'

export default function Labs() {
  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
      <InternalPage
        title="Labs"
        eyebrow="Experiments"
        description="Playgrounds, prototypes, and motion studies."
      >
        <p className="max-w-[42ch] font-sans text-base font-light leading-8 tracking-wide text-[#2B4625]/90 md:text-lg">
          Experiments and side studies will land here soon.
        </p>
      </InternalPage>
    </main>
  )
}
