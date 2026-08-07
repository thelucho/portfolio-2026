import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const CONTACT_TEMPLATE_ID = 'contact-form'

const MAX_NAME = 100
const MAX_EMAIL = 254
const MAX_COMPANY = 120
/** Resend template variables accept up to 2,000 characters. */
const MAX_MESSAGE = 2000

type ContactBody = {
  name?: unknown
  email?: unknown
  company?: unknown
  message?: unknown
  website?: unknown
}

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return null
  return trimmed
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !toEmail || !fromEmail) {
    return Response.json(
      { error: 'Contact form is not configured.' },
      { status: 500 },
    )
  }

  let body: ContactBody

  try {
    body = (await request.json()) as ContactBody
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Honeypot — bots fill hidden fields; humans leave them empty.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return Response.json({ ok: true })
  }

  const name = asTrimmedString(body.name, MAX_NAME)
  const email = asTrimmedString(body.email, MAX_EMAIL)
  const company = asTrimmedString(body.company, MAX_COMPANY)
  const message = asTrimmedString(body.message, MAX_MESSAGE)

  if (!name || !email || !message) {
    return Response.json(
      { error: 'Please fill in your name, email, and message.' },
      { status: 400 },
    )
  }

  if (!isValidEmail(email)) {
    return Response.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  const { error } = await resend.emails.send({
    from: `Thelucho Portfolio <${fromEmail}>`,
    to: [toEmail],
    replyTo: email,
    subject: `New inquiry from ${name}`,
    template: {
      id: CONTACT_TEMPLATE_ID,
      variables: {
        name: escapeHtml(name),
        email: escapeHtml(email),
        company: company ? escapeHtml(company) : '—',
        message: escapeHtml(message).replaceAll('\n', '<br />'),
      },
    },
  })

  if (error) {
    console.error('[contact]', error)
    return Response.json(
      { error: 'Could not send your message. Please try again.' },
      { status: 502 },
    )
  }

  return Response.json({ ok: true })
}
