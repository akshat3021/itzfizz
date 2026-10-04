/** Copy and data for the hero. Edit here; components stay presentational. */

export const HEADLINE_WORDS = ['WELCOME', 'ITZFIZZ'] as const

export const TAGLINE =
  'Grow your business with customized strategies in social media marketing, SEO, web development, branding and UI/UX design.'

export type StatTone = 'brand' | 'pink' | 'lilac' | 'sky'

export interface HeroStat {
  /** Final number the counter animates to. */
  value: number
  suffix: string
  label: string
  /** Card colour, from the brand palette. */
  tone: StatTone
}

export const HERO_STATS: readonly HeroStat[] = [
  { value: 58, suffix: '%', label: 'Increase in pick-up point use', tone: 'brand' },
  { value: 23, suffix: '%', label: 'Decrease in customer phone calls', tone: 'pink' },
  { value: 27, suffix: '%', label: 'Increase in repeat orders', tone: 'lilac' },
  { value: 40, suffix: '%', label: 'Decrease in delivery complaints', tone: 'sky' },
]

/** Where the header call-to-action points. Swap for your real contact URL. */
export const CONTACT_HREF = '#contact'

/** Header links, mirroring itzfizz.com. Point them at real sections/pages. */
export const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Resources', href: '#resources' },
  { label: 'Contact', href: CONTACT_HREF },
] as const
