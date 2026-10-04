import { hero } from '@/lib/hero-parts'

/** Static atmosphere behind the hero. Only the grid is animated (by GSAP). */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div {...hero('grid')} className="hero-grid absolute inset-y-0 left-0" />
    </div>
  )
}
