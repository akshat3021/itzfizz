import { hero } from '@/lib/hero-parts'

/**
 * Fixed pool of tiny dots and thin streaks. They are never created or removed
 * at runtime: animation code recycles them (see animation/particles.ts), and
 * only while the plane is moving fast enough. Invisible until then.
 */
const POOL_SIZE = 24

export function HeroParticles() {
  return (
    <div {...hero('particles')} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {Array.from({ length: POOL_SIZE }, (_, index) => (
        <span key={index} className="absolute top-0 left-0 rounded-full bg-ink opacity-0" />
      ))}
    </div>
  )
}
