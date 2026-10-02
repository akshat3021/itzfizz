/** Static atmosphere behind the hero. Only the grid is animated (by GSAP). */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div data-hero="grid" className="hero-grid absolute inset-y-0 left-0" />
      <div className="absolute left-1/2 top-[46%] size-[min(80vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(198_241_53/0.09),transparent)]" />
    </div>
  )
}
