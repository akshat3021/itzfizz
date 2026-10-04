import { HERO_STATS, type StatTone } from '@/lib/hero-content'

// Full class names so Tailwind can see them at build time.
const TONE: Record<StatTone, string> = {
  brand: 'bg-brand',
  pink: 'bg-pink',
  lilac: 'bg-lilac',
  sky: 'bg-sky',
}

export function HeroStats() {
  return (
    <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
      {HERO_STATS.map((stat) => (
        <li
          key={stat.label}
          data-hero="stat"
          data-intro
          className={`rounded-2xl border-2 border-ink p-3.5 shadow-[4px_4px_0_var(--color-ink)] sm:p-4 ${TONE[stat.tone]}`}
        >
          <div data-hero="stat-rule" className="h-[3px] origin-left rounded-full bg-ink" />
          <p className="mt-3 flex items-baseline text-4xl font-extrabold leading-none tabular-nums sm:text-5xl">
            <span data-hero="stat-number" data-value={stat.value}>
              {stat.value}
            </span>
            <span className="ml-0.5">{stat.suffix}</span>
          </p>
          <p className="mt-2 text-xs font-semibold leading-5 text-ink/80 sm:text-sm">{stat.label}</p>
        </li>
      ))}
    </ul>
  )
}
