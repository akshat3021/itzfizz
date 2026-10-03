import { gsap } from '@/lib/gsap'

/**
 * Time-based entrance, played once on load, in this order:
 *   1. header + headline letters stagger in
 *   2. the car glides in from off-screen left, with a glowing streak
 *   3. stats appear one by one (card slides up, rule draws, counter ticks up)
 * Total is roughly 4.5s. Everything uses opacity and transforms only.
 *
 * Elements touched here (letter, car-intro, intro-trail, stat…) are never
 * touched by the scroll scene, so scrolling during the intro is safe.
 *
 * Returns a cleanup function that also restores the real stat numbers.
 */
export function createIntro(root: HTMLElement): () => void {
  const q = gsap.utils.selector(root)
  const car = q<HTMLElement>('[data-hero="car"]')[0]
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

  const CAR_AT = 1.35
  const STATS_AT = 2.55

  // 1. Headline
  tl.from(q('[data-hero="header"]'), { autoAlpha: 0, y: -16, duration: 0.9 }, 0)
    .from(
      q('[data-hero="letter"]'),
      { autoAlpha: 0, yPercent: 70, duration: 1.1, stagger: 0.055 },
      0.15,
    )
    .from(q('[data-hero="tagline"]'), { autoAlpha: 0, y: 14, duration: 0.9 }, 1.0)

  // 2. Car enters from fully off-screen left. The offset is its own width, and
  //    it already starts partly off-screen, so it begins entirely out of view.
  tl.from(
    q('[data-hero="car-intro"]'),
    { autoAlpha: 0, x: () => -(car?.offsetWidth ?? 600), duration: 1.7, ease: 'power3.out' },
    CAR_AT,
  )
    .fromTo(
      q('[data-hero="intro-trail"]'),
      { opacity: 0, scaleX: 0.2 },
      { opacity: 1, scaleX: 1, duration: 0.6, ease: 'power2.out' },
      CAR_AT + 0.1,
    )
    .to(
      q('[data-hero="intro-trail"]'),
      { opacity: 0, scaleX: 0.25, duration: 1.1, ease: 'power2.inOut' },
      CAR_AT + 1.1,
    )

  // 3. Stats
  q('[data-hero="stat"]').forEach((stat, index) => {
    const startAt = STATS_AT + index * 0.18
    const rule = stat.querySelector('[data-hero="stat-rule"]')
    const number = stat.querySelector<HTMLElement>('[data-hero="stat-number"]')
    if (!rule || !number) return

    // Zero the number *now*, so the card never flashes its final value while
    // it is fading in, before the counter has started.
    number.textContent = '0'

    tl.from(stat, { autoAlpha: 0, y: 26, scale: 0.96, duration: 0.9 }, startAt)
      .from(rule, { scaleX: 0, duration: 1.1, ease: 'power3.inOut' }, startAt)
      .to(
        number,
        {
          textContent: Number(number.dataset.value),
          duration: 1.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
        },
        startAt + 0.1,
      )
  })

  tl.from(q('[data-hero="hint"]'), { autoAlpha: 0, duration: 0.8 }, STATS_AT + 0.9)

  return () => {
    tl.kill()
    // Restore the server-rendered numbers if the intro is torn down mid-count.
    q<HTMLElement>('[data-hero="stat-number"]').forEach((number) => {
      number.textContent = number.dataset.value ?? ''
    })
  }
}
