import InternalPage from '@/components/InternalPage'
import ContactContent from '@/components/contact/ContactContent'

export default function Contact() {
  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
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
