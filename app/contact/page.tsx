import InternalPage from '@/components/InternalPage'
import ContactContent from '@/components/contact/ContactContent'
import JsonLd from '@/components/JsonLd'
import { contactJsonLd, pageMetadata } from '@/lib/seo'
import { PAGE_COPY } from '@/lib/site'

export const metadata = pageMetadata({
  title: PAGE_COPY.contact.title,
  description: PAGE_COPY.contact.description,
  path: '/contact',
})

export default function Contact() {
  return (
    <main id="main" className="flex flex-1 flex-col overflow-x-clip">
      <JsonLd data={contactJsonLd()} />
      <InternalPage
        title="Contact"
        eyebrow="Let's talk"
        description="Have a project in mind — or a role that fits? I'd love to hear from you."
      >
        <ContactContent />
      </InternalPage>
    </main>
  )
}
