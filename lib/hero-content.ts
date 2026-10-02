/** Copy and data for the hero. Edit here; components stay presentational. */

export const HEADLINE_WORDS = ['WELCOME', 'ITZFIZZ'] as const

export const TAGLINE =
  "We make brands impossible to ignore. Strategy, creative and performance built to move at culture's speed."

export interface HeroStat {
  /** Final number the counter animates to. */
  value: number
  suffix: string
  label: string
}

export const HERO_STATS: readonly HeroStat[] = [
  { value: 58, suffix: '%', label: 'Increase in pick-up point use' },
  { value: 23, suffix: '%', label: 'Decrease in customer phone calls' },
  { value: 27, suffix: '%', label: 'Increase in repeat orders' },
  { value: 40, suffix: '%', label: 'Decrease in delivery complaints' },
]

/** Where the header call-to-action points. Swap for your real contact URL. */
export const CONTACT_HREF = '#contact'
