'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAV_ITEMS } from '@/lib/navigation'

function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

const navItemClassName =
  'relative inline-flex items-center font-sans text-base font-light text-[var(--header-fg)] transition-[color,opacity] duration-500 ease-out hover:opacity-70'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-5">
        {NAV_ITEMS.map((item) => {
          const active = !item.soon && isNavActive(pathname, item.href)

          return (
            <li key={item.href}>
              {item.soon ? (
                <span
                  data-cursor="soon"
                  aria-disabled="true"
                  className={navItemClassName}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={navItemClassName}
                >
                  {item.label}
                  {active ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-0 bottom-0 h-px w-[15px] bg-[#929c3b]"
                    />
                  ) : null}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
