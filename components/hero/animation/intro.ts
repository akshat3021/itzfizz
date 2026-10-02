import { gsap } from '@/lib/gsap'

/**
 * Time-based entrance, played once on load.
 *
 * Order: header -> headline letters (staggered) -> tagline -> car glides in ->
 * stats one by one (rule draws, counter ticks up). Everything uses opacity and
 * transforms only, so it stays on the compositor.
 *
 * Returns a cleanup function that also restores the real stat numbers.
 */
export function createIntro(root: HTMLElement): () => void {
  const q = gsap.utils.selector(root)
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

  tl.from(q('[data-hero="header"]'), { autoAlpha: 0, y: -16, duration: 0.9 }, 0)
    .from(
      q('[data-hero="letter"]'),
      { autoAlpha: 0, yPercent: 70, duration: 1.1, stagger: 0.055 },
      0.15,
    )
    .from(q('[data-hero="tagline"]'), { autoAlpha: 0, y: 14, duration: 0.9 }, 0.95)
    .from(
      q('[data-hero="car-intro"]'),
      { autoAlpha: 0, xPercent: -10, scale: 0.97, duration: 1.5, ease: 'power3.out' },
      0.35,
    )
    .from(q('[data-hero="hint"]'), { autoAlpha: 0, duration: 0.8 }, 2.3)

  q('[data-hero="stat"]').forEach((stat, index) => {
    const startAt = 1.15 + index * 0.17
    const rule = stat.querySelector('[data-hero="stat-rule"]')
    const number = stat.querySelector<HTMLElement>('[data-hero="stat-number"]')
    if (!rule || !number) return

    // Zero the number *now*, so the card never flashes its final value while
    // it is fading in, before the counter has started.
    number.textContent = '0'

    tl.from(stat, { autoAlpha: 0, y: 22, duration: 0.8 }, startAt)
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

  return () => {
    tl.kill()
    // Restore the server-rendered numbers if the intro is torn down mid-count.
    q<HTMLElement>('[data-hero="stat-number"]').forEach((number) => {
      number.textContent = number.dataset.value ?? ''
    })
  }
}
