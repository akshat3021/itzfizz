import { HERO_STATS } from '@/lib/hero-content'

export function HeroStats() {
  return (
    <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-8">
      {HERO_STATS.map((stat) => (
        <li key={stat.label} data-hero="stat" data-intro>
          <div data-hero="stat-rule" className="h-px origin-left bg-volt/70" />
          <p className="font-expanded mt-3 flex items-baseline text-4xl font-extrabold leading-none tabular-nums sm:text-5xl">
            <span data-hero="stat-number" data-value={stat.value}>
              {stat.value}
            </span>
            <span className="ml-0.5 text-volt">{stat.suffix}</span>
          </p>
          <p className="mt-2 max-w-[22ch] text-xs leading-5 text-white/60 sm:text-sm">{stat.label}</p>
        </li>
      ))}
    </ul>
  )
}
