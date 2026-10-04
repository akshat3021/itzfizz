import { hero } from '@/lib/hero-parts'

/**
 * Playful outlined doodles in the Itzfizz style (thick black outline, flat
 * brand colours). Purely decorative. The outer span fades in with the intro;
 * the inner SVG turns slowly with scroll, so the two never share an element.
 */
const STROKE = 'var(--color-ink)'

function starPoints(spikes: number, outer: number, inner: number) {
  return Array.from({ length: spikes * 2 }, (_, i) => {
    const radius = i % 2 === 0 ? outer : inner
    const angle = (Math.PI * i) / spikes - Math.PI / 2
    return `${(50 + radius * Math.cos(angle)).toFixed(1)},${(50 + radius * Math.sin(angle)).toFixed(1)}`
  }).join(' ')
}

const doodles = [
  {
    key: 'burst',
    className: 'right-[3%] top-[27%] size-20 lg:size-28',
    spin: 70,
    svg: (
      <polygon
        points={starPoints(11, 46, 26)}
        fill="white"
        stroke={STROKE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    ),
  },
  {
    key: 'ring',
    className: 'left-[2.5%] top-[44%] size-16 lg:size-24',
    spin: -90,
    svg: (
      <>
        <circle cx="50" cy="50" r="38" fill="none" stroke={STROKE} strokeWidth="22" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-pink)" strokeWidth="16" />
      </>
    ),
  },
  {
    key: 'squiggle',
    className: 'bottom-[24%] right-[2%] w-24 lg:w-32',
    spin: 40,
    svg: (
      <>
        <path
          d="M6 50 q11 -34 22 0 t22 0 t22 0 t22 0"
          fill="none"
          stroke={STROKE}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M6 50 q11 -34 22 0 t22 0 t22 0 t22 0"
          fill="none"
          stroke="var(--color-tangerine)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </>
    ),
  },
] as const

export function HeroDoodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
      {doodles.map((doodle) => (
        <span
          key={doodle.key}
          {...hero('doodle-intro')}
          data-intro
          className={`absolute ${doodle.className}`}
        >
          <svg
            {...hero('doodle')}
            data-spin={doodle.spin}
            viewBox="0 0 100 100"
            className="block h-auto w-full overflow-visible"
          >
            {doodle.svg}
          </svg>
        </span>
      ))}
    </div>
  )
}
