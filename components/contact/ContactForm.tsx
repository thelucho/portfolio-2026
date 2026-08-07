'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

type FormState = {
  name: string
  email: string
  company: string
  message: string
  website: string
}

const INITIAL: FormState = {
  name: '',
  email: '',
  company: '',
  message: '',
  website: '',
}

export default function ContactForm() {
  const [values, setValues] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const update =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      if (status === 'error') {
        setStatus('idle')
        setErrorMessage('')
      }
    }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = (await response.json().catch(() => null)) as {
        error?: string
      } | null

      if (!response.ok) {
        setStatus('error')
        setErrorMessage(
          data?.error ?? 'Something went wrong. Please try again.',
        )
        return
      }

      setValues(INITIAL)
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="contact-form-success flex flex-col gap-4 border-t border-[#2B4625]/15 pt-8"
        role="status"
        aria-live="polite"
      >
        <p className="font-serif text-[clamp(1.75rem,3.5vw,2.35rem)] font-normal leading-[1.2] tracking-[-0.03em] text-[#2B4625]">
          Message sent
        </p>
        <p className="max-w-[40ch] font-sans text-base font-light leading-7 tracking-wide text-[#2B4625]/80">
          Thanks for reaching out — I&apos;ll get back to you as soon as I can.
        </p>
        <button
          type="button"
          className="contact-form-reset mt-2 w-fit font-sans"
          onClick={() => setStatus('idle')}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      className="contact-form relative flex flex-col gap-7 md:gap-8"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-x-8">
        <label className="contact-field">
          <span className="contact-label">Name</span>
          <input
            className="contact-input"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={values.name}
            onChange={update('name')}
            disabled={status === 'submitting'}
          />
        </label>

        <label className="contact-field">
          <span className="contact-label">Email</span>
          <input
            className="contact-input"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={values.email}
            onChange={update('email')}
            disabled={status === 'submitting'}
          />
        </label>
      </div>

      <label className="contact-field">
        <span className="contact-label">
          Company / Agency
          <span className="contact-optional">Optional</span>
        </span>
        <input
          className="contact-input"
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={120}
          value={values.company}
          onChange={update('company')}
          disabled={status === 'submitting'}
        />
      </label>

      <label className="contact-field">
        <span className="contact-label">Message</span>
        <textarea
          className="contact-input contact-textarea"
          name="message"
          required
          rows={5}
          maxLength={2000}
          value={values.message}
          onChange={update('message')}
          disabled={status === 'submitting'}
        />
      </label>

      {/* Honeypot — hidden from users, visible to naive bots */}
      <label className="contact-honeypot" aria-hidden="true">
        <span>Website</span>
        <input
          tabIndex={-1}
          autoComplete="off"
          name="website"
          type="text"
          value={values.website}
          onChange={update('website')}
        />
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <button
          type="submit"
          className="contact-submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>

        {status === 'error' && errorMessage ? (
          <p className="font-sans text-sm font-light tracking-wide text-[#8a3a2a]" role="alert">
            {errorMessage}
          </p>
        ) : (
          <p className="font-sans text-sm font-light tracking-wide text-[#2B4625]/55">
            Or email{' '}
            <a
              href="mailto:hello@thelucho.dev"
              className="font-medium text-[#2B4625] underline decoration-[#2B4625]/35 underline-offset-4 transition-opacity hover:opacity-70"
            >
              hello@thelucho.dev
            </a>
          </p>
        )}
      </div>
    </form>
  )
}
