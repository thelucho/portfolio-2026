import Link from 'next/link'

export default function Logo() {
  return (
    <Link
      href="/"
      className="font-serif text-[25px] font-bold leading-[80%] tracking-[-2px] text-[var(--header-fg)] transition-colors duration-500 ease-out"
      aria-label="THELUCHO — Home"
    >
      THELUCHO
    </Link>
  )
}
