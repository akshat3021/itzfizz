/**
 * Fixed pool of tiny dots and thin streaks. They are never created or removed
 * at runtime: animation code recycles them (see animation/particles.ts), and
 * only while the car is moving fast enough. Invisible until then.
 */
const POOL_SIZE = 24

export function HeroParticles() {
  return (
    <div data-hero="particles" aria-hidden="true" className="pointer-events-none absolute inset-0">
      {Array.from({ length: POOL_SIZE }, (_, index) => (
        <span
          key={index}
          className="absolute left-0 top-0 rounded-full bg-volt opacity-0"
        />
      ))}
    </div>
  )
}
