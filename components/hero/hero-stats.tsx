import { hero } from '@/lib/hero-parts'
import { HERO_STATS, type StatTone } from '@/lib/hero-content'

// Full class names so Tailwind can see them at build time.
const TONE_CLASS: Record<StatTone, string> = {
  brand: 'bg-brand',
  pink: 'bg-pink',
  lilac: 'bg-lilac',
  sky: 'bg-sky',
}

/**
 * Two nested elements per stat, so the load animation and the scroll bounce
 * never fight: `stat` is revealed by the intro, `stat-card` bounces when the
 * plane flies over it.
 */
export function HeroStats() {
  return (
    <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
      {HERO_STATS.map((stat) => (
        <li key={stat.label} {...hero('stat')} data-intro>
          <div
            {...hero('stat-card')}
            className={`rounded-2xl border-2 border-ink p-3.5 shadow-[4px_4px_0_var(--color-ink)] sm:p-4 ${TONE_CLASS[stat.tone]}`}
          >
            <div {...hero('stat-rule')} className="h-[3px] origin-left rounded-full bg-ink" />
            <p className="mt-3 flex items-baseline text-4xl leading-none font-extrabold tabular-nums sm:text-5xl">
              <span {...hero('stat-number')} data-value={stat.value}>
                {stat.value}
              </span>
              <span className="ml-0.5">{stat.suffix}</span>
            </p>
            <p className="mt-2 text-xs leading-5 font-semibold text-ink/80 sm:text-sm">
              {stat.label}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
