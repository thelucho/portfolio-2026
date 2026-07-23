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
              className="text-base font-light text-white transition-opacity hover:opacity-70"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
