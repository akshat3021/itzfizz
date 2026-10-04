import { CONTACT_HREF, NAV_LINKS } from '@/lib/hero-content'
import { hero } from '@/lib/hero-parts'

/** Black pill navigation, like itzfizz.com. */
export function HeroHeader() {
  return (
    <header {...hero('header')} data-intro className="relative z-20">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-ink py-2 pr-2 pl-5 text-white"
      >
        <a
          href="#top"
          aria-label="Itzfizz Digital home"
          className="text-lg font-extrabold tracking-wider"
        >
          ITZFIZZ<span className="text-brand">.</span>
        </a>

        <ul className="hidden items-center gap-1 text-sm font-semibold md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 transition-colors hover:bg-white hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={CONTACT_HREF}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
        >
          Get Started
        </a>
      </nav>
    </header>
  )
}
