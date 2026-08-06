import InternalPage from '@/components/InternalPage'

export default function Contact() {
  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
      <InternalPage
        title="Contact"
        eyebrow="Let's talk"
        description="Have a project in mind? I'd love to hear about it."
      >
        <div className="flex flex-col gap-6">
          <p className="max-w-[42ch] font-sans text-base font-light leading-8 tracking-wide text-[#2B4625]/90 md:text-lg">
            Reach out by email and we&apos;ll figure out the next step together.
          </p>
          <a
            href="mailto:hello@thelucho.dev"
            className="view-case-link inline-flex w-fit items-center gap-2.5 font-sans"
          >
            hello@thelucho.dev
            <span aria-hidden className="view-case-arrow text-lg leading-none">
              <span className="view-case-arrow-icon">↗</span>
              <span className="view-case-arrow-icon">↗</span>
            </span>
            <span aria-hidden className="view-case-underline" />
          </a>
        </div>
      </InternalPage>
    </main>
  )
}
