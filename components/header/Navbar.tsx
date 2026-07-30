import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/navigation'

export default function Navbar() {
  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-5">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-sans text-base font-light text-[var(--header-fg)] transition-[color,opacity] duration-500 ease-out hover:opacity-70"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
